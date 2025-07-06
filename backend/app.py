import asyncio
import io
import os
import traceback
from datetime import datetime
from typing import Optional, List

import requests
from PIL import Image, ImageDraw, ImageFont
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from openai import AzureOpenAI
from pydantic import BaseModel, Field

load_dotenv()


# Pydantic models for request/response
class ThumbnailRequest(BaseModel):
    title: str = Field(..., description="Video title/topic for thumbnail generation")
    overlay_text: Optional[str] = Field(None, description="Text to overlay on the thumbnail")
    # style: str = Field("vibrant and eye-catching", description="Visual style of the thumbnail")
    # theme: str = Field("modern", description="Theme/genre of the thumbnail")
    # additional_elements: Optional[List[str]] = Field(None, description="Additional elements to include")
    # font_size: int = Field(60, ge=20, le=120, description="Font size for overlay text")
    # text_color: str = Field("white", description="Color of the overlay text")
    # stroke_color: str = Field("black", description="Color of the text stroke")
    # stroke_width: int = Field(3, ge=0, le=10, description="Width of the text stroke")
    # position: str = Field("center", description="Text position: center, top, or bottom")
    # quality: str = Field("hd", description="Image quality: standard or hd")


class ThumbnailResponse(BaseModel):
    message: str
    thumbnail_id: str
    generation_time: float


class AsyncThumbnailGenerator:
    def __init__(self):
        self.client = AzureOpenAI(
            api_key=os.getenv("AZURE_OPENAI_API_KEY"),
            api_version="2024-02-01",
            azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
        )
        self.thumbnail_size = (1280, 720)

    async def generate_thumbnail(
            self,
            title: str,
            style: str = "vibrant and eye-catching",
            theme: str = "modern",
            additional_elements: Optional[List[str]] = None,
            quality: str = "hd"
    ) -> str:
        """Generate thumbnail using DALL-E 3."""
        prompt = self._build_prompt(title, style, theme, additional_elements)

        try:
            # Run the OpenAI API call in a thread to avoid blocking
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: self.client.images.generate(
                    model="dall-e-3",
                    prompt=prompt,
                    size="1792x1024",
                    quality='hd',
                    n=1,
                )
            )
            return response.data[0].url
        except Exception as e:
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"Error generating thumbnail: {str(e)}")

    def _build_prompt(
            self,
            title: str,
            style: str,
            theme: str,
            additional_elements: Optional[List[str]] = None
    ) -> str:
        """Build the DALL-E prompt for thumbnail generation."""
        prompt = f"""Create a YouTube thumbnail image for a video titled "{title}". 
        
        Background: A minimal and energetic pattern, 
        with high contrast colors such as red, yellow, or orange to create urgency and excitement.
        
        Text Layout: Use large, bold, uppercase text split across 2–3 segments 
        Combine contrasting color blocks (e.g., black, white, yellow) behind text for emphasis
        Include dynamic font choices such as sans-serif, bold, and condensed styles
        Apply mild shadows or outlines to ensure legibility
        
        Visual Elements:Add hand-drawn arrows or shapes pointing toward text to guide the viewer's eye
        Optionally include emoji-style icons or comic effects like bursts, stars, or exclamation marks
        
        Human Element: Place a person or character on one side (left or right), with a strong emotional expression (e.g., surprise, excitement, shock)
        Use a sticker-style white border or cut-out effect around them for emphasis
        
        Requirements:
        - 16:9 aspect ratio (landscape orientation)
        - High contrast and vibrant colors that stand out
        - Clear focal point that draws attention
        - Professional and polished appearance
        - Optimized for small display sizes (will be viewed as small thumbnails)
        - No text overlay (text will be added separately)
        - Eye-catching and clickable design
        """

        if additional_elements:
            prompt += f"\n\nAdditional elements to include: {', '.join(additional_elements)}"

        prompt += "\n\nThe image should be visually striking and make viewers want to click on the video."
        return prompt

    async def download_and_process_image(
            self,
            image_url: str,
            overlay_text: Optional[str] = None,
            font_size: int = 60,
            text_color: str = "white",
            stroke_color: str = "black",
            stroke_width: int = 3,
            position: str = "center"
    ) -> io.BytesIO:
        """Download image and optionally add text overlay."""
        try:
            # Download the image
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: requests.get(image_url, timeout=30)
            )
            response.raise_for_status()

            # Process the image
            img = Image.open(io.BytesIO(response.content))
            img_resized = img.resize(self.thumbnail_size, Image.Resampling.LANCZOS)

            # Add text overlay if specified
            if overlay_text:
                img_resized = self._add_text_overlay(
                    img_resized, overlay_text, font_size, text_color,
                    stroke_color, stroke_width, position
                )

            # Convert to bytes
            img_bytes = io.BytesIO()
            img_resized.save(img_bytes, format='JPEG', quality=95)
            img_bytes.seek(0)

            return img_bytes

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

    def _add_text_overlay(
            self,
            img: Image.Image,
            text: str,
            font_size: int,
            text_color: str,
            stroke_color: str,
            stroke_width: int,
            position: str
    ) -> Image.Image:
        """Add text overlay to image."""
        draw = ImageDraw.Draw(img)

        # Try to use a bold font, fall back to default if not available
        try:
            font = ImageFont.truetype("arial.ttf", font_size)
        except:
            try:
                font = ImageFont.truetype("Arial Bold.ttf", font_size)
            except:
                font = ImageFont.load_default()

        # Get text dimensions
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]

        # Calculate text position
        img_width, img_height = img.size

        if position == "center":
            x = (img_width - text_width) // 2
            y = (img_height - text_height) // 2
        elif position == "top":
            x = (img_width - text_width) // 2
            y = 50
        elif position == "bottom":
            x = (img_width - text_width) // 2
            y = img_height - text_height - 50
        else:
            x = (img_width - text_width) // 2
            y = (img_height - text_height) // 2

        # Draw text with stroke
        if stroke_width > 0:
            for dx in range(-stroke_width, stroke_width + 1):
                for dy in range(-stroke_width, stroke_width + 1):
                    if dx != 0 or dy != 0:
                        draw.text((x + dx, y + dy), text, font=font, fill=stroke_color)

        # Draw main text
        draw.text((x, y), text, font=font, fill=text_color)

        return img


