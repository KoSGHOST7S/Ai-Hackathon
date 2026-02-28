# Moderated Grading

> Canvas API — Assignments & Grades  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List students selected for moderationModerationSetController#index


### GET /api/v1/courses/:course_id/assignments/:assignment_id/moderated_students


Returns a paginated list of students selected for moderation


---

## Select students for moderationModerationSetController#create


### POST /api/v1/courses/:course_id/assignments/:assignment_id/moderated_students


Returns an array of users that were selected for moderation


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| student_ids[] |  | number | user ids for students to select for moderation |


---

## Bulk select provisional gradesProvisionalGradesController#bulk_select


### PUT /api/v1/courses/:course_id/assignments/:assignment_id/provisional_grades/bulk_select


Choose which provisional grades will be received by associated students for an assignment. The caller must be the final grader for the assignment or an admin with :select_final_grade rights.


#### Example Response:


```
[{
  "assignment_id": 867,
  "student_id": 5309,
  "selected_provisional_grade_id": 53669
}]
```


---

## Show provisional grade status for a studentProvisionalGradesController#status


### GET /api/v1/courses/:course_id/assignments/:assignment_id/provisional_grades/status


Tell whether the studentâs submission needs one or more provisional grades.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| student_id |  | integer | The id of the student to show the status for |


#### Example Request:


```
curl 'https://<canvas>/api/v1/courses/1/assignments/2/provisional_grades/status?student_id=1'
```


#### Example Response:


```
{ "needs_provisional_grade": false }
```


---

## Select provisional gradeProvisionalGradesController#select


### PUT /api/v1/courses/:course_id/assignments/:assignment_id/provisional_grades/:provisional_grade_id/select


Choose which provisional grade the student should receive for a submission. The caller must be the final grader for the assignment or an admin with :select_final_grade rights.


#### Example Response:


```
{
  "assignment_id": 867,
  "student_id": 5309,
  "selected_provisional_grade_id": 53669
}
```


---

## Publish provisional grades for an assignmentProvisionalGradesController#publish


### POST /api/v1/courses/:course_id/assignments/:assignment_id/provisional_grades/publish


Publish the selected provisional grade for all submissions to an assignment. Use the âSelect provisional gradeâ endpoint to choose which provisional grade to publish for a particular submission.


Students not in the moderation set will have their one and only provisional grade published.


WARNING: This is irreversible. This will overwrite existing grades in the gradebook.


#### Example Request:


```
curl 'https://<canvas>/api/v1/courses/1/assignments/2/provisional_grades/publish' \
     -X POST
```
