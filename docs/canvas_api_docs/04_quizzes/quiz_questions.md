# Quiz Questions

> Canvas API — Quizzes  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List questions in a quiz or a submissionQuizzes::QuizQuestionsController#index


### GET /api/v1/courses/:course_id/quizzes/:quiz_id/questions


Returns the paginated list of QuizQuestions in this quiz.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| quiz_submission_id |  | integer | If specified, the endpoint will return the questions that were presented for that submission. This is useful if the quiz has been modified after the submission was created and the latest quiz versionâs set of questions does not match the submissionâs. NOTE: you must specify quiz_submission_attempt as well if you specify this parameter. |
| quiz_submission_attempt |  | integer | The attempt of the submission you want the questions for. |


---

## Get a single quiz questionQuizzes::QuizQuestionsController#show


### GET /api/v1/courses/:course_id/quizzes/:quiz_id/questions/:id


Returns the quiz question with the given id


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| id | Required | integer | The quiz question unique identifier. |


---

## Create a single quiz questionQuizzes::QuizQuestionsController#create


### POST /api/v1/courses/:course_id/quizzes/:quiz_id/questions


Create a new quiz question for this quiz


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| question[question_name] |  | string | The name of the question. |
| question[question_text] |  | string | The text of the question. |
| question[quiz_group_id] |  | integer | The id of the quiz group to assign the question to. |
| question[question_type] |  | string | The type of question. Multiple optional fields depend upon the type of question to be used. Allowed values: calculated_question , essay_question , file_upload_question , fill_in_multiple_blanks_question , matching_question , multiple_answers_question , multiple_choice_question , multiple_dropdowns_question , numerical_question , short_answer_question , text_only_question , true_false_question |
| question[position] |  | integer | The order in which the question will be displayed in the quiz in relation to other questions. |
| question[points_possible] |  | integer | The maximum amount of points received for answering this question correctly. |
| question[correct_comments] |  | string | The comment to display if the student answers the question correctly. |
| question[incorrect_comments] |  | string | The comment to display if the student answers incorrectly. |
| question[neutral_comments] |  | string | The comment to display regardless of how the student answered. |
| question[text_after_answers] |  | string | no description |
| question[answers] |  | [Answer] | no description |


---

## Update an existing quiz questionQuizzes::QuizQuestionsController#update


### PUT /api/v1/courses/:course_id/quizzes/:quiz_id/questions/:id


Updates an existing quiz question for this quiz


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| quiz_id | Required | integer | The associated quizâs unique identifier. |
| id | Required | integer | The quiz questionâs unique identifier. |
| question[question_name] |  | string | The name of the question. |
| question[question_text] |  | string | The text of the question. |
| question[quiz_group_id] |  | integer | The id of the quiz group to assign the question to. |
| question[question_type] |  | string | The type of question. Multiple optional fields depend upon the type of question to be used. Allowed values: calculated_question , essay_question , file_upload_question , fill_in_multiple_blanks_question , matching_question , multiple_answers_question , multiple_choice_question , multiple_dropdowns_question , numerical_question , short_answer_question , text_only_question , true_false_question |
| question[position] |  | integer | The order in which the question will be displayed in the quiz in relation to other questions. |
| question[points_possible] |  | integer | The maximum amount of points received for answering this question correctly. |
| question[correct_comments] |  | string | The comment to display if the student answers the question correctly. |
| question[incorrect_comments] |  | string | The comment to display if the student answers incorrectly. |
| question[neutral_comments] |  | string | The comment to display regardless of how the student answered. |
| question[text_after_answers] |  | string | no description |
| question[answers] |  | [Answer] | no description |


---

## Delete a quiz questionQuizzes::QuizQuestionsController#destroy


### DELETE /api/v1/courses/:course_id/quizzes/:quiz_id/questions/:id


204 No Content response code is returned if the deletion was successful.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| quiz_id | Required | integer | The associated quizâs unique identifier |
| id | Required | integer | The quiz questionâs unique identifier |
