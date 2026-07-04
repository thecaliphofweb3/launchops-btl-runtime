# BTL Runtime Quickstart

Use the BTL runtime like an OpenAI-compatible gateway. During the hackathon, registrants receive a scoped API key and free credits.

## Required

- Call the BTL runtime from your project.
- Show the call in your code, logs, README, or demo.
- Use `/v1/chat/completions` or `/v1/responses`.

## Example

```bash
curl https://api.badtheorylabs.com/v1/chat/completions \
  -H "Authorization: Bearer $BTL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-chat",
    "messages": [
      {"role": "user", "content": "Give me three product ideas for a climate dashboard"}
    ]
  }'
```

## Strong project patterns

- Route different tasks through different models behind the gateway.
- Stream output when the user is waiting.
- Use retrieval or memory when context matters.
- Include runtime usage notes in your README.
- Make your demo prove the runtime is central to the product, not an afterthought.
