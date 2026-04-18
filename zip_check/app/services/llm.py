import os
from openai import OpenAI

def get_client():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise Exception("OPENAI_API_KEY not found in environment.")
    return OpenAI(api_key=api_key)

def call_rainmaker(system_prompt: str, user_message: str):
    try:
        client = get_client()

        response = client.chat.completions.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            temperature=0.7,
        )

        return response.choices[0].message.content

    except Exception as e:
        raise Exception(f"LLM ERROR: {str(e)}")
