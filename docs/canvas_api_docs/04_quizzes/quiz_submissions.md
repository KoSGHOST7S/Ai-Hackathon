# Quiz Submissions

> Canvas API — Quizzes  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Get all quiz submissions.Quizzes::QuizSubmissionsApiController#index


### GET /api/v1/courses/:course_id/quizzes/:quiz_id/submissions


Get a list of all submissions for this quiz. Users who can view or manage grades for a course will have submissions from multiple users returned. A user who can only submit will have only their own submissions returned. When a user has an in-progress submission, only that submission is returned. When there isnât an in-progress quiz_submission, all completed submissions, including previous attempts, are returned.


200 OK response code is returned if the request was successful.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| include[] |  | string | Associations to include with the quiz submission. Allowed values: submission , quiz , user |


#### Example Response:


```
{
  "quiz_submissions": [QuizSubmission]
}
```


---

## Get the quiz submission.Quizzes::QuizSubmissionsApiController#submission


### GET /api/v1/courses/:course_id/quizzes/:quiz_id/submission


Get the submission for this quiz for the current user.


200 OK response code is returned if the request was successful.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| include[] |  | string | Associations to include with the quiz submission. Allowed values: submission , quiz , user |


#### Example Response:


```
{
  "quiz_submissions": [QuizSubmission]
}
```


---

## Get a single quiz submission.Quizzes::QuizSubmissionsApiController#show


### GET /api/v1/courses/:course_id/quizzes/:quiz_id/submissions/:id


Get a single quiz submission.


200 OK response code is returned if the request was successful.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| include[] |  | string | Associations to include with the quiz submission. Allowed values: submission , quiz , user |


#### Example Response:


```
{
  "quiz_submissions": [QuizSubmission]
}
```


---

## Create the quiz submission (start a quiz-taking session)Quizzes::QuizSubmissionsApiController#create


### POST /api/v1/courses/:course_id/quizzes/:quiz_id/submissions


Start taking a Quiz by creating a QuizSubmission which you can use to answer questions and submit your answers.


Responses

- 200 OK if the request was successful
- 400 Bad Request if the quiz is locked
- 403 Forbidden if an invalid access code is specified
- 403 Forbidden if the Quizâs IP filter restriction does not pass
- 409 Conflict if a QuizSubmission already exists for this user and quiz


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| access_code |  | string | Access code for the Quiz, if any. |
| preview |  | boolean | Whether this should be a preview QuizSubmission and not count towards the userâs course record. Teachers only. |


#### Example Response:


```
{
  "quiz_submissions": [QuizSubmission]
}
```


---

## Update student question scores and comments.Quizzes::QuizSubmissionsApiController#update


### PUT /api/v1/courses/:course_id/quizzes/:quiz_id/submissions/:id


Update the amount of points a student has scored for questions theyâve answered, provide comments for the student about their answer(s), or simply fudge the total score by a specific amount of points.


Responses

- 200 OK if the request was successful
- 403 Forbidden if you are not a teacher in this course
- 400 Bad Request if the attempt parameter is missing or invalid
- 400 Bad Request if the specified QS attempt is not yet complete


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| quiz_submissions[][attempt] | Required | integer | The attempt number of the quiz submission that should be updated. This attempt MUST be already completed. |
| quiz_submissions[][fudge_points] |  | number | Amount of positive or negative points to fudge the total score by. |
| quiz_submissions[][questions] |  | Hash | A set of scores and comments for each question answered by the student. The keys are the question IDs, and the values are hashes of score and comment entries. See Appendix: Manual Scoring for more on this parameter. |


#### Example Request:


```
{
  "quiz_submissions": [{
    "attempt": 1,
    "fudge_points": -2.4,
    "questions": {
      "1": {
        "score": 2.5,
        "comment": "This can't be right, but I'll let it pass this one time."
      },
      "2": {
        "score": 0,
        "comment": "Good thinking. Almost!"
      }
    }
  }]
}
```


#### Example Response:


```
{
  "quiz_submissions": [QuizSubmission]
}
```


See Also:

- Appendix: Manual Scoring


---

## Complete the quiz submission (turn it in).Quizzes::QuizSubmissionsApiController#complete


### POST /api/v1/courses/:course_id/quizzes/:quiz_id/submissions/:id/complete


Complete the quiz submission by marking it as complete and grading it. When the quiz submission has been marked as complete, no further modifications will be allowed.


Responses

- 200 OK if the request was successful
- 403 Forbidden if an invalid access code is specified
- 403 Forbidden if the Quizâs IP filter restriction does not pass
- 403 Forbidden if an invalid token is specified
- 400 Bad Request if the QS is already complete
- 400 Bad Request if the attempt parameter is missing
- 400 Bad Request if the attempt parameter is not the latest attempt


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| attempt | Required | integer | The attempt number of the quiz submission that should be completed. Note that this must be the latest attempt index, as earlier attempts can not be modified. |
| validation_token | Required | string | The unique validation token you received when this Quiz Submission was created. |
| access_code |  | string | Access code for the Quiz, if any. |


#### Example Response:


```
{
  "quiz_submissions": [QuizSubmission]
}
```


---

## Get current quiz submission times.Quizzes::QuizSubmissionsApiController#time


### GET /api/v1/courses/:course_id/quizzes/:quiz_id/submissions/:id/time


Get the current timing data for the quiz attempt, both the end_at timestamp and the time_left parameter.


Responses

- 200 OK if the request was successful


#### Example Response:


```
{
  "end_at": [DateTime],
  "time_left": [Integer]
}
```