# Initialize FastAPI app
app = FastAPI(
    title="YouTube Thumbnail Generator API",
    description="Generate custom YouTube thumbnails using OpenAI DALL-E 3",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1", "*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Global variables (in production, use environment variables)
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version="2024-02-01",
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
)

generator = AsyncThumbnailGenerator()

# Preset configurations
THUMBNAIL_PRESETS = {
    "tech": {
        "style": "modern and professional",
        "theme": "technology",
        "additional_elements": ["computer screens", "code", "tech gadgets", "blue/purple color scheme"]
    },
    "gaming": {
        "style": "dynamic and energetic",
        "theme": "gaming",
        "additional_elements": ["gaming controllers", "neon lights", "action effects", "bold colors"]
    },
    "educational": {
        "style": "clean and informative",
        "theme": "educational",
        "additional_elements": ["books", "learning materials", "bright lighting", "professional appearance"]
    },
    "lifestyle": {
        "style": "bright and inspirational",
        "theme": "lifestyle",
        "additional_elements": ["natural lighting", "modern decor", "positive atmosphere", "clean aesthetic"]
    },
    "cooking": {
        "style": "appetizing and warm",
        "theme": "food and cooking",
        "additional_elements": ["delicious food", "kitchen setting", "warm colors", "mouth-watering presentation"]
    },
    "fitness": {
        "style": "energetic and motivational",
        "theme": "fitness and health",
        "additional_elements": ["gym equipment", "active poses", "bright colors", "motivational atmosphere"]
    }
}


@app.get("/")
async def root():
    return {"message": "YouTube Thumbnail Generator API", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}


@app.get("/presets")
async def get_presets():
    """Get available thumbnail presets."""
    return {"presets": THUMBNAIL_PRESETS}


