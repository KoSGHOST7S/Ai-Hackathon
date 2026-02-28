# Assessment Question Banks

> Canvas API — Content Management  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List question banksAssessmentQuestionBanksController#index


### GET /api/v1/question_banks


Returns the paginated list of question banks for a given context.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| context_type | Required | string | The type of context. Must be either âCourseâ or âAccountâ. Allowed values: Course , Account |
| context_id | Required | integer | The id of the context. |
| include_question_count |  | boolean | Whether to include the number of questions in each bank. |


#### Example Request:


```
curl 'https://<canvas>/api/v1/question_banks?context_type=Course&context_id=1' \
     -H 'Authorization: Bearer <token>'
```


---

## Get a single question bankAssessmentQuestionBanksController#show


### GET /api/v1/question_banks/:id


Returns the question bank with the given id


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| id | Required | integer | The question bank unique identifier. |
| include_question_count |  | boolean | Whether to include the number of questions in the bank. |


---

## List assessment questions for a question bankAssessmentQuestionBanksController#questions


### GET /api/v1/question_banks/:id/questions


Returns the paginated list of assessment questions in this bank.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| id | Required | integer | The question bank unique identifier. |


#### Example Request:


```
curl 'https://<canvas>/api/v1/question_banks/:id/questions' \
     -H 'Authorization: Bearer <token>'
```
