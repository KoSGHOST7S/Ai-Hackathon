# New Quizzes

> Canvas API — Quizzes  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Get a new quiz


### GET /api/quiz/v1/courses/:course_id/quizzes/:assignment_id


Get details about a single new quiz.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| course_id | Required | integer | no description |
| assignment_id | Required | integer | The id of the assignment associated with the quiz. |


#### Example Request:


```
curl 'https://<canvas>/api/quiz/v1/courses/1/quizzes/12' \
      -H 'Authorization: Bearer <token>'
```


---

## List new quizzes


### GET /api/quiz/v1/courses/:course_id/quizzes


Get a list of new quizzes.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| course_id | Required | integer | no description |


#### Example Request:


```
curl 'https://<canvas>/api/quiz/v1/courses/1/quizzes' \
     -H 'Authorization Bearer <token>'
```


---

## Create a new quiz


### POST /api/quiz/v1/courses/:course_id/quizzes


Create a new quiz for the course.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| course_id | Required | integer | no description |
| quiz[title] |  | string | The title of the quiz. |
| quiz[assignment_group_id] |  | integer | The ID of the quizâs assignment group. |
| quiz[points_possible] |  | number | The total point value given to the quiz. Must be positive. |
| quiz[due_at] |  | DateTime | When the quiz is due. |
| quiz[lock_at] |  | DateTime | When to lock the quiz. |
| quiz[unlock_at] |  | DateTime | When to unlock the quiz. |
| quiz[grading_type] |  | string | The type of grading the assignment receives. Allowed values: pass_fail , percent , letter_grade , gpa_scale , points |
| quiz[instructions] |  | string | Instructions for the quiz. |
| quiz[quiz_settings][calculator_type] |  | string | Specifies which type of Calculator a student can use during Quiz taking. Should be null if no calculator is allowed. Allowed values: none , basic , scientific |
| quiz[quiz_settings][filter_ip_address] |  | boolean | Whether IP filtering is needed.  Must be true for filters to take effect. |
| quiz[quiz_settings][filters][ips][] |  | string | Specifies ranges of IP addresses where the quiz can be taken from. Each range is an array like [start address, end address], or null if thereâs no restriction. |
| quiz[quiz_settings][multiple_attempts][multiple_attempts_enabled] |  | boolean | Whether multiple attempts for this quiz is true. |
| quiz[quiz_settings][multiple_attempts][attempt_limit] |  | boolean | Whether there is an attempt limit.  Only set if multiple_attempts_enabled is true. |
| quiz[quiz_settings][multiple_attempts][max_attempts] |  | Positive Integer | The allowed attempts a student can take. If null, the allowed attempts are unlimited.  Only used if attempt_limit is true. |
| quiz[quiz_settings][multiple_attempts][score_to_keep] |  | string | Whichever score to keep for the attempts.  Only used if multiple_attempts_enabled is true. Allowed values: average , first , highest , latest |
| quiz[quiz_settings][multiple_attempts][cooling_period] |  | boolean | Whether there is a cooling (waiting) period.  Only used if multiple_attempts_enabled is true. |
| quiz[quiz_settings][multiple_attempts][cooling_period_seconds] |  | Positive Integer | Required waiting period in seconds between attempts. If null, there is no required time. Only used if cooling_period is true |
| quiz[quiz_settings][one_at_a_time_type] |  | string | Specifies the settings for questions to display when quiz taking. Allowed values: none , question |
| quiz[quiz_settings][allow_backtracking] |  | boolean | Whether to allow user to return to previous questions when âone_at_a_time_typeâ is set to âquestionâ. |
| quiz[quiz_settings][result_view_settings][result_view_restricted] |  | boolean | Whether the results view is restricted for students.  Must be true for any student restrictions to be set. |
| quiz[quiz_settings][result_view_settings][display_points_awarded] |  | boolean | Whether points are shown. Must set result_view_restricted to true to use this parameter. |
| quiz[quiz_settings][result_view_settings][display_points_possible] |  | boolean | Whether points possible is shown. Must set result_view_restricted to true to use this parameter. |
| quiz[quiz_settings][result_view_settings][display_items] |  | boolean | Whether to show items in the results view.  Must be true for any items restrictions to be set. |
| quiz[quiz_settings][result_view_settings][display_item_response] |  | boolean | Whether item response is shown.  Only set if display_items is true.  Must be true for display_item_response_qualifier, show_item_responses_at, hide_item_responses_at, and display_item_response_correctness to be set. |
| quiz[quiz_settings][result_view_settings][display_item_response_qualifier] |  | string | Specifies after which attempts student responses should be shown to them. Only used if display_item_response is true. Allowed values: always , once_per_attempt , after_last_attempt , once_after_last_attempt |
| quiz[quiz_settings][result_view_settings][show_item_responses_at] |  | DateTime | When student responses should be shown to them. Only used if display_item_response is true. |
| quiz[quiz_settings][result_view_settings][hide_item_responses_at] |  | DateTime | When student responses should be hidden from them. Only used if display_item_response is true. |
| quiz[quiz_settings][result_view_settings][display_item_response_correctness] |  | boolean | Whether item correctness is shown.  Only set if display_item_response is true.  Must be true for display_item_response_correctness_qualifier, show_item_response_correctness_at, hide_item_response_correctness_at and display_item_correct_answer to be set. |
| quiz[quiz_settings][result_view_settings][display_item_response_correctness_qualifier] |  | string | Specifies after which attempts student response correctness should be shown to them. Only used if display_item_response_correctness is true. Allowed values: always , after_last_attempt |
| quiz[quiz_settings][result_view_settings][show_item_response_correctness_at] |  | DateTime | When student response correctness should be shown to them. Only used if display_item_response_correctness is true. |
| quiz[quiz_settings][result_view_settings][hide_item_response_correctness_at] |  | DateTime | When student response correctness should be hidden from them. Only used if display_item_response_correctness is true. |
| quiz[quiz_settings][result_view_settings][display_item_correct_answer] |  | boolean | Whether correct answer is shown.  Only set if display_item_response_correctness is true. |
| quiz[quiz_settings][result_view_settings][display_item_feedback] |  | boolean | Whether Item feedback is shown.  Only set if display_items is true. |
| quiz[quiz_settings][shuffle_answers] |  | boolean | Whether answers should be shuffled for students. |
| quiz[quiz_settings][shuffle_questions] |  | boolean | Whether questions should be shuffled for students. |
| quiz[quiz_settings][require_student_access_code] |  | boolean | Whether an access code is needed to take the quiz. |
| quiz[quiz_settings][student_access_code] |  | string | Access code to restrict quiz access. Should be null if no restriction. |
| quiz[quiz_settings][has_time_limit] |  | boolean | Whether there is a time limit for the quiz. |
| quiz[quiz_settings][session_time_limit_in_seconds] |  | Positive Integer | Limit the time a student can work on the quiz. Should be null if no restriction. |


