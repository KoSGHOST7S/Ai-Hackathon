# Grade Change Log

> Canvas API — Assignments & Grades  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Query by assignmentGradeChangeAuditApiController#for_assignment


### GET /api/v1/audit/grade_change/assignments/:assignment_id


List grade change events for a given assignment.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| start_time |  | DateTime | The beginning of the time range from which you want events. |
| end_time |  | DateTime | The end of the time range from which you want events. |


---

## Query by courseGradeChangeAuditApiController#for_course


### GET /api/v1/audit/grade_change/courses/:course_id


List grade change events for a given course.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| start_time |  | DateTime | The beginning of the time range from which you want events. |
| end_time |  | DateTime | The end of the time range from which you want events. |


---

## Query by studentGradeChangeAuditApiController#for_student


### GET /api/v1/audit/grade_change/students/:student_id


List grade change events for a given student.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| start_time |  | DateTime | The beginning of the time range from which you want events. |
| end_time |  | DateTime | The end of the time range from which you want events. |


---

## Query by graderGradeChangeAuditApiController#for_grader


### GET /api/v1/audit/grade_change/graders/:grader_id


List grade change events for a given grader.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| start_time |  | DateTime | The beginning of the time range from which you want events. |
| end_time |  | DateTime | The end of the time range from which you want events. |


---

## Advanced queryGradeChangeAuditApiController#query


### GET /api/v1/audit/grade_change


List grade change events satisfying all given parameters. Teachers may query for events in courses they teach. Queries without course_id require account administrator rights.


At least one of course_id , assignment_id , student_id , or grader_id must be specified.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| course_id |  | integer | Restrict query to events in the specified course. |
| assignment_id |  | integer | Restrict query to the given assignment. If âoverrideâ is given, query the course final grade override instead. |
| student_id |  | integer | User id of a student to search grading events for. |
| grader_id |  | integer | User id of a grader to search grading events for. |
| start_time |  | DateTime | The beginning of the time range from which you want events. |
| end_time |  | DateTime | The end of the time range from which you want events. |
