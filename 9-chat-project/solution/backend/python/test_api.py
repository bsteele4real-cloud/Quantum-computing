"""Regression tests for chat API startup, token errors, and CORS."""

import os
import unittest

os.environ.pop("GITHUB_TOKEN", None)

import api
import llm
from fastapi.testclient import TestClient


class ChatApiTests(unittest.TestCase):
    def setUp(self):
        self._previous = os.environ.get("GITHUB_TOKEN")
        os.environ.pop("GITHUB_TOKEN", None)

    def tearDown(self):
        if self._previous is None:
            os.environ.pop("GITHUB_TOKEN", None)
        else:
            os.environ["GITHUB_TOKEN"] = self._previous

    def test_import_does_not_require_token(self):
        self.assertTrue(callable(llm.call_llm))
        self.assertIs(api.MissingGitHubTokenError, llm.MissingGitHubTokenError)

    def test_call_llm_names_the_missing_token(self):
        with self.assertRaises(llm.MissingGitHubTokenError) as caught:
            llm.call_llm("hello", "You are a helper.")
        self.assertIn("GITHUB_TOKEN", str(caught.exception))

    def test_health_starts_without_token(self):
        client = TestClient(api.app)
        response = client.get("/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "healthy")

    def test_hello_returns_clear_error_without_token(self):
        client = TestClient(api.app)
        response = client.post("/hello", json={"message": "hello"})
        self.assertEqual(response.status_code, 503)
        self.assertIn("GITHUB_TOKEN", response.json()["detail"])

    def test_empty_message_is_rejected_before_the_token_check(self):
        client = TestClient(api.app)
        response = client.post("/hello", json={"message": "   "})
        self.assertEqual(response.status_code, 400)
        self.assertIn("empty", response.json()["detail"].lower())

    def test_default_cors_is_an_allowlist_without_credentials(self):
        origins, credentials = api.resolve_cors({})
        self.assertNotIn("*", origins)
        self.assertIn("http://localhost:8000", origins)
        self.assertFalse(credentials)

    def test_wildcard_never_enables_credentials(self):
        origins, credentials = api.resolve_cors(
            {"CORS_ORIGINS": "*", "CORS_ALLOW_CREDENTIALS": "true"}
        )
        self.assertEqual(origins, ["*"])
        self.assertFalse(credentials)

    def test_explicit_origins_can_opt_into_credentials(self):
        origins, credentials = api.resolve_cors(
            {
                "CORS_ORIGINS": "https://lessons.example",
                "CORS_ALLOW_CREDENTIALS": "true",
            }
        )
        self.assertEqual(origins, ["https://lessons.example"])
        self.assertTrue(credentials)

    def test_running_app_does_not_pair_wildcard_with_credentials(self):
        cors = next(
            middleware
            for middleware in api.app.user_middleware
            if getattr(middleware, "kwargs", {}).get("allow_origins") is not None
        )
        origins = cors.kwargs["allow_origins"]
        credentials = cors.kwargs["allow_credentials"]
        self.assertFalse(credentials and "*" in origins)


if __name__ == "__main__":
    unittest.main()