#### Example Request:


```
curl 'https://<canvas>/api/quiz/v1/courses/1/quizzes' \
     -X POST \
     -H 'Authorization Bearer <token>' \
     -d 'quiz[title]=New quiz' \
     -d 'quiz[assignment_group_id]=1' \
     -d 'quiz[points_possible]=100.0' \
     -d 'quiz[due_at]=2023-01-02T00:00:00Z' \
     -d 'quiz[lock_at]=2023-01-03T00:00:00Z' \
     -d 'quiz[unlock_at]=2023-01-01T00:00:00Z' \
     -d 'quiz[grading_type]=points' \
     -d 'quiz[instructions]=Instructions for quiz' \
     -d 'quiz[quiz_settings][calculator_type]=scientific' \
     -d 'quiz[quiz_settings][filter_ip_address]=true' \
     -d 'quiz[quiz_settings][filters][ips]=[["10.0.0.0","10.10.0.0"], ["12.0.0.0", "12.10.10.0"]]' \
     -d 'quiz[quiz_settings][one_at_a_time_type]=question' \
     -d 'quiz[quiz_settings][allow_backtracking]=true' \
     -d 'quiz[quiz_settings][shuffle_answers]=true' \
     -d 'quiz[quiz_settings][shuffle_questions]=true' \
     -d 'quiz[quiz_settings][require_student_access_code]=true' \
     -d 'quiz[quiz_settings][student_access_code]=12345' \
     -d 'quiz[quiz_settings][has_time_limit]=true' \
     -d 'quiz[quiz_settings][session_time_limit_in_seconds]=7500' \
     -d 'quiz[quiz_settings][multiple_attempts][max_attempts]=4' \
     -d 'quiz[quiz_settings][multiple_attempts][attempt_limit]=true' \
     -d 'quiz[quiz_settings][multiple_attempts][score_to_keep]=average' \
     -d 'quiz[quiz_settings][multiple_attempts][cooling_period]=true' \
     -d 'quiz[quiz_settings][multiple_attempts][cooling_period_seconds]=93600' \
     -d 'quiz[quiz_settings][multiple_attempts][multiple_attempts_enabled]=true' \
     -d 'quiz[quiz_settings][result_view_settings][display_items]=true' \
     -d 'quiz[quiz_settings][result_view_settings][display_item_feedback]=true' \
     -d 'quiz[quiz_settings][result_view_settings][display_item_response]=true' \
     -d 'quiz[quiz_settings][result_view_settings][display_item_response_qualifier]=always' \
     -d 'quiz[quiz_settings][result_view_settings][show_item_responses_at]=2023-01-01T00:00:00Z' \
     -d 'quiz[quiz_settings][result_view_settings][hide_item_responses_at]=2023-01-02T00:00:00Z' \
     -d 'quiz[quiz_settings][result_view_settings][display_points_awarded]=true' \
     -d 'quiz[quiz_settings][result_view_settings][result_view_restricted]=true' \
     -d 'quiz[quiz_settings][result_view_settings][display_points_possible]=true' \
     -d 'quiz[quiz_settings][result_view_settings][display_item_correct_answer]=true' \
     -d 'quiz[quiz_settings][result_view_settings][display_item_response_correctness]=true'
     -d 'quiz[quiz_settings][result_view_settings][display_item_response_correctness_qualifier]=always' \
     -d 'quiz[quiz_settings][result_view_settings][show_item_response_correctness_at]=2023-01-01T00:00:00Z' \
     -d 'quiz[quiz_settings][result_view_settings][hide_item_response_correctness_at]=2023-01-02T00:00:00Z' \
```


