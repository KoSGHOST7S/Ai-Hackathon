# Api Token Scopes

> Canvas API — Authentication & Tokens  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List scopesScopesApiController#index


### BETA: This API endpoint is not finalized, and there could be breaking changes before its final release.


### GET /api/v1/accounts/:account_id/scopes


A list of scopes that can be applied to developer keys and access tokens.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| group_by |  | string | The attribute to group the scopes by. By default no grouping is done. Allowed values: resource_name |
