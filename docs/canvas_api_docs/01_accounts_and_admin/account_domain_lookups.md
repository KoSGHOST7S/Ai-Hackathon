# Account Domain Lookups

> Canvas API — Accounts & Admin  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Search account domains


### GET /api/v1/accounts/search


Returns a list of up to 5 matching account domains


Partial match on name / domain are supported


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| name |  | string | campus name |
| domain |  | string | no description |
| latitude |  | number | no description |
| longitude |  | number | no description |


#### Example Request:


```
curl https://<canvas>/api/v1/accounts/search \
  -G -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -d 'name=utah'
```


#### Example Response:


```
[
  {
    "name": "University of Utah",
    "domain": "utah.edu",
    "distance": null, // distance is always nil, but preserved in the api response for backwards compatibility
    "authentication_provider": "canvas", // which authentication_provider param to pass to the oauth flow; may be NULL
  },
  ...
]
```
