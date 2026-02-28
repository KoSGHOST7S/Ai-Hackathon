# Course Quiz Extensions

> Canvas API — Courses  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Set extensions for student quiz submissionsQuizzes::CourseQuizExtensionsController#create


### POST /api/v1/courses/:course_id/quiz_extensions


Responses

- 200 OK if the request was successful
- 403 Forbidden if you are not allowed to extend quizzes for this course


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| user_id | Required | integer | The ID of the user we want to add quiz extensions for. |
| extra_attempts |  | integer | Number of times the student is allowed to re-take the quiz over the multiple-attempt limit. This is limited to 1000 attempts or less. |
| extra_time |  | integer | The number of extra minutes to allow for all attempts. This will add to the existing time limit on the submission. This is limited to 10080 minutes (1 week) |
| manually_unlocked |  | boolean | Allow the student to take the quiz even if itâs locked for everyone else. |
| extend_from_now |  | integer | The number of minutes to extend the quiz from the current time. This is mutually exclusive to extend_from_end_at. This is limited to 1440 minutes (24 hours) |
| extend_from_end_at |  | integer | The number of minutes to extend the quiz beyond the quizâs current ending time. This is mutually exclusive to extend_from_now. This is limited to 1440 minutes (24 hours) |


#### Example Request:


```
{
  "quiz_extensions": [{
    "user_id": 3,
    "extra_attempts": 2,
    "extra_time": 20,
    "manually_unlocked": true
  },{
    "user_id": 2,
    "extra_attempts": 2,
    "extra_time": 20,
    "manually_unlocked": false
  }]
}
```


```
{
  "quiz_extensions": [{
    "user_id": 3,
    "extend_from_now": 20
  }]
}
```


#### Example Response:


```
{
  "quiz_extensions": [QuizExtension]
}
```
