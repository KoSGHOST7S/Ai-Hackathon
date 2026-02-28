# Jwts

> Canvas API — Authentication & Tokens  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Create JWTJwtsController#create


### POST /api/v1/jwts


Create a unique JWT for use with other Canvas services


Generates a different JWT each time itâs called. Each JWT expires after a short window (1 hour)


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| workflows[] |  | string | Adds additional data to the JWT to be used by the consuming service workflow |
| context_type |  | string | The type of the context to generate the JWT for, in case the workflow requires it. Case insensitive. Allowed values: Course , User , Account |
| context_id |  | integer | The id of the context to generate the JWT for, in case the workflow requires it. |
| context_uuid |  | string | The uuid of the context to generate the JWT for, in case the workflow requires it. Note that context_id and context_uuid are mutually exclusive. If both are provided, an error will be returned. |
| canvas_audience |  | boolean | Defaults to true. If false, the JWT will be signed, but not encrypted, for use in downstream services. The default encrypted behaviour can be used to talk to Canvas itself. |


#### Example Request:


```
curl 'https://<canvas>/api/v1/jwts' \
      -X POST \
      -H "Accept: application/json" \
      -H 'Authorization: Bearer <token>'
```


---

## Refresh JWTJwtsController#refresh


### POST /api/v1/jwts/refresh


Refresh a JWT for use with other canvas services


Generates a different JWT each time itâs called, each one expires after a short window (1 hour).


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| jwt | Required | string | An existing JWT token to be refreshed. The new token will have the same context and workflows as the existing token. |


#### Example Request:


```
curl 'https://<canvas>/api/v1/jwts/refresh' \
      -X POST \
      -H "Accept: application/json" \
      -H 'Authorization: Bearer <token>'
      -d 'jwt=<jwt>'
```
