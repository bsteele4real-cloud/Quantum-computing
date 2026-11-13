import logging
import os

try:
    from dotenv import load_dotenv
except ImportError:  # python-dotenv is optional when the token is already exported
    load_dotenv = None

from openai import OpenAI

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

if load_dotenv is not None:
    load_dotenv()

# Model and endpoint configuration. The token is read when a chat request runs
# so /health can start before a learner exports GITHUB_TOKEN.
MODEL_NAME = os.environ.get("LLM_MODEL", "openai/gpt-4o-mini")
BASE_URL = os.environ.get("LLM_BASE_URL", "https://models.github.ai/inference")


class MissingGitHubTokenError(RuntimeError):
    """Raised when a chat request needs GITHUB_TOKEN and it is not set."""


def require_github_token() -> str:
    """Return the GitHub token or raise a clear error the API can show."""
    token = os.environ.get("GITHUB_TOKEN")
    if not token:
        raise MissingGitHubTokenError(
            "GITHUB_TOKEN environment variable is not set. "
            "Set it to a GitHub personal access token before calling the chat endpoint."
        )
    return token


def call_llm(prompt: str, system_message: str, temperature: float = 1.0, max_tokens: int = 4096, top_p: float = 1.0) -> str:
    """
    Calls the LLM with the given prompt and system message.
    Returns the model's response as a string.
    """
    token = require_github_token()
    client = OpenAI(
        base_url=BASE_URL,
        api_key=token,
    )
    try:
        logger.info("Calling LLM model '%s'", MODEL_NAME)
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": prompt}
            ],
            model=MODEL_NAME,
            temperature=temperature,
            max_tokens=max_tokens,
            top_p=top_p
        )
        content = response.choices[0].message.content
        logger.info("LLM response received successfully.")
        return content
    except Exception as e:
        logger.error("Error calling LLM: %s", e)
        return "Sorry, there was an error processing your request."

# Example usage (for testing)
if __name__ == "__main__":
    test_prompt = "Hello, how are you?"
    test_system = "You are a friendly assistant."
    print(call_llm(test_prompt, test_system))
