# Assignment Extensions

> Canvas API — Assignments & Grades  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Set extensions for student assignment submissionsAssignmentExtensionsController#create


### POST /api/v1/courses/:course_id/assignments/:assignment_id/extensions


Responses

- 200 OK if the request was successful
- 403 Forbidden if you are not allowed to extend assignments for this course
- 400 Bad Request if any of the extensions are invalid


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| assignment_extensions[][user_id] | Required | integer | The ID of the user we want to add assignment extensions for. |
| assignment_extensions[][extra_attempts] | Required | integer | Number of times the student is allowed to re-take the assignment over the limit. |


#### Example Request:


```
{
  "assignment_extensions": [{
    "user_id": 3,
    "extra_attempts": 2
  },{
    "user_id": 2,
    "extra_attempts": 2
  }]
}
```


#### Example Response:


```
{
  "assignment_extensions": [AssignmentExtension]
}
```
