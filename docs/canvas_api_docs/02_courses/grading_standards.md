# Grading Standards

> Canvas API — Courses  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Create a new grading standardGradingStandardsApiController#create


### POST /api/v1/accounts/:account_id/grading_standards


### POST /api/v1/courses/:course_id/grading_standards


Create a new grading standard


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| title | Required | string | The title for the Grading Standard. |
| points_based |  | boolean | Whether or not a grading scheme is points based. Defaults to false. |
| scaling_factor |  | integer | The factor by which to scale a percentage into a points based scheme grade. This is the maximum number of points possible in the grading scheme. Defaults to 1. Not required for percentage based grading schemes. |
| grading_scheme_entry[][name] | Required | string | The name for an entry value within a GradingStandard that describes the range of the value e.g. A- |
| grading_scheme_entry[][value] | Required | integer | The value for the name of the entry within a GradingStandard. The entry represents the lower bound of the range for the entry. This range includes the value up to the next entry in the GradingStandard, or 100 if there is no upper bound. The lowest value will have a lower bound range of 0. e.g. 93 |


#### Example Request:


```
curl https://<canvas>/api/v1/courses/<course_id>/grading_standards \
  -X POST \
  -H 'Authorization: Bearer <token>' \
  -d 'title=New standard name' \
  -d 'points_based=false' \
  -d 'scaling_factor=1.0' \
  -d 'grading_scheme_entry[][name]=A' \
  -d 'grading_scheme_entry[][value]=94' \
  -d 'grading_scheme_entry[][name]=A-' \
  -d 'grading_scheme_entry[][value]=90' \
  -d 'grading_scheme_entry[][name]=B+' \
  -d 'grading_scheme_entry[][value]=87' \
  -d 'grading_scheme_entry[][name]=B' \
  -d 'grading_scheme_entry[][value]=84' \
  -d 'grading_scheme_entry[][name]=B-' \
  -d 'grading_scheme_entry[][value]=80' \
  -d 'grading_scheme_entry[][name]=C+' \
  -d 'grading_scheme_entry[][value]=77' \
  -d 'grading_scheme_entry[][name]=C' \
  -d 'grading_scheme_entry[][value]=74' \
  -d 'grading_scheme_entry[][name]=C-' \
  -d 'grading_scheme_entry[][value]=70' \
  -d 'grading_scheme_entry[][name]=D+' \
  -d 'grading_scheme_entry[][value]=67' \
  -d 'grading_scheme_entry[][name]=D' \
  -d 'grading_scheme_entry[][value]=64' \
  -d 'grading_scheme_entry[][name]=D-' \
  -d 'grading_scheme_entry[][value]=61' \
  -d 'grading_scheme_entry[][name]=F' \
  -d 'grading_scheme_entry[][value]=0'
```


#### Example Response:


```
{
  "title": "New standard name",
  "id": 1,
  "context_id": 1,
  "context_type": "Course",
  "grading_scheme": [
    {"name": "A", "value": 0.9},
    {"name": "B", "value": 0.8}
  ]
}
```


---

## List the grading standards available in a context.GradingStandardsApiController#context_index


### GET /api/v1/courses/:course_id/grading_standards


### GET /api/v1/accounts/:account_id/grading_standards


Returns the paginated list of grading standards for the given context that are visible to the user.


#### Example Request:


```
curl https://<canvas>/api/v1/courses/1/grading_standards \
  -H 'Authorization: Bearer <token>'
```


---

## Get a single grading standard in a context.GradingStandardsApiController#context_show


### GET /api/v1/courses/:course_id/grading_standards/:grading_standard_id


### GET /api/v1/accounts/:account_id/grading_standards/:grading_standard_id


Returns a grading standard for the given context that is visible to the user.


#### Example Request:


```
curl https://<canvas>/api/v1/courses/1/grading_standards/5 \
  -H 'Authorization: Bearer <token>'
```


---

## Update a grading standardGradingStandardsApiController#update


### PUT /api/v1/courses/:course_id/grading_standards/:grading_standard_id


### PUT /api/v1/accounts/:account_id/grading_standards/:grading_standard_id


Updates the grading standard with the given id


If the grading standard has been used for grading, only the title can be updated. The data, points_based, and scaling_factor cannot be modified once the grading standard has been used to grade assignments.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| title |  | string | The title for the Grading Standard |
| points_based |  | boolean | Whether or not a grading scheme is points based. Defaults to false. |
| scaling_factor |  | integer | The factor by which to scale a percentage into a points based scheme grade. This is the maximum number of points possible in the grading scheme. Defaults to 1. Not required for percentage based grading schemes. |
| grading_scheme_entry[][name] |  | string | The name for an entry value within a GradingStandard that describes the range of the value e.g. A- |
| grading_scheme_entry[][value] | Required | integer | The value for the name of the entry within a GradingStandard. The entry represents the lower bound of the range for the entry. This range includes the value up to the next entry in the GradingStandard, or 100 if there is no upper bound. The lowest value will have a lower bound range of 0. e.g. 93 |


#### Example Request:


```
curl https://<canvas>/api/v1/courses/1/grading_standards/5 \
  -X PUT \
  -H 'Authorization: Bearer <token>' \
  -d 'title=Updated+Grading+Standard'
  -d 'points_based=false' \
  -d 'scaling_factor=1.0' \
  -d 'grading_scheme_entry[][name]=A' \
  -d 'grading_scheme_entry[][value]=94' \
  -d 'grading_scheme_entry[][name]=A-' \
  -d 'grading_scheme_entry[][value]=90' \
  -d 'grading_scheme_entry[][name]=B+' \
  -d 'grading_scheme_entry[][value]=87' \
  -d 'grading_scheme_entry[][name]=B' \
  -d 'grading_scheme_entry[][value]=84' \
  -d 'grading_scheme_entry[][name]=B-' \
  -d 'grading_scheme_entry[][value]=80' \
  -d 'grading_scheme_entry[][name]=C+' \
  -d 'grading_scheme_entry[][value]=77' \
  -d 'grading_scheme_entry[][name]=C' \
  -d 'grading_scheme_entry[][value]=74' \
  -d 'grading_scheme_entry[][name]=C-' \
  -d 'grading_scheme_entry[][value]=70' \
  -d 'grading_scheme_entry[][name]=D+' \
  -d 'grading_scheme_entry[][value]=67' \
  -d 'grading_scheme_entry[][name]=D' \
  -d 'grading_scheme_entry[][value]=64' \
  -d 'grading_scheme_entry[][name]=D-' \
  -d 'grading_scheme_entry[][value]=61' \
  -d 'grading_scheme_entry[][name]=F' \
  -d 'grading_scheme_entry[][value]=0'
```


---

## Delete a grading standardGradingStandardsApiController#destroy


### DELETE /api/v1/courses/:course_id/grading_standards/:grading_standard_id


### DELETE /api/v1/accounts/:account_id/grading_standards/:grading_standard_id


Deletes the grading standard with the given id


#### Example Request:


```
curl https://<canvas>/api/v1/courses/1/grading_standards/5 \
  -X DELETE \
  -H 'Authorization: Bearer <token>'
```
