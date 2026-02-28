# Quiz Assignment Overrides

> Canvas API — Quizzes  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Retrieve assignment-overridden dates for Classic QuizzesQuizzes::QuizAssignmentOverridesController#index


### GET /api/v1/courses/:course_id/quizzes/assignment_overrides


Retrieve the actual due-at, unlock-at, and available-at dates for quizzes based on the assignment overrides active for the current API user.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| quiz_assignment_overrides[][quiz_ids][] |  | integer | An array of quiz IDs. If omitted, overrides for all quizzes available to the operating user will be returned. |


#### Example Response:


```
{
   "quiz_assignment_overrides": [{
     "quiz_id": "1",
     "due_dates": [QuizAssignmentOverride],
     "all_dates": [QuizAssignmentOverride]
   },{
     "quiz_id": "2",
     "due_dates": [QuizAssignmentOverride],
     "all_dates": [QuizAssignmentOverride]
   }]
}
```


---

## Retrieve assignment-overridden dates for New QuizzesQuizzes::QuizAssignmentOverridesController#new_quizzes


### GET /api/v1/courses/:course_id/new_quizzes/assignment_overrides


Retrieve the actual due-at, unlock-at, and available-at dates for quizzes based on the assignment overrides active for the current API user.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| quiz_assignment_overrides[][quiz_ids][] |  | integer | An array of quiz IDs. If omitted, overrides for all quizzes available to the operating user will be returned. |


#### Example Response:


```
{
   "quiz_assignment_overrides": [{
     "quiz_id": "1",
     "due_dates": [QuizAssignmentOverride],
     "all_dates": [QuizAssignmentOverride]
   },{
     "quiz_id": "2",
     "due_dates": [QuizAssignmentOverride],
     "all_dates": [QuizAssignmentOverride]
   }]
}
```
