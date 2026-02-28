# New Quizzes Accommodations

> Canvas API — Quizzes  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Set Quiz-Level Accommodations


### POST /api/quiz/v1/courses/:course_id/quizzes/:assignment_id/accommodations


Apply accommodations at the quiz level for students in a specific assignment.


Request Body Format:


```
[{
  "user_id": 3,
  "extra_time": 60,
  "extra_attempts": 1,
  "reduce_choices_enabled": true
}]

```


Responses

- 200 OK : Accommodations were processed with some successes and failures
- 401 Unauthorized : User does not have permission to update accommodations
- 404 Not Found : The course or assignment was not found
- 400 Bad Request : Validation error (e.g., invalid JSON, missing user IDs)


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| course_id | Required | string | The ID of the course where the quiz is located. |
| assignment_id | Required | integer | The ID of the assignment/quiz that needs accommodations. |
| user_id | Required | integer | The Canvas user ID of the student receiving accommodations. |
| extra_time |  | integer | Amount of extra time in minutes granted for quiz submission. Allowed range: 0 to 10080 minutes (168 hours). |
| extra_attempts |  | integer | Number of times the student is allowed to re-take the quiz over the multiple-attempt limit. |
| reduce_choices_enabled |  | boolean | If âtrueâ, removes one incorrect answer from multiple-choice questions with 4 or more options . |


#### Example Request:


```
curl -X POST 'https://<canvas>/api/v1/courses/123/quizzes/456/accommodations' \
     -H 'Authorization: Bearer <your-token>' \
     -H 'Content-Type: application/json' \
     --data '[
       {
         "user_id": 3,
         "extra_time": 60,
         "extra_attempts": 1,
         "reduce_choices_enabled": true
       }
     ]'
```


---

## Set Course-Level Accommodations


### POST /api/quiz/v1/courses/:course_id/accommodations


Apply accommodations at the course level for students enrolled in a given course.


Request Body Format:


```
[{
  "user_id": 3,
  "extra_time": 60,
  "apply_to_in_progress_quiz_sessions": true,
  "reduce_choices_enabled": true
}]

```


Responses

- 200 OK : Accommodations were processed with some successes and failures
- 401 Unauthorized : User does not have permission to update accommodations
- 404 Not Found : The course was not found
- 400 Bad Request : Validation error (e.g., invalid JSON, missing user IDs)


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| course_id | Required | string | The ID of the course where accommodations should be applied. |
| user_id | Required | integer | The Canvas user ID of the student receiving accommodations. |
| extra_time |  | integer | Amount of extra time in minutes granted for quiz submission. Allowed range: 0 to 10080 minutes (168 hours). |
| apply_to_in_progress_quiz_sessions |  | boolean | If âtrueâ, applies the accommodation to currently in-progress quiz sessions. |
| reduce_choices_enabled |  | boolean | If âtrueâ, removes one incorrect answer from multiple-choice questions with 4 or more options . |


#### Example Request:


```
curl -X POST 'https://<canvas>/api/v1/courses/123/accommodations' \
     -H 'Authorization: Bearer <your-token>' \
     -H 'Content-Type: application/json' \
     --data '[
       {
         "user_id": 3,
         "extra_time": 60,
         "apply_to_in_progress_quiz_sessions": true,
         "reduce_choices_enabled": true
       }
     ]'
```
