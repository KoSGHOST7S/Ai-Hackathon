# Gradebook History

> Canvas API — Courses  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Days in gradebook history for this courseGradebookHistoryApiController#days


### GET /api/v1/courses/:course_id/gradebook_history/days


Returns a map of dates to grader/assignment groups


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| course_id | Required | integer | The id of the contextual course for this API call |


---

## Details for a given date in gradebook history for this courseGradebookHistoryApiController#day_details


### GET /api/v1/courses/:course_id/gradebook_history/:date


Returns the graders who worked on this day, along with the assignments they worked on. More details can be obtained by selecting a grader and assignment and calling the âsubmissionsâ api endpoint for a given date.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| course_id | Required | integer | The id of the contextual course for this API call |
| date | Required | string | The date for which you would like to see detailed information |


---

## Lists submissionsGradebookHistoryApiController#submissions


### GET /api/v1/courses/:course_id/gradebook_history/:date/graders/:grader_id/assignments/:assignment_id/submissions


Gives a nested list of submission versions


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| course_id | Required | integer | The id of the contextual course for this API call |
| date | Required | string | The date for which you would like to see submissions |
| grader_id | Required | integer | The ID of the grader for which you want to see submissions |
| assignment_id | Required | integer | The ID of the assignment for which you want to see submissions |


---

## List uncollated submission versionsGradebookHistoryApiController#feed


### GET /api/v1/courses/:course_id/gradebook_history/feed


Gives a paginated, uncollated list of submission versions for all matching submissions in the context. This SubmissionVersion objects will not include the new_grade or previous_grade keys, only the grade ; same for graded_at and grader .


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| course_id | Required | integer | The id of the contextual course for this API call |
| assignment_id |  | integer | The ID of the assignment for which you want to see submissions. If absent, versions of submissions from any assignment in the course are included. |
| user_id |  | integer | The ID of the user for which you want to see submissions. If absent, versions of submissions from any user in the course are included. |
| ascending |  | boolean | Returns submission versions in ascending date order (oldest first). If absent, returns submission versions in descending date order (newest first). |
