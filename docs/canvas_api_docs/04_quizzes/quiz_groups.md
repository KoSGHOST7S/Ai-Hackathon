# Quiz Groups

> Canvas API — Quizzes  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List question groups in a quizQuizzes::QuizGroupsController#index


### GET /api/v1/courses/:course_id/quizzes/:quiz_id/groups


Returns a list of question groups in a quiz.


#### Example Response:


```
{
  "quiz_groups": [QuizGroup]
}
```


---

## Get a single quiz groupQuizzes::QuizGroupsController#show


### GET /api/v1/courses/:course_id/quizzes/:quiz_id/groups/:id


Returns details of the quiz group with the given id.


---

## Create a question groupQuizzes::QuizGroupsController#create


### POST /api/v1/courses/:course_id/quizzes/:quiz_id/groups


Create a new question group for this quiz


201 Created response code is returned if the creation was successful.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| quiz_groups[][name] |  | string | The name of the question group. |
| quiz_groups[][pick_count] |  | integer | The number of questions to randomly select for this group. |
| quiz_groups[][question_points] |  | integer | The number of points to assign to each question in the group. |
| quiz_groups[][assessment_question_bank_id] |  | integer | The id of the assessment question bank to pull questions from. |


#### Example Response:


```
{
  "quiz_groups": [QuizGroup]
}
```


---

## Update a question groupQuizzes::QuizGroupsController#update


### PUT /api/v1/courses/:course_id/quizzes/:quiz_id/groups/:id


Update a question group


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| quiz_groups[][name] |  | string | The name of the question group. |
| quiz_groups[][pick_count] |  | integer | The number of questions to randomly select for this group. |
| quiz_groups[][question_points] |  | integer | The number of points to assign to each question in the group. |


#### Example Response:


```
{
  "quiz_groups": [QuizGroup]
}
```


---

## Delete a question groupQuizzes::QuizGroupsController#destroy


### DELETE /api/v1/courses/:course_id/quizzes/:quiz_id/groups/:id


Delete a question group


<b>204 No Content<b> response code is returned if the deletion was successful.


---

## Reorder question groupsQuizzes::QuizGroupsController#reorder


### POST /api/v1/courses/:course_id/quizzes/:quiz_id/groups/:id/reorder


Change the order of the quiz questions within the group


<b>204 No Content<b> response code is returned if the reorder was successful.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| order[][id] | Required | integer | The associated itemâs unique identifier |
| order[][type] |  | string | The type of item is always âquestionâ for a group Allowed values: question |
