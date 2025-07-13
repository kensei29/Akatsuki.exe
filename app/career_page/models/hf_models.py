import os
from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from tools.web_search import web_search
from dotenv import load_dotenv

load_dotenv()
HF_TOKEN = os.getenv("HF_TOKEN")

# --- Base Endpoints ---
llama3_llm = HuggingFaceEndpoint(
    repo_id="meta-llama/Llama-3.1-8B-Instruct",
    huggingfacehub_api_token=HF_TOKEN,
    temperature=0.4,
    max_new_tokens=512,
)

mistral_llm = HuggingFaceEndpoint(
    repo_id="mistralai/Mistral-7B-Instruct-v0.3",
    huggingfacehub_api_token=HF_TOKEN,
    temperature=0.4,
    max_new_tokens=512,
)

codellama_llm = HuggingFaceEndpoint(
    repo_id="codellama/CodeLlama-7b-Instruct-hf",
    huggingfacehub_api_token=HF_TOKEN,
    temperature=0.2,
    max_new_tokens=512,
)

chat_llama = ChatHuggingFace(llm=llama3_llm, verbose=True)
chat_mistral = ChatHuggingFace(llm=mistral_llm, verbose=True)
chat_codellama = ChatHuggingFace(llm=codellama_llm, verbose=True)

llama_with_tools = chat_llama.bind_tools([web_search])
mistral_with_tools = chat_mistral.bind_tools([web_search])
codellama_with_tools = chat_codellama.bind_tools([web_search])

MODEL_REGISTRY = {
    "llama_tools": llama_with_tools,
    "mistral_tools": mistral_with_tools,
    "codellama_tools": codellama_with_tools,
    "llama": chat_llama,
    "mistral": chat_mistral,
    "codellama": chat_codellama
}
