# Discovery Pages

> Canvas API — Miscellaneous  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Get Discovery PageDiscoveryPagesApiController#show


### GET /api/v1/discovery_pages


Get the discovery page configuration for the domain root account.


#### Example Request:


```
curl 'https://<canvas>/api/v1/discovery_pages' \
  -H 'Authorization: Bearer <token>'
```


#### Example Response:


```
{
  "discovery_page": {
    "primary": [
      {
        "authentication_provider_id": 1,
        "label": "Students",
        "icon_url": "https://example.com/icons/students.svg"
      }
    ],
    "secondary": [
      {
        "authentication_provider_id": 3,
        "label": "Admins"
      }
    ],
    "active": true
  }
}
```


---

## Update Discovery PageDiscoveryPagesApiController#upsert


### PUT /api/v1/discovery_pages


Update or create the discovery page configuration for the domain root account. This is a full replacement - provide the complete configuration including primary, secondary, and active fields. Any fields omitted will be removed.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| discovery_page[primary][][authentication_provider_id] | Required | integer | The ID of an active authentication provider for this account. |
| discovery_page[primary][][label] | Required | string | The display label for this authentication provider button. |
| discovery_page[primary][][icon_url] |  | string | URL to an icon image for this authentication provider button. |
| discovery_page[secondary][][authentication_provider_id] | Required | integer | The ID of an active authentication provider for this account. |
| discovery_page[secondary][][label] | Required | string | The display label for this authentication provider button. |
| discovery_page[secondary][][icon_url] |  | string | URL to an icon image for this authentication provider button. |
| discovery_page[active] |  | boolean | Whether the discovery page is enabled. Defaults to false if not provided. |


#### Example Request:


```
curl -X PUT 'https://<canvas>/api/v1/discovery_pages' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "discovery_page": {
      "primary": [
        {
          "authentication_provider_id": 1,
          "label": "Students",
          "icon_url": "https://example.com/icons/students.svg"
        },
        {
          "authentication_provider_id": 2,
          "label": "Faculty",
          "icon_url": "https://example.com/icons/faculty.svg"
        }
      ],
      "secondary": [
        {
          "authentication_provider_id": 3,
          "label": "Admins"
        }
      ],
      "active": true
    }
  }'
```


#### Example Response:


```
{
  "discovery_page": {
    "primary": [
      {
        "authentication_provider_id": 1,
        "label": "Students",
        "icon_url": "https://example.com/icons/students.svg"
      },
      {
        "authentication_provider_id": 2,
        "label": "Faculty",
        "icon_url": "https://example.com/icons/faculty.svg"
      }
    ],
    "secondary": [
      {
        "authentication_provider_id": 3,
        "label": "Admins"
      }
    ],
    "active": true
  }
}
```
