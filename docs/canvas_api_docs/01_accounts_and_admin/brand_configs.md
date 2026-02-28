# Brand Configs

> Canvas API — Accounts & Admin  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Get the brand config variables that should be used for this domainBrandConfigsApiController#show


### GET /api/v1/brand_variables


Will redirect to a static json file that has all of the brand variables used by this account. Even though this is a redirect, do not store the redirected url since if the account makes any changes it will redirect to a new url. Needs no authentication.


#### Example Request:


```
curl 'https://<canvas>/api/v1/brand_variables'
```


---

## Get the brand config variables for a sub-account or courseBrandConfigsApiController#show_context


### GET /api/v1/accounts/:account_id/brand_variables


### GET /api/v1/courses/:course_id/brand_variables


Will redirect to a static json file that has all of the brand variables used by the provided context. Even though this is a redirect, do not store the redirected url since if the sub-account makes any changes it will redirect to a new url.


#### Example Request:


```
curl 'https://<canvas>/api/v1/accounts/123/brand_variables'
  -H 'Authorization: Bearer <token>'
```
