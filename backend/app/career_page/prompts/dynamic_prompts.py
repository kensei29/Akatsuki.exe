def get_breadth_prompt(web_data: str) -> str:
    return f"""
    You are a career advisor assistant. Using the latest industry trend data below from the web, generate the top 5 career domains in Computer Science.

    Web Search Data:
    {web_data}

    For each domain, provide:
    - Title
    - A 2-line description

    Format your final answer as a JSON list like:
    [
    {{"title": "...", "description": "..."}},
    ...
    ]
    """


def get_in_depth_prompt(domain: str, web_data: str) -> str:
    return f"""
You are a career guidance expert.

Your task is to do a full deep dive on the following domain:
**{domain}**

Here is recent information collected from the web:
{web_data}

Please give a detailed overview of:
- What it is
- Why it matters
- Job roles
- Core skills
- Learning paths
- Certifications
- Companies hiring
- Salary trends
- Future scope

Format this as a clear, well-structured multi-paragraph response.
"""


def get_roadmap_prompt(domain: str, role: str = None) -> str:
    if role:
        focus = f"for the role of a {role}"
    else:
        focus = f"in the field of {domain}"

    return f"""
    Create a full roadmap {focus}.

    Cover:
    - Prerequisites
    - Learning path (beginner to expert)
    - Skill building
    - Project ideas
    - Certification (if any)
    - Timeline estimates
    - Job prep

    Format it clearly step-by-step with headers or bullet points.
    """


def get_mermaid_prompt(roadmap_text: str) -> str:
    return f"""
    Convert the following roadmap into a Mermaid flowchart:

    Roadmap:
    {roadmap_text}

    Only return the mermaid code. Use `graph TD` format.
    """