---

## Update a single quiz


### PATCH /api/quiz/v1/courses/:course_id/quizzes/:assignment_id


Update a single quiz for the course.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| course_id | Required | integer | no description |
| assignment_id | Required | integer | The id of the assignment associated with the quiz. |
| quiz[title] |  | string | The title of the quiz. |
| quiz[assignment_group_id] |  | integer | The ID of the quizâs assignment group. |
| quiz[points_possible] |  | number | The total point value given to the quiz. Must be positive. |
| quiz[due_at] |  | DateTime | When the quiz is due. |
| quiz[lock_at] |  | DateTime | When to lock the quiz. |
| quiz[unlock_at] |  | DateTime | When to unlock the quiz. |
| quiz[grading_type] |  | string | The type of grading the assignment receives. Allowed values: pass_fail , percent , letter_grade , gpa_scale , points |
| quiz[instructions] |  | string | Instructions for the quiz. |
| quiz[quiz_settings][calculator_type] |  | string | Specifies which type of Calculator a student can use during Quiz taking. Should be null if no calculator is allowed. Allowed values: none , basic , scientific |
| quiz[quiz_settings][filter_ip_address] |  | boolean | Whether IP filtering is needed. Must be true for filters to take effect. |
| quiz[quiz_settings][filters][ips][] |  | string | Specifies ranges of IP addresses where the quiz can be taken from. Each range is an array like [start address, end address], or null if thereâs no restriction. Specifies the range of IP addresses where the quiz can be taken from. Should be null if thereâs no restriction. |
| quiz[quiz_settings][multiple_attempts][multiple_attempts_enabled] |  | boolean | Whether multiple attempts for this quiz is true. |
| quiz[quiz_settings][multiple_attempts][attempt_limit] |  | boolean | Whether there is an attempt limit.  Only set if multiple_attempts_enabled is true. |
| quiz[quiz_settings][multiple_attempts][max_attempts] |  | Positive Integer | The allowed attempts a student can take. If null, the allowed attempts are unlimited. Only used if attempt_limit is true. |
| quiz[quiz_settings][multiple_attempts][score_to_keep] |  | string | Whichever score to keep for the attempts. Only used if multiple_attempts_enabled is true. Allowed values: average , first , highest , latest |
| quiz[quiz_settings][multiple_attempts][cooling_period] |  | boolean | Whether there is a cooling period. Only used if multiple_attempts_enabled is true. |
| quiz[quiz_settings][multiple_attempts][cooling_period_seconds] |  | Positive Integer | Required waiting period in seconds between attempts. If null, there is no required time.  Only used if cooling_period is true. |
| quiz[quiz_settings][one_at_a_time_type] |  | string | Specifies the settings for questions to display when quiz taking. Allowed values: none , question |
| quiz[quiz_settings][allow_backtracking] |  | boolean | Whether to allow user to return to previous questions when âone_at_a_time_typeâ is set to âquestionâ. |
| quiz[quiz_settings][result_view_settings][result_view_restricted] |  | boolean | Whether the results view is restricted for students.  Must be true for any student restrictions to be set. |
| quiz[quiz_settings][result_view_settings][display_points_awarded] |  | boolean | Whether points are shown. Must set result_view_restricted to true to use this parameter. |
| quiz[quiz_settings][result_view_settings][display_points_possible] |  | boolean | Whether points possible is shown. Must set result_view_restricted to true to use this parameter. |
| quiz[quiz_settings][result_view_settings][display_items] |  | boolean | Whether to show items in the results view.  Must be true for any items restrictions to be set. |
| quiz[quiz_settings][result_view_settings][display_item_response] |  | boolean | Whether item response is shown.  Only set if display_items is true.  Must be true for display_item_response_qualifier, show_item_responses_at, hide_item_responses_at, and display_item_response_correctness to be set. |
| quiz[quiz_settings][result_view_settings][display_item_response_qualifier] |  | string | Specifies after which attempts student responses should be shown to them. Only used if display_item_response is true. Allowed values: always , once_per_attempt , after_last_attempt , once_after_last_attempt |
| quiz[quiz_settings][result_view_settings][show_item_responses_at] |  | DateTime | When student responses should be shown to them. Only used if display_item_response is true. |
| quiz[quiz_settings][result_view_settings][hide_item_responses_at] |  | DateTime | When student responses should be hidden from them. Only used if display_item_response is true. |
| quiz[quiz_settings][result_view_settings][display_item_response_correctness] |  | boolean | Whether item correctness is shown.  Only set if display_item_response is true.  Must be true for display_item_response_correctness_qualifier, show_item_response_correctness_at, hide_item_response_correctness_at and display_item_correct_answer to be set. |
| quiz[quiz_settings][result_view_settings][display_item_response_correctness_qualifier] |  | string | Specifies after which attempts student response correctness should be shown to them. Only used if display_item_response_correctness is true. Allowed values: always , after_last_attempt |
| quiz[quiz_settings][result_view_settings][show_item_response_correctness_at] |  | DateTime | When student response correctness should be shown to them. Only used if display_item_response_correctness is true. |
| quiz[quiz_settings][result_view_settings][hide_item_response_correctness_at] |  | DateTime | When student response correctness should be hidden from them. Only used if display_item_response_correctness is true. |
| quiz[quiz_settings][result_view_settings][display_item_correct_answer] |  | boolean | Whether correct answer is shown.  Only set if display_item_response_correctness is true. |
| quiz[quiz_settings][result_view_settings][display_item_feedback] |  | boolean | Whether Item feedback is shown.  Only set if display_items is true. |
| quiz[quiz_settings][shuffle_answers] |  | boolean | Whether answers should be shuffled for students. |
| quiz[quiz_settings][shuffle_questions] |  | boolean | Whether questions should be shuffled for students. |
| quiz[quiz_settings][require_student_access_code] |  | boolean | Whether an access code is needed to take the quiz. |
| quiz[quiz_settings][student_access_code] |  | string | Access code to restrict quiz access. Should be null if no restriction. |
| quiz[quiz_settings][has_time_limit] |  | boolean | Whether there is a time limit for the quiz. |
| quiz[quiz_settings][session_time_limit_in_seconds] |  | Positive Integer | Limit the time a student can work on the quiz. Should be null if no restriction. |


