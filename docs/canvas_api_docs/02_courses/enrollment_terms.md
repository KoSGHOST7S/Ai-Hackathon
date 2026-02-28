# Enrollment Terms

> Canvas API — Courses  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Create enrollment termTermsController#create


### POST /api/v1/accounts/:account_id/terms


Create a new enrollment term for the specified account.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| enrollment_term[name] |  | string | The name of the term. |
| enrollment_term[start_at] |  | DateTime | The day/time the term starts. Accepts times in ISO 8601 format, e.g. 2015-01-10T18:48:00Z. |
| enrollment_term[end_at] |  | DateTime | The day/time the term ends. Accepts times in ISO 8601 format, e.g. 2015-01-10T18:48:00Z. |
| enrollment_term[sis_term_id] |  | string | The unique SIS identifier for the term. |
| enrollment_term[overrides][enrollment_type][start_at] |  | DateTime | The day/time the term starts, overridden for the given enrollment type. enrollment_type can be one of StudentEnrollment, TeacherEnrollment, TaEnrollment, or DesignerEnrollment |
| enrollment_term[overrides][enrollment_type][end_at] |  | DateTime | The day/time the term ends, overridden for the given enrollment type. enrollment_type can be one of StudentEnrollment, TeacherEnrollment, TaEnrollment, or DesignerEnrollment |


---

## Update enrollment termTermsController#update


### PUT /api/v1/accounts/:account_id/terms/:id


Update an existing enrollment term for the specified account.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| enrollment_term[name] |  | string | The name of the term. |
| enrollment_term[start_at] |  | DateTime | The day/time the term starts. Accepts times in ISO 8601 format, e.g. 2015-01-10T18:48:00Z. |
| enrollment_term[end_at] |  | DateTime | The day/time the term ends. Accepts times in ISO 8601 format, e.g. 2015-01-10T18:48:00Z. |
| enrollment_term[sis_term_id] |  | string | The unique SIS identifier for the term. |
| enrollment_term[overrides][enrollment_type][start_at] |  | DateTime | The day/time the term starts, overridden for the given enrollment type. enrollment_type can be one of StudentEnrollment, TeacherEnrollment, TaEnrollment, or DesignerEnrollment |
| enrollment_term[overrides][enrollment_type][end_at] |  | DateTime | The day/time the term ends, overridden for the given enrollment type. enrollment_type can be one of StudentEnrollment, TeacherEnrollment, TaEnrollment, or DesignerEnrollment |
| override_sis_stickiness |  | boolean | Default is true. If false, any fields containing âstickyâ changes will not be updated. See SIS CSV Format documentation for information on which fields can have SIS stickiness |


---

## Delete enrollment termTermsController#destroy


### DELETE /api/v1/accounts/:account_id/terms/:id


Delete the specified enrollment term.


---

## List enrollment termsTermsApiController#index


### GET /api/v1/accounts/:account_id/terms


An object with a paginated list of all of the terms in the account.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| workflow_state[] |  | string | If set, only returns terms that are in the given state. Defaults to âactiveâ. Allowed values: active , deleted , all |
| include[] |  | string | Array of additional information to include. âoverridesâ term start/end dates overridden for different enrollment types âcourse_countâ the number of courses in each term Allowed values: overrides |
| term_name |  | string | If set, only returns terms that match the given search keyword. Search keyword is matched against term name. |


#### Example Request:


```
curl -H 'Authorization: Bearer <token>' \
https://<canvas>/api/v1/accounts/1/terms?include[]=overrides
```


#### Example Response:


```
{
  "enrollment_terms": [
    {
      "id": 1,
      "name": "Fall 20X6"
      "start_at": "2026-08-31T20:00:00Z",
      "end_at": "2026-12-20T20:00:00Z",
      "created_at": "2025-01-02T03:43:11Z",
      "workflow_state": "active",
      "grading_period_group_id": 1,
      "sis_term_id": null,
      "overrides": {
        "StudentEnrollment": {
          "start_at": "2026-09-03T20:00:00Z",
          "end_at": "2026-12-19T20:00:00Z"
        },
        "TeacherEnrollment": {
          "start_at": null,
          "end_at": "2026-12-30T20:00:00Z"
        }
      }
    }
  ]
}
```


---

## Retrieve enrollment termTermsApiController#show


### GET /api/v1/accounts/:account_id/terms/:id


Retrieves the details for an enrollment term in the account. Includes overrides by default.


#### Example Request:


```
curl -H 'Authorization: Bearer <token>' \
https://<canvas>/api/v1/accounts/1/terms/2
```
