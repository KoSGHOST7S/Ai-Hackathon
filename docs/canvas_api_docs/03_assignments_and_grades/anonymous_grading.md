# Anonymous Grading

> Canvas API — Assignments & Grades  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Show provisional grade status for a studentAnonymousProvisionalGradesController#status


### GET /api/v1/courses/:course_id/assignments/:assignment_id/anonymous_provisional_grades/status


Determine whether or not the studentâs submission needs one or more provisional grades.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| anonymous_id |  | string | The id of the student to show the status for |


#### Example Request:


```
curl 'https://<canvas>/api/v1/courses/1/assignments/2/anonymous_provisional_grades/status?anonymous_id=1'
```


#### Example Response:


```
{ "needs_provisional_grade": false }
```
