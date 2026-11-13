# Run code

## Set up

Create virtual environment

```sh
python -m venv venv
source ./venv/bin/activate
```

## Install dependencies

```sh
pip install openai fastapi uvicorn python-dotenv httpx
```

`httpx` is only needed to run `python -m unittest test_api.py`.

The server starts without `GITHUB_TOKEN`. `/health` stays available. `/hello` responds with HTTP 503 and names the missing variable. Put allowed browser origins in `CORS_ORIGINS` (comma-separated). The default list is the local lesson pages on ports 8000, 3000, and 5500. A `*` origin leaves credentials off. Set `CORS_ALLOW_CREDENTIALS=true` only with an explicit origin list.

## Run API

```sh
# Method 1: Direct execution
python api.py

# Method 2: Using uvicorn
uvicorn api:app --host 0.0.0.0 --port 5000 --reload
```

## Test API

Visit the interactive API documentation at: `http://localhost:5000/docs`

## Run frontend

Make sure you stand in the frontend folder

Locate *app.js*, change `BASE_URL` to that of your backend URL

Run it

```
npx http-server -p 8000
```

Try typing a message in the chat, you should see a response (providing you're running this in a Codespace or have set up a access token).

## Set up access token (if you don't run this in a Codespace)

See [Set up PAT](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)
