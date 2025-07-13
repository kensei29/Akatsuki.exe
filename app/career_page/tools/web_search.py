from langchain_core.tools import tool
import json
import requests
import os

@tool
def web_search(query: str) -> str:
    """Perform web search using Serper API for research purposes"""
    try:
        serper_api_key = os.getenv("SERPER_API_KEY")
        if not serper_api_key:
            return "Error: Serper API key not found. Please set SERPER_API_KEY environment variable."
        
        url = "https://google.serper.dev/search"
        payload = json.dumps({
            "q": query,
            "num": 10
        })
        headers = {
            'X-API-KEY': serper_api_key,
            'Content-Type': 'application/json'
        }
        
        response = requests.post(url, headers=headers, data=payload)
        if response.status_code == 200:
            results = response.json()
            
            # Extract relevant information
            search_results = []
            if 'organic' in results:
                for result in results['organic'][:5]:  # Top 5 results
                    search_results.append({
                        'title': result.get('title', ''),
                        'snippet': result.get('snippet', ''),
                        'link': result.get('link', '')
                    })
            
            return json.dumps(search_results, indent=2)
        else:
            return f"Error: API request failed with status {response.status_code}"
    
    except Exception as e:
        return f"Error performing web search: {str(e)}"