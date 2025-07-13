from langchain_core.messages import HumanMessage, SystemMessage
from models.hf_models import MODEL_REGISTRY

def chat_with_model(model_name: str, user_message: str) -> str:
    chat_model = MODEL_REGISTRY.get(model_name.lower())
    if not chat_model:
        return f"Model '{model_name}' not found. Choose from: {list(MODEL_REGISTRY.keys())}"

    system = SystemMessage(content="You are a helpful assistant with access to tools that you have to compulsorily use.")
    user = HumanMessage(content=user_message)
    result = chat_model.invoke([system, user])
    return result.content
