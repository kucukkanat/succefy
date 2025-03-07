# The Server

The server is written to run in [Deno](https://deno.land) runtime with typescript.
[Hono](https://hono.dev) is for implementing a simple http server.

## Environment variables

The server is configured to run without any environment variables provided.
To change configuration you may provide your own environment variables for `PORT` and `OPENAI_API_KEY`.

### Defaults for environment variables

If there is no `OPENAI_API_KEY` env variable provided, the server uses [pollinations](https://pollinations.ai) for inference by default.

Default server port is `8000` that comes from`PORT` environment variable.

## Endpoints

- `GET /health`: Returns the health status of the server.
- `POST /`: Accepts a CV text content in the request body and returns a JSON object of the candidate's CV.

## Example Usage

To check the health status of the server:

```sh
curl http://localhost:8000/health
```

To convert CV text to JSON:

```sh
curl -X POST http://localhost:8000/ -H "Content-Type: application/json" -d '{"content": "Your CV text here"}'
```

> [!IMPORTANT]
> By default cors is enabled. The api server allows
> requests from all hosts so when you use it beware.
> You may want to put it behind a gateway or a reevrse proxy.

# Building the container

Simply run `./x build` in your terminal

# Running the container

Run

```sh
docker run --rm -it -p 8000:8001 -e PORT=8001 -e OPENAI_API_KEY="sk-****" succefy-cv-server
```
