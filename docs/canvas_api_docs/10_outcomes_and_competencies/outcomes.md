# Outcomes

> Canvas API — Outcomes & Competencies  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Show an outcomeOutcomesApiController#show


### GET /api/v1/outcomes/:id


Returns the details of the outcome with the given id.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| add_defaults |  | boolean | If defaults are requested, then color and mastery level defaults will be added to outcome ratings in the result. This will only take effect if the Account Level Mastery Scales FF is DISABLED |


---

## Update an outcomeOutcomesApiController#update


### PUT /api/v1/outcomes/:id


Modify an existing outcome. Fields not provided are left as is; unrecognized fields are ignored.


If any new ratings are provided, the combination of all new ratings provided completely replace any existing embedded rubric criterion; it is not possible to tweak the ratings of the embedded rubric criterion.


A new embedded rubric criterionâs mastery_points default to the maximum points in the highest rating if not specified in the mastery_points parameter. Any new ratings lacking a description are given a default of âNo descriptionâ. Any new ratings lacking a point value are given a default of 0.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| title |  | string | The new outcome title. |
| display_name |  | string | A friendly name shown in reports for outcomes with cryptic titles, such as common core standards names. |
| description |  | string | The new outcome description. |
| vendor_guid |  | string | A custom GUID for the learning standard. |
| mastery_points |  | integer | The new mastery threshold for the embedded rubric criterion. |
| ratings[][description] |  | string | The description of a new rating level for the embedded rubric criterion. |
| ratings[][points] |  | integer | The points corresponding to a new rating level for the embedded rubric criterion. |
| calculation_method |  | string | The new calculation method. If the Outcomes New Decaying Average Calculation Method FF is ENABLED then âweighted_averageâ can be used and it is same as previous âdecaying_averageâ and new âdecaying_averageâ will have improved version of calculation. Allowed values: weighted_average , decaying_average , n_mastery , latest , highest , average |
| calculation_int |  | integer | The new calculation int.  Only applies if the calculation_method is âdecaying_averageâ or ân_masteryâ |
| add_defaults |  | boolean | If defaults are requested, then color and mastery level defaults will be added to outcome ratings in the result. This will only take effect if the Account Level Mastery Scales FF is DISABLED |


#### Example Request:


```
curl 'https://<canvas>/api/v1/outcomes/1.json' \
     -X PUT \
     -F 'title=Outcome Title' \
     -F 'display_name=Title for reporting' \
     -F 'description=Outcome description' \
     -F 'vendor_guid=customid9001' \
     -F 'mastery_points=3' \
     -F 'calculation_method=decaying_average' \
     -F 'calculation_int=65' \
     -F 'ratings[][description]=Exceeds Expectations' \
     -F 'ratings[][points]=5' \
     -F 'ratings[][description]=Meets Expectations' \
     -F 'ratings[][points]=3' \
     -F 'ratings[][description]=Does Not Meet Expectations' \
     -F 'ratings[][points]=0' \
     -F 'ratings[][points]=0' \
     -H "Authorization: Bearer <token>"
```


```
curl 'https://<canvas>/api/v1/outcomes/1.json' \
     -X PUT \
     --data-binary '{
           "title": "Outcome Title",
           "display_name": "Title for reporting",
           "description": "Outcome description",
           "vendor_guid": "customid9001",
           "mastery_points": 3,
           "ratings": [
             { "description": "Exceeds Expectations", "points": 5 },
             { "description": "Meets Expectations", "points": 3 },
             { "description": "Does Not Meet Expectations", "points": 0 }
           ]
         }' \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <token>"
```


---

## Get outcome alignments for a student or assignmentOutcomesApiController#outcome_alignments


### GET /api/v1/courses/:course_id/outcome_alignments


Returns outcome alignments for a student or assignment in a course.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| course_id | Required | integer | The id of the course |
| student_id |  | integer | The id of the student. Returns alignments filtered by student submissions. Can be combined with assignment_id to filter to a specific assignment. |
| assignment_id |  | integer | The id of the assignment. When provided without student_id, returns all outcome alignments for the assignment (requires manage_grades or view_all_grades permission). When provided with student_id, filters to that studentâs submission. |
