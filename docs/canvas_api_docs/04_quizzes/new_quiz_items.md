# New Quiz Items

> Canvas API — Quizzes  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Get a quiz item


### GET /api/quiz/v1/courses/:course_id/quizzes/:assignment_id/items/:item_id


Get details about a single item in a new quiz.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| course_id | Required | integer | no description |
| assignment_id | Required | integer | The id of the assignment associated with the quiz. |
| item_id | Required | integer | The id of the item associated with the quiz. |


#### Example Request:


```
curl 'https://<canvas>/api/quiz/v1/courses/1/quizzes/12/items/123' \
      -H 'Authorization: Bearer <token>'
```


---

## List quiz items


### GET /api/quiz/v1/courses/:course_id/quizzes/:assignment_id/items


Get a list of items in a new quiz.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| course_id | Required | integer | no description |
| assignment_id | Required | integer | no description |


#### Example Request:


```
curl 'https://<canvas>/api/quiz/v1/courses/1/quizzes/1/items' \
     -H 'Authorization Bearer <token>'
```


---

## Create a quiz item


### POST /api/quiz/v1/courses/:course_id/quizzes/:assignment_id/items


Create a quiz item in a new quiz. Only QuestionItem types can be created.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| course_id | Required | integer | no description |
| assignment_id | Required | integer | The id of the assignment associated with the quiz. |
| item[position] |  | integer | The position of the item within the quiz. |
| item[points_possible] |  | number | The number of points available to score on this item. Must be positive. |
| item[entry_type] | Required | string | The type of the item. Allowed values: Item |
| item[entry][title] |  | string | The question title. |
| item[entry][item_body] | Required | string | The question stem (rich content). |
| item[entry][calculator_type] |  | string | Type of calculator the user will have access to during the question. Allowed values: none , basic , scientific |
| item[entry][feedback][neutral] |  | string | General feedback to show regardless of answer (rich content). |
| item[entry][feedback][correct] |  | string | Feedback to show if the question is answered correctly (rich content). |
| item[entry][feedback][incorrect] |  | string | Feedback to show if the question is answered incorrectly (rich content). |
| item[entry][interaction_type_slug] | Required | string | The type of question. One of âmulti-answerâ, âmatchingâ, âcategorizationâ, âfile-uploadâ, âformulaâ, âorderingâ, ârich-fill-blankâ, âhot-spotâ, âchoiceâ, ânumericâ, âtrue-falseâ, or âessayâ. See Appendix: Question Types for more info about each type. |
| item[entry][interaction_data] | Required | Object | An object that contains the question data. See Appendix: Question Types for more info about this field. |
| item[entry][properties] |  | Object | An object that contains additional properties for some question types. See Appendix: Question Types for more info about this field. |
| item[entry][scoring_data] | Required | Object | An object that describes how to score the question. See Appendix: Question Types for more info about this field. |
| item[entry][answer_feedback] |  | Object | Feedback provided for each answer (rich content, only available on âchoiceâ question types). |
| item[entry][scoring_algorithm] | Required | string | The algorithm used to score the question. See Appendix: Question Types for more info about this field. |


#### Example Request:


```
curl 'https://<canvas>/api/quiz/v1/courses/1/quizzes/12/items' \
     -X POST \
     -H 'Authorization Bearer <token>' \
     -d 'item[position]=1' \
     -d 'item[points_possible]=25.0' \
     -d 'item[properties]={}' \
     -d 'item[entry_type]=Item' \
     -d 'item[entry][title]=Question 1' \
     -d 'item[entry][feedback][correct]=good job!' \
     -d 'item[entry][calculator_type]=none' \
     -d 'item[entry][interaction_data][word_limit_enabled]=true' \
     -d 'item[entry][item_body]=<p>What is 3 ^ 6?</p>' \
     -d 'item[entry][interaction_type_slug]=essay' \
     -d 'item[entry][scoring_data][value]=' \
     -d 'item[entry][scoring_algorithm]=None'
```


---

## Update a quiz item


### PATCH /api/quiz/v1/courses/:course_id/quizzes/:assignment_id/items/:item_id


Update a single quiz item in a new quiz. Only QuestionItem types can be updated.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| course_id | Required | integer | no description |
| assignment_id | Required | integer | The id of the assignment associated with the quiz. |
| item_id | Required | integer | The id of the item associated with the quiz. |
| item[position] |  | integer | The position of the item within the quiz. |
| item[points_possible] |  | number | The number of points available to score on this item. Must be positive. |
| item[entry_type] |  | string | The type of the item. Allowed values: Item |
| item[entry][title] |  | string | The question title. |
| item[entry][item_body] |  | string | The question stem (rich content). |
| item[entry][calculator_type] |  | string | Type of calculator the user will have access to during the question. Allowed values: none , basic , scientific |
| item[entry][feedback][neutral] |  | string | General feedback to show regardless of answer (rich content). |
| item[entry][feedback][correct] |  | string | Feedback to show if the question is answered correctly (rich content). |
| item[entry][feedback][incorrect] |  | string | Feedback to show if the question is answered incorrectly (rich content). |
| item[entry][interaction_type_slug] |  | string | The type of question. One of âmulti-answerâ, âmatchingâ, âcategorizationâ, âfile-uploadâ, âformulaâ, âorderingâ, ârich-fill-blankâ, âhot-spotâ, âchoiceâ, ânumericâ, âtrue-falseâ, or âessayâ. See Appendix: Question Types for more info about each type. |
| item[entry][interaction_data] |  | Object | An object that contains the question data. See Appendix: Question Types for more info about this field. |
| item[entry][properties] |  | Object | An object that contains additional properties for some question types. See Appendix: Question Types for more info about this field. |
| item[entry][scoring_data] |  | Object | An object that describes how to score the question. See Appendix: Question Types for more info about this field. |
| item[entry][answer_feedback] |  | Object | Feedback provided for each answer (rich content, only available on âchoiceâ question types). |
| item[entry][scoring_algorithm] |  | string | The algorithm used to score the question. See Appendix: Question Types for more info about this field. |


#### Example Request:


```
curl 'https://<canvas>/api/quiz/v1/courses/1/quizzes/12/items/145' \
     -X PATCH \
     -H 'Authorization Bearer <token>' \
     -d 'item[points_possible]=25.0' \
     -d 'item[entry][title]=Question 1' \
     -d 'item[entry][calculator_type]=scientific'
```


---

## Delete a quiz item


### DELETE /api/quiz/v1/courses/:course_id/quizzes/:assignment_id/items/:item_id


Delete a single quiz item in a new quiz.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| course_id | Required | integer | no description |
| assignment_id | Required | integer | The id of the assignment associated with the quiz. |
| item_id | Required | integer | The id of the item associated with the quiz. |


#### Example Request:


```
curl 'https://<canvas>/api/quiz/v1/courses/1/quizzes/12/items/123' \
     -X DELETE \
     -H 'Authorization: Bearer <token>'
```


---

## Get items media_upload_url


### GET /api/quiz/v1/courses/:course_id/quizzes/:assignment_id/items/media_upload_url


Get a url for uploading media for use in hot-spot question types. See the hot-spot question type in the Appendix: Question Types for more details about using this endpoint.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| course_id | Required | integer | no description |
| assignment_id | Required | integer | no description |


#### Example Request:


```
curl 'https://<canvas>/api/quiz/v1/courses/1/quizzes/1/items/media_upload_url' \
     -H 'Authorization Bearer <token>'
```


#### Example Response:


```
{ "url": "http://s3_upload_url" }
```
