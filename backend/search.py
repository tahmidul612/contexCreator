import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from google import genai
from google.genai.types import GenerateContentConfig
import yaml
from tavily import TavilyClient
import json
from typing import Any, Dict, List, Optional

load_dotenv()

# Initialize Gemini and Tavily clients
gemini_api = os.getenv("GEMINI_API_KEY")
gemini_client = genai.Client()
tavily_api = os.getenv("TAVILY_API_KEY")
tavily_client = TavilyClient(tavily_api)

app = FastAPI()

# Global variable for user prompt context (thread-unsafe, meant for illustration)
USER_PROMPT: Optional[str] = None

def load_prompt(prompt_name: str, filepath: str = "backend/system_prompts.yml") -> str:
    """Load a prompt from a YAML file."""
    with open(filepath, "r") as file:
        prompts = yaml.safe_load(file)
        return prompts.get(prompt_name, "")

class GenerateRequest(BaseModel):
    query: str
    format: Optional[str] = "social_post"  # Specify output ("social_post", "youtube_script", etc.)

def generate_search_query_from_user_input(user_prompt: str) -> str:
    """
    Use Gemini to generate a Tavily search query given a user prompt.
    """
    prompt = (
        "Given the following user prompt, generate a concise search query compatible with Tavily search API. "
        "Only output the search query text.\n\n"
        f"User prompt: {user_prompt}"
    )
    response = gemini_client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=GenerateContentConfig(
            system_instruction=[load_prompt("gemini_search")]
        )
    )
    return response.text.strip()

def tavily_search(query: str, max_results: int = 5) -> List[Dict[str, Any]]:
    """
    Search Tavily for relevant URLs.
    """
    try:
        results = tavily_client.search(query=query, search_depth="advanced", max_results=max_results)
        # Expect results to have a 'results' or 'links' key
        urls = []
        if isinstance(results, dict):
            for k in ["results", "links", "items"]:
                if k in results:
                    urls = [r["url"] if isinstance(r, dict) and "url" in r else r for r in results[k]]
                    break
            if not urls and "url" in results:
                urls = [results["url"]]
        elif isinstance(results, list):
            urls = [r.get("url", r) if isinstance(r, dict) else r for r in results]
        return urls[:max_results]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Tavily search error: {e}")

def tavily_sitemap(urls: List[str]) -> List[str]:
    """
    Expand a list of URLs into their sitemaps using Tavily.
    Returns a flat list of discovered URLs.
    """
    sitemap_urls = []
    for url in urls:
        try:
            result = tavily_client.map(url=url)
            if 'urls' in result:
                sitemap_urls.extend(result['urls'])
            elif isinstance(result, list):
                sitemap_urls.extend(result)
        except Exception:
            continue
    return sitemap_urls

def gemini_filter_urls_via_prompt(user_prompt: str, sitemap_urls: List[str]) -> List[str]:
    """
    Filter relevant URLs from the sitemap using the initial user prompt as context.
    """
    filter_prompt = (
        "Given the list of sitemap URLs below and the user's content creation intent, "
        "select and return as a JSON array the 5 most relevant URLs for content creation."
        "\n\nUser's intent:\n"
        f"{user_prompt}\n\n"
        "Sitemap URLs:\n"
        + "\n".join(sitemap_urls)
    )
    response = gemini_client.models.generate_content(
        model="gemini-2.5-flash",
        contents=filter_prompt
    )
    output = response.text.strip()
    try:
        if output.startswith("```json"):
            output = output.strip("`").replace("json", "", 1).strip()
        elif output.startswith("```"):
            output = output.strip("`").strip()
        filtered = json.loads(output)
        if isinstance(filtered, list):
            return filtered[:5]
    except Exception:
        pass
    return sitemap_urls[:5]  # Fallback: return the top 5

def tavily_crawl(urls: List[str]) -> List[Dict[str, Any]]:
    """
    Crawl provided URLs using Tavily.
    """
    crawled_data = []
    for url in urls:
        try:
            result = tavily_client.crawl(url=url)
            crawled_data.append({"url": url, "content": result.get("content", "")})
        except Exception as e:
            crawled_data.append({"url": url, "content": "", "error": str(e)})
    return crawled_data

def generate_content_with_gemini(user_prompt: str, crawled_data: List[Dict[str, Any]], output_format: str = "social_post") -> str:
    """
    Generate a social post, YouTube script, or IG reel script based on the requested format.
    """
    content_snippets = "\n\n".join(
        [f"URL: {item['url']}\nContent: {item['content'][:500]}" for item in crawled_data if item.get('content')]
    )
    format_instruction = (
        "POST:\n<write the post here>\nSOURCE_URLS:\n- <url1>\n..." if output_format == "social_post"
        else "YOUTUBE SCRIPT:\n<write youtube script here>\nSOURCE_URLS:\n- <url1>\n..." if output_format == "youtube_script"
        else "REEL SCRIPT:\n<write instagram reel script here>\nSOURCE_URLS:\n- <url1>\n..."
    )

    prompt = (
        f"Based on the user's request and the following web contents, generate a {output_format.replace('_', ' ')}.\n"
        f"Format:\n\"\"\"\n{format_instruction}\n\"\"\"\n\n"
        f"USER REQUEST:\n{user_prompt}\n\n"
        f"WEB CONTENTS:\n{content_snippets}\n"
        "Return only the filled out template in your response."
    )
    response = gemini_client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    return response.text.strip()

@app.post("/generate")
def generate_content_endpoint(request: GenerateRequest):
    """
    Complete workflow for generating content (social post, YouTube script, or IG reel script).
    """
    global USER_PROMPT
    USER_PROMPT = request.query  # Save for context, but not thread-safe!

    # Step 1: Generate search query from user prompt
    search_query = generate_search_query_from_user_input(USER_PROMPT)

    # Step 2: Search using Tavily and get relevant URLs
    search_urls = tavily_search(search_query, max_results=5)

    # Step 3: Expand those URLs using site maps
    expanded_urls = tavily_sitemap(search_urls)

    # Step 4: Gemini filters the URLs based on original user input
    top_filtered_urls = gemini_filter_urls_via_prompt(USER_PROMPT, expanded_urls)

    # Step 5: Crawl the filtered URLs
    crawled_info = tavily_crawl(top_filtered_urls)

    # Step 6: Generate the final output in the requested format
    final_text = generate_content_with_gemini(USER_PROMPT, crawled_info, output_format=request.format)

    return {"result": final_text}