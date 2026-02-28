# Inst Access Tokens

> Canvas API — Accounts & Admin  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Create InstAccess tokenInstAccessTokensController#create


### POST /api/v1/inst_access_tokens


Create a unique, encrypted InstAccess token.


Generates a different InstAccess token each time itâs called, each one expires after a short window (1 hour).


#### Example Request:


```
curl 'https://<canvas>/api/v1/inst_access_tokens' \
      -X POST \
      -H "Accept: application/json" \
      -H 'Authorization: Bearer <token>'
```
