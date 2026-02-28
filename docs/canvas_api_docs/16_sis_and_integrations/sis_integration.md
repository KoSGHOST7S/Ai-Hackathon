# Sis Integration

> Canvas API — SIS & Integrations  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Retrieve assignments enabled for grade export to SISSisApiController#sis_assignments


### GET /api/sis/accounts/:account_id/assignments


### GET /api/sis/courses/:course_id/assignments


Retrieve a list of published assignments flagged as âpost_to_sisâ. See the Assignments API for more details on assignments. Assignment group and section information are included for convenience.


Each section includes course information for the origin course and the cross-listed course, if applicable. The origin_course is the course to which the section belongs or the course from which the section was cross-listed. Generally, the origin_course should be preferred when performing integration work. The xlist_course is provided for consistency and is only present when the section has been cross-listed. See Sections API and Courses Api for me details.


The override is only provided if the Differentiated Assignments course feature is turned on and the assignment has an override for that section. When there is an override for the assignment the override objectâs keys/values can be merged with the top level assignment object to create a view of the assignment object specific to that section. See Assignments api for more information on assignment overrides.


restricts to courses that start before this date (if they have a start date) restricts to courses that end after this date (if they have an end date) information to include.


```
"student_overrides":: returns individual student override information

```


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| account_id |  | integer | The ID of the account to query. |
| course_id |  | integer | The ID of the course to query. |
| starts_before |  | DateTime | When searching on an account, |
| ends_after |  | DateTime | When searching on an account, |
| include |  | string | Array of additional Allowed values: student_overrides |
