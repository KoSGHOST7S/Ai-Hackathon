# Course Audit

> Canvas API — Courses  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Query by course.CourseAuditApiController#for_course


### GET /api/v1/audit/course/courses/:course_id


List course change events for a given course.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| start_time |  | DateTime | The beginning of the time range from which you want events. |
| end_time |  | DateTime | The end of the time range from which you want events. |


---

## Query by account.CourseAuditApiController#for_account


### GET /api/v1/audit/course/accounts/:account_id


List course change events for a given account.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| start_time |  | DateTime | The beginning of the time range from which you want events. |
| end_time |  | DateTime | The end of the time range from which you want events. |