@app.post("/generate/thumbnail", response_class=StreamingResponse)
async def generate_thumbnail(request: ThumbnailRequest):
    """
    Generate a YouTube thumbnail and return it as an image.

    - **title**: Video title/topic for thumbnail generation
    - **overlay_text**: Optional text to overlay on the thumbnail
    - **style**: Visual style (default: "vibrant and eye-catching")
    - **theme**: Theme/genre (default: "modern")
    - **additional_elements**: List of additional elements to include
    - **font_size**: Font size for overlay text (20-120, default: 60)
    - **text_color**: Color of overlay text (default: "white")
    - **stroke_color**: Color of text stroke (default: "black")
    - **stroke_width**: Width of text stroke (0-10, default: 3)
    - **position**: Text position - "center", "top", or "bottom" (default: "center")
    - **quality**: Image quality - "standard" or "hd" (default: "hd")
    """
    start_time = datetime.now()

    try:
        print("title", request.title)
        # Generate thumbnail using DALL-E 3
        image_url = await generator.generate_thumbnail(
            title=request.title,
            # style=request.style,
            # theme=request.theme,
            # additional_elements=request.additional_elements,
            # quality=request.quality
        )

        # Download and process the image
        img_bytes = await generator.download_and_process_image(
            image_url=image_url,
            # overlay_text=request.overlay_text,
            # font_size=request.font_size,
            # text_color=request.text_color,
            # stroke_color=request.stroke_color,
            # stroke_width=request.stroke_width,
            # position=request.position
        )

        return JSONResponse({
            "thumbnail_url": image_url,
            "generated_at": datetime.now().isoformat()
        })

        # Return image as streaming response
        # return StreamingResponse(
        #     io.BytesIO(img_bytes.read()),
        #     media_type="image/jpeg",
        #     headers={
        #         "Content-Disposition": f"inline; filename=thumbnail_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg",
        #         "X-Generation-Time": str((datetime.now() - start_time).total_seconds())
        #     }
        # )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/generate/thumbnail/preset", response_class=StreamingResponse)
async def generate_thumbnail_preset(
        preset: str = Query(..., description="Preset name (tech, gaming, educational, lifestyle, cooking, fitness)"),
        title: str = Query(..., description="Video title/topic"),
        overlay_text: Optional[str] = Query(None, description="Text to overlay on thumbnail"),
        font_size: int = Query(60, ge=20, le=120, description="Font size for overlay text"),
        text_color: str = Query("white", description="Color of overlay text"),
        stroke_color: str = Query("black", description="Color of text stroke"),
        stroke_width: int = Query(3, ge=0, le=10, description="Width of text stroke"),
        position: str = Query("center", description="Text position: center, top, or bottom"),
        quality: str = Query("hd", description="Image quality: standard or hd")
):
    """
    Generate a thumbnail using a preset configuration.

    Available presets: tech, gaming, educational, lifestyle, cooking, fitness
    """
    if preset not in THUMBNAIL_PRESETS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid preset. Available presets: {', '.join(THUMBNAIL_PRESETS.keys())}"
        )

    preset_config = THUMBNAIL_PRESETS[preset]

    # Create request object with preset configuration
    request = ThumbnailRequest(
        title=title,
        overlay_text=overlay_text,
        # style=preset_config["style"],
        # theme=preset_config["theme"],
        # additional_elements=preset_config["additional_elements"],
        # font_size=font_size,
        # text_color=text_color,
        # stroke_color=stroke_color,
        # stroke_width=stroke_width,
        # position=position,
        # quality=quality
    )

    return await generate_thumbnail(request)


@app.get("/generate/thumbnail/url")
async def generate_thumbnail_url(
        title: str = Query(..., description="Video title/topic"),
        style: str = Query("vibrant and eye-catching", description="Visual style"),
        theme: str = Query("modern", description="Theme/genre"),
        quality: str = Query("hd", description="Image quality: standard or hd")
):
    """
    Generate a thumbnail and return the DALL-E image URL (without processing).
    Useful for getting the raw generated image URL.
    """
    try:
        image_url = await generator.generate_thumbnail(
            title=title,
            style=style,
            theme=theme,
            quality=quality
        )

        return {
            "image_url": image_url,
            "title": title,
            "style": style,
            "theme": theme,
            "quality": quality,
            "generated_at": datetime.now().isoformat()
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail, "timestamp": datetime.now().isoformat()}
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "timestamp": datetime.now().isoformat()}
    )


# Run the app
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=8000)
