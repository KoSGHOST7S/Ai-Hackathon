# Quizzes

> Canvas API — Quizzes  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List quizzes in a courseQuizzes::QuizzesApiController#index


### GET /api/v1/courses/:course_id/quizzes


Returns the paginated list of Quizzes in this course.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| search_term |  | string | The partial title of the quizzes to match and return. |


#### Example Request:


```
curl https://<canvas>/api/v1/courses/<course_id>/quizzes \
     -H 'Authorization: Bearer <token>'
```


---

## Get a single quizQuizzes::QuizzesApiController#show


### GET /api/v1/courses/:course_id/quizzes/:id


Returns the quiz with the given id.


---

## Create a quizQuizzes::QuizzesApiController#create


### POST /api/v1/courses/:course_id/quizzes


Create a new quiz for this course.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| quiz[title] | Required | string | The quiz title. |
| quiz[description] |  | string | A description of the quiz. |
| quiz[quiz_type] |  | string | The type of quiz. Allowed values: practice_quiz , assignment , graded_survey , survey |
| quiz[assignment_group_id] |  | integer | The assignment group id to put the assignment in. Defaults to the top assignment group in the course. Only valid if the quiz is graded, i.e. if quiz_type is âassignmentâ or âgraded_surveyâ. |
| quiz[time_limit] |  | integer | Time limit to take this quiz, in minutes. Set to null for no time limit. Defaults to null. |
| quiz[shuffle_answers] |  | boolean | If true, quiz answers for multiple choice questions will be randomized for each student. Defaults to false. |
| quiz[hide_results] |  | string | Dictates whether or not quiz results are hidden from students. If null, students can see their results after any attempt. If âalwaysâ, students can never see their results. If âuntil_after_last_attemptâ, students can only see results after their last attempt. (Only valid if allowed_attempts > 1). Defaults to null. Allowed values: always , until_after_last_attempt |
| quiz[show_correct_answers] |  | boolean | Only valid if hide_results=null If false, hides correct answers from students when quiz results are viewed. Defaults to true. |
| quiz[show_correct_answers_last_attempt] |  | boolean | Only valid if show_correct_answers=true and allowed_attempts > 1 If true, hides correct answers from students when quiz results are viewed until they submit the last attempt for the quiz. Defaults to false. |
| quiz[show_correct_answers_at] |  | DateTime | Only valid if show_correct_answers=true If set, the correct answers will be visible by students only after this date, otherwise the correct answers are visible once the student hands in their quiz submission. |
| quiz[hide_correct_answers_at] |  | DateTime | Only valid if show_correct_answers=true If set, the correct answers will stop being visible once this date has passed. Otherwise, the correct answers will be visible indefinitely. |
| quiz[allowed_attempts] |  | integer | Number of times a student is allowed to take a quiz. Set to -1 for unlimited attempts. Defaults to 1. |
| quiz[scoring_policy] |  | string | Required and only valid if allowed_attempts > 1. Scoring policy for a quiz that students can take multiple times. Defaults to âkeep_highestâ. Allowed values: keep_highest , keep_latest |
| quiz[one_question_at_a_time] |  | boolean | If true, shows quiz to student one question at a time. Defaults to false. |
| quiz[cant_go_back] |  | boolean | Only valid if one_question_at_a_time=true If true, questions are locked after answering. Defaults to false. |
| quiz[access_code] |  | string | Restricts access to the quiz with a password. For no access code restriction, set to null. Defaults to null. |
| quiz[ip_filter] |  | string | Restricts access to the quiz to computers in a specified IP range. Filters can be a comma-separated list of addresses, or an address followed by a mask Examples: " 192.168.217.1 " " 192.168.217.1/24 " " 192.168.217.1/255.255.255.0 " For no IP filter restriction, set to null. Defaults to null. |
| quiz[due_at] |  | DateTime | The day/time the quiz is due. Accepts times in ISO 8601 format, e.g. 2011-10-21T18:48Z. |
| quiz[lock_at] |  | DateTime | The day/time the quiz is locked for students. Accepts times in ISO 8601 format, e.g. 2011-10-21T18:48Z. |
| quiz[unlock_at] |  | DateTime | The day/time the quiz is unlocked for students. Accepts times in ISO 8601 format, e.g. 2011-10-21T18:48Z. |
| quiz[published] |  | boolean | Whether the quiz should have a draft state of published or unpublished. NOTE: If students have started taking the quiz, or there are any submissions for the quiz, you may not unpublish a quiz and will recieve an error. |
| quiz[one_time_results] |  | boolean | Whether students should be prevented from viewing their quiz results past the first time (right after they turn the quiz in.) Only valid if âhide_resultsâ is not set to âalwaysâ. Defaults to false. |
| quiz[only_visible_to_overrides] |  | boolean | Whether this quiz is only visible to overrides (Only useful if âdifferentiated assignmentsâ account setting is on) Defaults to false. |


---

## Edit a quizQuizzes::QuizzesApiController#update


### PUT /api/v1/courses/:course_id/quizzes/:id


Modify an existing quiz. See the documentation for quiz creation.


Additional arguments:


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| quiz[notify_of_update] |  | boolean | If true, notifies users that the quiz has changed. Defaults to true |


---

## Delete a quizQuizzes::QuizzesApiController#destroy


### DELETE /api/v1/courses/:course_id/quizzes/:id


Deletes a quiz and returns the deleted quiz object.


---

## Reorder quiz itemsQuizzes::QuizzesApiController#reorder


### POST /api/v1/courses/:course_id/quizzes/:id/reorder


Change order of the quiz questions or groups within the quiz


204 No Content response code is returned if the reorder was successful.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| order[][id] | Required | integer | The associated itemâs unique identifier |
| order[][type] |  | string | The type of item is either âquestionâ or âgroupâ Allowed values: question , group |


---

## Validate quiz access codeQuizzes::QuizzesApiController#validate_access_code


### POST /api/v1/courses/:course_id/quizzes/:id/validate_access_code


Accepts an access code and returns a boolean indicating whether that access code is correct


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| access_code | Required | string | The access code being validated |
