import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from google import genai
import yaml

load_dotenv()

gemini_api = os.getenv("GEMINI_API_KEY")
gemini_client = genai.Client()

app = FastAPI()

def load_prompt(prompt_name: str, filepath: str = "system_prompts.yml") -> str:
    """
    Load a prompt from a YAML file given its name.
    """
    with open(filepath, "r") as file:
        prompts = yaml.safe_load(file)
        return prompts.get(prompt_name, "")

class GenerateRequest(BaseModel):
    query: str = None  # Optionally specify in POST payload

@app.post("/generate")
def generate_content(request: GenerateRequest):
    """
    Endpoint to generate content using Gemini.
    """
    system_instruction = load_prompt("gemini_search")
    input_content = request.query if request.query else system_instruction

    try:
        response = gemini_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=input_content,
            system_instruction=system_instruction
        )
        return {"result": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
