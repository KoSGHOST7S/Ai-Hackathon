# Access Tokens

> Canvas API — Authentication & Tokens  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List access tokens for a userTokensController#user_generated_tokens


### GET /api/v1/users/:user_id/user_generated_tokens


Returns a list of manually generated access tokens for the specified user. Note that the actual token values are only returned when the token is first created.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| per_page |  | integer | The number of results to return per page. Defaults to 10. Maximum of 100. |


---

## Show an access tokenTokensController#show


### GET /api/v1/users/:user_id/tokens/:id


The ID can be the actual database ID of the token, or the âtoken_hintâ value.


---

## Create an access tokenTokensController#create


### POST /api/v1/users/:user_id/tokens


Create a new access token for the specified user. If the user is not the current user, the token will be created as âpendingâ, and must be activated by the user before it can be used.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| token[purpose] | Required | string | The purpose of the token. |
| token[expires_at] |  | DateTime | The time at which the token will expire. |
| token[scopes][] |  | Array | The scopes to associate with the token. Ignored if the default developer key does not have the âenable scopesâ option enabled. In such cases, the token will inherit the userâs permissions instead. |


---

## Update an access tokenTokensController#update


### PUT /api/v1/users/:user_id/tokens/:id


Update an existing access token.


The ID can be the actual database ID of the token, or the âtoken_hintâ value.


Regenerating an expired token requires a new expiration date.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| token[purpose] |  | string | The purpose of the token. |
| token[expires_at] |  | DateTime | The time at which the token will expire. |
| token[scopes][] |  | Array | The scopes to associate with the token. |
| token[regenerate] |  | boolean | Regenerate the actual token. |


---

## Delete an access tokenTokensController#destroy


### DELETE /api/v1/users/:user_id/tokens/:id


The ID can be the actual database ID of the token, or the âtoken_hintâ value.