#### Example Request:


```
curl 'https://<canvas>/api/quiz/v1/courses/1/quizzes/12' \
     -X PATCH \
     -H 'Authorization: Bearer <token>' \
     -d 'quiz[title]=New quiz' \
     -d 'quiz[assignment_group_id]=1' \
     -d 'quiz[points_possible]=100.0' \
     -d 'quiz[due_at]=2023-01-02T00:00:00Z' \
     -d 'quiz[lock_at]=2023-01-03T00:00:00Z' \
     -d 'quiz[unlock_at]=2023-01-01T00:00:00Z' \
     -d 'quiz[grading_type]=points' \
     -d 'quiz[instructions]=Instructions for quiz' \
     -d 'quiz[quiz_settings][calculator_type]=scientific' \
     -d 'quiz[quiz_settings][filter_ip_address]=true' \
     -d 'quiz[quiz_settings][filters][ips]=[["10.0.0.0","10.10.0.0"], ["12.0.0.0", "12.10.10.0"]]' \
     -d 'quiz[quiz_settings][one_at_a_time_type]=question' \
     -d 'quiz[quiz_settings][allow_backtracking]=true' \
     -d 'quiz[quiz_settings][shuffle_answers]=true' \
     -d 'quiz[quiz_settings][shuffle_questions]=true' \
     -d 'quiz[quiz_settings][require_student_access_code]=true' \
     -d 'quiz[quiz_settings][student_access_code]=12345'
```


---

## Delete a new quiz


### DELETE /api/quiz/v1/courses/:course_id/quizzes/:assignment_id


Delete a single new quiz.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| course_id | Required | integer | no description |
| assignment_id | Required | integer | The id of the assignment associated with the quiz. |


#### Example Request:


```
curl 'https://<canvas>/api/quiz/v1/courses/1/quizzes/12' \
     -X DELETE \
     -H 'Authorization: Bearer <token>'
```
