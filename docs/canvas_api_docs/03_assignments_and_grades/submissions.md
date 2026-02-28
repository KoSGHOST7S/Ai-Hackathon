# Submissions

> Canvas API — Assignments & Grades  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Submit an assignmentSubmissionsController#create


### POST /api/v1/courses/:course_id/assignments/:assignment_id/submissions


### POST /api/v1/sections/:section_id/assignments/:assignment_id/submissions


Make a submission for an assignment. You must be actively enrolled as a student in the course/section to do this. Concluded and pending enrollments are not permitted.


All online turn-in submission types are supported in this API. However, there are a few things that are not yet supported:

- Files can be submitted based on a file ID of a user or group file or through the file upload API . However, there is no API yet for listing the user and group files.
- Media comments can be submitted, however, there is no API yet for creating a media comment to submit.
- Integration with Google Docs is not yet supported.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| comment[text_comment] |  | string | Include a textual comment with the submission. |
| submission[group_comment] |  | boolean | Whether or not this comment should be sent to the entire group (defaults to false). Ignored if this is not a group assignment or if no text_comment is provided. |
| submission[submission_type] | Required | string | The type of submission being made. The assignment submission_types must include this submission type as an allowed option, or the submission will be rejected with a 400 error. The submission_type given determines which of the following parameters is used. For instance, to submit a URL, submission[submission_type] must be set to âonline_urlâ, otherwise the submission[url] parameter will be ignored. âbasic_lti_launchâ requires the assignment submission_type âonlineâ or âexternal_toolâ Allowed values: online_text_entry , online_url , online_upload , media_recording , basic_lti_launch , student_annotation |
| submission[body] |  | string | Submit the assignment as an HTML document snippet. Note this HTML snippet will be sanitized using the same ruleset as a submission made from the Canvas web UI. The sanitized HTML will be returned in the response as the submission body. Requires a submission_type of âonline_text_entryâ. |
| submission[url] |  | string | Submit the assignment as a URL. The URL scheme must be âhttpâ or âhttpsâ, no âftpâ or other URL schemes are allowed. If no scheme is given (e.g. â www.example.com â) then âhttpâ will be assumed. Requires a submission_type of âonline_urlâ or âbasic_lti_launchâ. |
| submission[file_ids][] |  | integer | Submit the assignment as a set of one or more previously uploaded files residing in the submitting userâs files section (or the groupâs files section, for group assignments). To upload a new file to submit, see the submissions Upload a file API . Requires a submission_type of âonline_uploadâ. |
| submission[media_comment_id] |  | string | The media comment id to submit. Media comment ids can be submitted via this API, however, note that there is not yet an API to generate or list existing media comments, so this functionality is currently of limited use. Requires a submission_type of âmedia_recordingâ. |
| submission[media_comment_type] |  | string | The type of media comment being submitted. Allowed values: audio , video |
| submission[user_id] |  | integer | Submit on behalf of the given user. Requires grading permission. |
| submission[annotatable_attachment_id] |  | integer | The Attachment ID of the document being annotated. This should match the annotatable_attachment_id on the assignment. Requires a submission_type of âstudent_annotationâ. |
| submission[submitted_at] |  | DateTime | Choose the time the submission is listed as submitted at.  Requires grading permission. |


---

## List assignment submissionsSubmissionsApiController#index


### GET /api/v1/courses/:course_id/assignments/:assignment_id/submissions


### GET /api/v1/sections/:section_id/assignments/:assignment_id/submissions


A paginated list of all existing submissions for an assignment.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| include[] |  | string | Associations to include with the group.  âgroupâ will add group_id and group_name. Allowed values: submission_history , submission_comments , submission_html_comments , rubric_assessment , assignment , visibility , course , user , group , read_status , student_entered_score |
| grouped |  | boolean | If this argument is true, the response will be grouped by student groups. |


#### API response field:

- assignment_id The unique identifier for the assignment.
- user_id The id of the user who submitted the assignment.
- grader_id The id of the user who graded the submission. This will be null for submissions that havenât been graded yet. It will be a positive number if a real user has graded the submission and a negative number if the submission was graded by a process (e.g. Quiz autograder and autograding LTI tools).  Specifically autograded quizzes set grader_id to the negative of the quiz id.  Submissions autograded by LTI tools set grader_id to the negative of the tool id.
- canvadoc_document_id The id for the canvadoc document associated with this submission, if it was a file upload.
- submitted_at The timestamp when the assignment was submitted, if an actual submission has been made.
- score The raw score for the assignment submission.
- attempt If multiple submissions have been made, this is the attempt number.
- body The content of the submission, if it was submitted directly in a text field.
- grade The grade for the submission, translated into the assignment grading scheme (so a letter grade, for example).
- grade_matches_current_submission A boolean flag which is false if the student has re-submitted since the submission was last graded.
- preview_url Link to the URL in canvas where the submission can be previewed. This will require the user to log in.
- redo_request If the submission was reassigned
- url If the submission was made as a URL.
- late Whether the submission was made after the applicable due date.
- assignment_visible Whether this assignment is visible to the user who submitted the assignment.
- workflow_state The current status of the submission. Possible values: âsubmittedâ, âunsubmittedâ, âgradedâ, âpending_reviewâ


---

## List submissions for multiple assignmentsSubmissionsApiController#for_students


### GET /api/v1/courses/:course_id/students/submissions


### GET /api/v1/sections/:section_id/students/submissions


A paginated list of all existing submissions for a given set of students and assignments.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| student_ids[] |  | string | List of student ids to return submissions for. If this argument is omitted, return submissions for the calling user. Students may only list their own submissions. Observers may only list those of associated students. The special id âallâ will return submissions for all students in the course/section as appropriate. |
| assignment_ids[] |  | string | List of assignments to return submissions for. If none are given, submissions for all assignments are returned. |
| grouped |  | boolean | If this argument is present, the response will be grouped by student, rather than a flat array of submissions. |
| post_to_sis |  | boolean | If this argument is set to true, the response will only include submissions for assignments that have the post_to_sis flag set to true and user enrollments that were added through sis. |
| submitted_since |  | DateTime | If this argument is set, the response will only include submissions that were submitted after the specified date_time. This will exclude submissions that do not have a submitted_at which will exclude unsubmitted submissions. The value must be formatted as ISO 8601 YYYY-MM-DDTHH:MM:SSZ. |
| graded_since |  | DateTime | If this argument is set, the response will only include submissions that were graded after the specified date_time. This will exclude submissions that have not been graded. The value must be formatted as ISO 8601 YYYY-MM-DDTHH:MM:SSZ. |
| grading_period_id |  | integer | The id of the grading period in which submissions are being requested (Requires grading periods to exist on the account) |
| workflow_state |  | string | The current status of the submission Allowed values: submitted , unsubmitted , graded , pending_review |
| enrollment_state |  | string | The current state of the enrollments. If omitted will include all enrollments that are not deleted. Allowed values: active , concluded |
| state_based_on_date |  | boolean | If omitted it is set to true. When set to false it will ignore the effective state of the student enrollments and use the workflow_state for the enrollments. The argument is ignored unless enrollment_state argument is also passed. |
| order |  | string | The order submissions will be returned in.  Defaults to âidâ.  Doesnât affect results for âgroupedâ mode. Allowed values: id , graded_at |
| order_direction |  | string | Determines whether ordered results are returned in ascending or descending order.  Defaults to âascendingâ.  Doesnât affect results for âgroupedâ mode. Allowed values: ascending , descending |
| include[] |  | string | Associations to include with the group. total_scores requires the grouped argument. Allowed values: submission_history , submission_comments , submission_html_comments , rubric_assessment , assignment , total_scores , visibility , course , user , sub_assignment_submissions , peer_review_submissions , student_entered_score |


#### Example Response:


```
# Without grouped:

[
  { "assignment_id": 100, grade: 5, "user_id": 1, ... },
  { "assignment_id": 101, grade: 6, "user_id": 2, ... }

# With grouped:

[
  {
    "user_id": 1,
    "submissions": [
      { "assignment_id": 100, grade: 5, ... },
      { "assignment_id": 101, grade: 6, ... }
    ]
  }
]
```


---

## Get a single submissionSubmissionsApiController#show


### GET /api/v1/courses/:course_id/assignments/:assignment_id/submissions/:user_id


### GET /api/v1/sections/:section_id/assignments/:assignment_id/submissions/:user_id


Get a single submission, based on user id.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| include[] |  | string | Associations to include with the group. Allowed values: submission_history , submission_comments , submission_html_comments , rubric_assessment , full_rubric_assessment , visibility , course , user , read_status , student_entered_score |


---

## Get a single submission by anonymous idSubmissionsApiController#show_anonymous


### GET /api/v1/courses/:course_id/assignments/:assignment_id/anonymous_submissions/:anonymous_id


### GET /api/v1/sections/:section_id/assignments/:assignment_id/anonymous_submissions/:anonymous_id


Get a single submission, based on the submissionâs anonymous id.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| include[] |  | string | Associations to include with the group. Allowed values: submission_history , submission_comments , rubric_assessment , full_rubric_assessment , visibility , course , user , read_status |


---

## Upload a fileSubmissionsApiController#create_file


### POST /api/v1/courses/:course_id/assignments/:assignment_id/submissions/:user_id/files


### POST /api/v1/sections/:section_id/assignments/:assignment_id/submissions/:user_id/files


Upload a file to a submission.


This API endpoint is the first step in uploading a file to a submission as a student. See the File Upload Documentation for details on the file upload workflow.


The final step of the file upload workflow will return the attachment data, including the new file id. The caller can then POST to submit the online_upload assignment with these file ids.


---

## Grade or comment on a submissionSubmissionsApiController#update


### PUT /api/v1/courses/:course_id/assignments/:assignment_id/submissions/:user_id


### PUT /api/v1/sections/:section_id/assignments/:assignment_id/submissions/:user_id


Comment on and/or update the grading for a studentâs assignment submission. If any submission or rubric_assessment arguments are provided, the user must have permission to manage grades in the appropriate context (course or section).


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| comment[text_comment] |  | string | Add a textual comment to the submission. |
| comment[attempt] |  | integer | The attempt number (starts at 1) to associate the comment with. |
| comment[group_comment] |  | boolean | Whether or not this comment should be sent to the entire group (defaults to false). Ignored if this is not a group assignment or if no text_comment is provided. |
| comment[media_comment_id] |  | string | Add an audio/video comment to the submission. Media comments can be added via this API, however, note that there is not yet an API to generate or list existing media comments, so this functionality is currently of limited use. |
| comment[media_comment_type] |  | string | The type of media comment being added. Allowed values: audio , video |
| comment[file_ids][] |  | integer | Attach files to this comment that were previously uploaded using the Submission Comment APIâs files action |
| include[] |  | string | Associations to include with the submission. âsubmission_commentsâ is always included by default. âsubmission_commentsâ: Comments on the submission (always included) âvisibilityâ: Whether the assignment is visible to the owner of the submission âsub_assignment_submissionsâ: Sub-assignment submissions for discussion checkpoints âpeer_review_submissionsâ: Peer review submission data when peer review allocation and grading is enabled âprovisional_gradesâ: Provisional grades (only available for moderated assignments) âgroupâ: Group information (id and name) for group assignments Allowed values: submission_comments , visibility , sub_assignment_submissions , peer_review_submissions , provisional_grades , group |
| prefer_points_over_scheme |  | boolean | Treat posted_grade as points if the value matches a grading scheme value |
| submission[posted_grade] |  | string | Assign a score to the submission, updating both the âscoreâ and âgradeâ fields on the submission record. This parameter can be passed in a few different formats: points A floating point or integral value, such as â13.5â. The grade will be interpreted directly as the score of the assignment. Values above assignment.points_possible are allowed, for awarding extra credit. percentage A floating point value appended with a percent sign, such as "40%". The grade will be interpreted as a percentage score on the assignment, where 100% == assignment.points_possible. Values above 100% are allowed, for awarding extra credit. letter grade A letter grade, following the assignmentâs defined letter grading scheme. For example, "A-". The resulting score will be the high end of the defined range for the letter grade. For instance, if "B" is defined as 86% to 84%, a letter grade of "B" will be worth 86%. The letter grade will be rejected if the assignment does not have a defined letter grading scheme. For more fine-grained control of scores, pass in points or percentage rather than the letter grade. âpass/complete/fail/incompleteâ A string value of âpassâ or âcompleteâ will give a score of 100%. "fail" or "incomplete" will give a score of 0. Note that assignments with grading_type of âpass_failâ can only be assigned a score of 0 or assignment.points_possible, nothing inbetween. If a posted_grade in the âpointsâ or âpercentageâ format is sent, the grade will only be accepted if the grade equals one of those two values. |
| submission[excuse] |  | boolean | Sets the âexcusedâ status of an assignment. |
| submission[late_policy_status] |  | string | Sets the late policy status to either âlateâ, âmissingâ, âextendedâ, ânoneâ, or null. NB: "extended" values can only be set in the UI when the "UI features for 'extended' Submissions" Account Feature is on |
| submission[sticker] |  | string | Sets the sticker for the submission. Allowed values: apple , basketball , bell , book , bookbag , briefcase , bus , calendar , chem , design , pencil , beaker , paintbrush , computer , column , pen , tablet , telescope , calculator , paperclip , composite_notebook , scissors , ruler , clock , globe , grad , gym , mail , microscope , mouse , music , notebook , page , panda1 , panda2 , panda3 , panda4 , panda5 , panda6 , panda7 , panda8 , panda9 , presentation , science , science2 , star , tag , tape , target , trophy |
| submission[seconds_late_override] |  | integer | Sets the seconds late if late policy status is âlateâ |
| submission[peer_review] |  | boolean | When true, updates the peer review sub assignment submission instead of the parent assignment submission. The parent assignment must have peer reviews enabled, the peer_review_allocation_and_grading feature flag must be enabled for the course, and the assignment must have an associated peer review sub assignment. If any of these conditions are not met, the API will return a 422 error. |
| rubric_assessment |  | RubricAssessment | Assign a rubric assessment to this assignment submission. The sub-parameters here depend on the rubric for the assignment. The general format is, for each row in the rubric: The points awarded for this row. rubric_assessment [ criterion_id ] [ points ] The rating id for the row. rubric_assessment [ criterion_id ] [ rating_id ] Comments to add for this row. rubric_assessment [ criterion_id ] [ comments ] For example, if the assignment rubric is (in JSON format): [   {     'id': 'crit1',     'points': 10,     'description': 'Criterion 1',     'ratings':     [       { 'id': 'rat1', 'description': 'Good', 'points': 10 },       { 'id': 'rat2', 'description': 'Poor', 'points': 3 }     ]   },   {     'id': 'crit2',     'points': 5,     'description': 'Criterion 2',     'ratings':     [       { 'id': 'rat1', 'description': 'Exemplary', 'points': 5 },       { 'id': 'rat2', 'description': 'Complete', 'points': 5 },       { 'id': 'rat3', 'description': 'Incomplete', 'points': 0 }     ]   } ] Then a possible set of values for rubric_assessment would be: rubric_assessment[crit1][points]=3&rubric_assessment[crit1][rating_id]=rat1&rubric_assessment[crit2][points]=5&rubric_assessment[crit2][rating_id]=rat2&rubric_assessment[crit2][comments]=Well%20Done. |


---

## Grade or comment on a submission by anonymous idSubmissionsApiController#update_anonymous


### PUT /api/v1/courses/:course_id/assignments/:assignment_id/anonymous_submissions/:anonymous_id


### PUT /api/v1/sections/:section_id/assignments/:assignment_id/anonymous_submissions/:anonymous_id


Comment on and/or update the grading for a studentâs assignment submission, fetching the submission by anonymous id (instead of user id). If any submission or rubric_assessment arguments are provided, the user must have permission to manage grades in the appropriate context (course or section).


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| comment[text_comment] |  | string | Add a textual comment to the submission. |
| comment[group_comment] |  | boolean | Whether or not this comment should be sent to the entire group (defaults to false). Ignored if this is not a group assignment or if no text_comment is provided. |
| comment[media_comment_id] |  | string | Add an audio/video comment to the submission. Media comments can be added via this API, however, note that there is not yet an API to generate or list existing media comments, so this functionality is currently of limited use. |
| comment[media_comment_type] |  | string | The type of media comment being added. Allowed values: audio , video |
| comment[file_ids][] |  | integer | Attach files to this comment that were previously uploaded using the Submission Comment APIâs files action |
| include[] |  | string | Associations to include with the submission. âsubmission_commentsâ is always included by default. âsubmission_commentsâ: Comments on the submission (always included) âvisibilityâ: Whether the assignment is visible to the owner of the submission âsub_assignment_submissionsâ: Sub-assignment submissions for discussion checkpoints âpeer_review_submissionsâ: Peer review submission data when peer review allocation and grading is enabled âprovisional_gradesâ: Provisional grades (only available for moderated assignments) âgroupâ: Group information (id and name) for group assignments Allowed values: submission_comments , visibility , sub_assignment_submissions , peer_review_submissions , provisional_grades , group |
| submission[posted_grade] |  | string | Assign a score to the submission, updating both the âscoreâ and âgradeâ fields on the submission record. This parameter can be passed in a few different formats: points A floating point or integral value, such as â13.5â. The grade will be interpreted directly as the score of the assignment. Values above assignment.points_possible are allowed, for awarding extra credit. percentage A floating point value appended with a percent sign, such as "40%". The grade will be interpreted as a percentage score on the assignment, where 100% == assignment.points_possible. Values above 100% are allowed, for awarding extra credit. letter grade A letter grade, following the assignmentâs defined letter grading scheme. For example, "A-". The resulting score will be the high end of the defined range for the letter grade. For instance, if "B" is defined as 86% to 84%, a letter grade of "B" will be worth 86%. The letter grade will be rejected if the assignment does not have a defined letter grading scheme. For more fine-grained control of scores, pass in points or percentage rather than the letter grade. âpass/complete/fail/incompleteâ A string value of âpassâ or âcompleteâ will give a score of 100%. "fail" or "incomplete" will give a score of 0. Note that assignments with grading_type of âpass_failâ can only be assigned a score of 0 or assignment.points_possible, nothing inbetween. If a posted_grade in the âpointsâ or âpercentageâ format is sent, the grade will only be accepted if the grade equals one of those two values. |
| submission[excuse] |  | boolean | Sets the âexcusedâ status of an assignment. |
| submission[late_policy_status] |  | string | Sets the late policy status to either âlateâ, âmissingâ, âextendedâ, ânoneâ, or null. NB: "extended" values can only be set in the UI when the "UI features for 'extended' Submissions" Account Feature is on |
| submission[seconds_late_override] |  | integer | Sets the seconds late if late policy status is âlateâ |
| rubric_assessment |  | RubricAssessment | Assign a rubric assessment to this assignment submission. The sub-parameters here depend on the rubric for the assignment. The general format is, for each row in the rubric: The points awarded for this row. rubric_assessment [ criterion_id ] [ points ] The rating id for the row. rubric_assessment [ criterion_id ] [ rating_id ] Comments to add for this row. rubric_assessment [ criterion_id ] [ comments ] For example, if the assignment rubric is (in JSON format): [   {     'id': 'crit1',     'points': 10,     'description': 'Criterion 1',     'ratings':     [       { 'id': 'rat1', 'description': 'Good', 'points': 10 },       { 'id': 'rat2', 'description': 'Poor', 'points': 3 }     ]   },   {     'id': 'crit2',     'points': 5,     'description': 'Criterion 2',     'ratings':     [       { 'id': 'rat1', 'description': 'Exemplary', 'points': 5 },       { 'id': 'rat2', 'description': 'Complete', 'points': 5 },       { 'id': 'rat3', 'description': 'Incomplete', 'points': 0 }     ]   } ] Then a possible set of values for rubric_assessment would be: rubric_assessment[crit1][points]=3&rubric_assessment[crit1][rating_id]=rat1&rubric_assessment[crit2][points]=5&rubric_assessment[crit2][rating_id]=rat2&rubric_assessment[crit2][comments]=Well%20Done. |


---

## List gradeable studentsSubmissionsApiController#gradeable_students


### GET /api/v1/courses/:course_id/assignments/:assignment_id/gradeable_students


A paginated list of gradeable students for the assignment. The caller must have permission to view grades.


If anonymous grading is enabled for the current assignment and the allow_new_anonymous_id parameter is passed, the returned data will not include any values identifying the student, but will instead include an assignment-specific anonymous ID for each student.


Section-limited instructors will only see students in their own sections.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| sort |  | string | Sort results by this field. Allowed values: name |
| order |  | string | The sorting order. Defaults to âascâ. Allowed values: asc , desc |


---

## List multiple assignments gradeable studentsSubmissionsApiController#multiple_gradeable_students


### GET /api/v1/courses/:course_id/assignments/gradeable_students


A paginated list of students eligible to submit a list of assignments. The caller must have permission to view grades for the requested course.


Section-limited instructors will only see students in their own sections.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| assignment_ids[] |  | string | Assignments being requested |


#### Example Response:


```
A [UserDisplay] with an extra assignment_ids field to indicate what assignments
that user can submit

[
  {
    "id": 2,
    "display_name": "Display Name",
    "avatar_image_url": "http://avatar-image-url.jpeg",
    "html_url": "http://canvas.com",
    "assignment_ids": [1, 2, 3]
  }
]
```


---

## Grade or comment on multiple submissionsSubmissionsApiController#bulk_update


### POST /api/v1/courses/:course_id/submissions/update_grades


### POST /api/v1/courses/:course_id/assignments/:assignment_id/submissions/update_grades


### POST /api/v1/sections/:section_id/submissions/update_grades


### POST /api/v1/sections/:section_id/assignments/:assignment_id/submissions/update_grades


Update the grading and comments on multiple studentâs assignment submissions in an asynchronous job.


The user must have permission to manage grades in the appropriate context (course or section).


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| grade_data[<student_id>][posted_grade] |  | string | See documentation for the posted_grade argument in the Submissions Update documentation |
| grade_data[<student_id>][excuse] |  | boolean | See documentation for the excuse argument in the Submissions Update documentation |
| grade_data[<student_id>][rubric_assessment] |  | RubricAssessment | See documentation for the rubric_assessment argument in the Submissions Update documentation |
| grade_data[<student_id>][text_comment] |  | string | no description |
| grade_data[<student_id>][group_comment] |  | boolean | no description |
| grade_data[<student_id>][media_comment_id] |  | string | no description |
| grade_data[<student_id>][media_comment_type] |  | string | no description Allowed values: audio , video |
| grade_data[<student_id>][file_ids][] |  | integer | See documentation for the comment[] arguments in the Submissions Update documentation |
| grade_data[<assignment_id>][<student_id>] |  | integer | Specifies which assignment to grade.  This argument is not necessary when using the assignment-specific endpoints. |


#### Example Request:


```
curl 'https://<canvas>/api/v1/courses/1/assignments/2/submissions/update_grades' \
     -X POST \
     -F 'grade_data[3][posted_grade]=88' \
     -F 'grade_data[4][posted_grade]=95' \
     -H "Authorization: Bearer <token>"
```


---

## Mark submission as readSubmissionsApiController#mark_submission_read


### PUT /api/v1/courses/:course_id/assignments/:assignment_id/submissions/:user_id/read


### PUT /api/v1/sections/:section_id/assignments/:assignment_id/submissions/:user_id/read


No request fields are necessary.


On success, the response will be 204 No Content with an empty body.


#### Example Request:


```
curl 'https://<canvas>/api/v1/courses/<course_id>/assignments/<assignment_id>/submissions/<user_id>/read.json' \
     -X PUT \
     -H "Authorization: Bearer <token>" \
     -H "Content-Length: 0"
```


---

## Mark submission as unreadSubmissionsApiController#mark_submission_unread


### DELETE /api/v1/courses/:course_id/assignments/:assignment_id/submissions/:user_id/read


### DELETE /api/v1/sections/:section_id/assignments/:assignment_id/submissions/:user_id/read


No request fields are necessary.


On success, the response will be 204 No Content with an empty body.


#### Example Request:


```
curl 'https://<canvas>/api/v1/courses/<course_id>/assignments/<assignment_id>/submissions/<user_id>/read.json' \
     -X DELETE \
     -H "Authorization: Bearer <token>"
```


---

## Mark bulk submissions as readSubmissionsApiController#mark_bulk_submissions_as_read


### PUT /api/v1/courses/:course_id/submissions/bulk_mark_read


### PUT /api/v1/sections/:section_id/submissions/bulk_mark_read


Accepts a string array of submission ids. Loops through and marks each submission as read


On success, the response will be 204 No Content with an empty body.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| submissionIds[] |  | string | no description |


#### Example Request:


```
curl 'https://<canvas>/api/v1/courses/<course_id>/submissions/bulk_mark_read.json' \
     -X PUT \
     -H "Authorization: Bearer <token>" \
     -H "Content-Length: 0" \
     -F 'submissionIds=['88']'
```


---

## Mark submission item as readSubmissionsApiController#mark_submission_item_read


### PUT /api/v1/courses/:course_id/assignments/:assignment_id/submissions/:user_id/read/:item


### PUT /api/v1/sections/:section_id/assignments/:assignment_id/submissions/:user_id/read/:item


No request fields are necessary.


A submission item can be âgradeâ, âcommentâ or ârubricâ


On success, the response will be 204 No Content with an empty body.


#### Example Request:


```
curl 'https://<canvas>/api/v1/courses/<course_id>/assignments/<assignment_id>/submissions/<user_id>/read/<item>.json' \
     -X PUT \
     -H "Authorization: Bearer <token>" \
     -H "Content-Length: 0"
```


---

## Clear unread status for all submissions.SubmissionsApiController#submissions_clear_unread


### PUT /api/v1/courses/:course_id/submissions/:user_id/clear_unread


### PUT /api/v1/sections/:section_id/submissions/:user_id/clear_unread


Site-admin-only endpoint.


No request fields are necessary.


On success, the response will be 204 No Content with an empty body.


#### Example Request:


```
curl 'https://<canvas>/api/v1/courses/<course_id>/submissions/<user_id>/clear_unread.json' \
     -X PUT \
     -H "Authorization: Bearer <token>" \
     -H "Content-Length: 0"
```


---

## Get rubric assessments read stateSubmissionsApiController#rubric_assessments_read_state


### GET /api/v1/courses/:course_id/assignments/:assignment_id/submissions/:user_id/rubric_comments/read


### GET /api/v1/courses/:course_id/assignments/:assignment_id/submissions/:user_id/rubric_assessments/read


### GET /api/v1/sections/:section_id/assignments/:assignment_id/submissions/:user_id/rubric_comments/read


### GET /api/v1/sections/:section_id/assignments/:assignment_id/submissions/:user_id/rubric_assessments/read


Return whether new rubric comments/grading made on a submission have been seen by the student being assessed.


#### Example Request:


```
curl 'https://<canvas>/api/v1/courses/<course_id>/assignments/<assignment_id>/submissions/<user_id>/rubric_comments/read' \
     -H "Authorization: Bearer <token>"

# or

curl 'https://<canvas>/api/v1/courses/<course_id>/assignments/<assignment_id>/submissions/<user_id>/rubric_assessments/read' \
     -H "Authorization: Bearer <token>"
```


#### Example Response:


```
{
  "read": false
}
```


---

## Mark rubric assessments as readSubmissionsApiController#mark_rubric_assessments_read


### PUT /api/v1/courses/:course_id/assignments/:assignment_id/submissions/:user_id/rubric_comments/read


### PUT /api/v1/courses/:course_id/assignments/:assignment_id/submissions/:user_id/rubric_assessments/read


### PUT /api/v1/sections/:section_id/assignments/:assignment_id/submissions/:user_id/rubric_comments/read


### PUT /api/v1/sections/:section_id/assignments/:assignment_id/submissions/:user_id/rubric_assessments/read


Indicate that rubric comments/grading made on a submission have been read by the student being assessed. Only the student who owns the submission can use this endpoint.


NOTE: Rubric assessments will be marked as read automatically when they are viewed in Canvas web.


#### Example Request:


```
curl 'https://<canvas>/api/v1/courses/<course_id>/assignments/<assignment_id>/submissions/<user_id>/rubric_comments/read' \
     -X PUT \
     -H "Authorization: Bearer <token>" \
     -H "Content-Length: 0"

# or

curl 'https://<canvas>/api/v1/courses/<course_id>/assignments/<assignment_id>/submissions/<user_id>/rubric_assessments/read' \
     -X PUT \
     -H "Authorization: Bearer <token>" \
     -H "Content-Length: 0"
```


#### Example Response:


```
{
  "read": true
}
```


---

## Get document annotations read stateSubmissionsApiController#document_annotations_read_state


### GET /api/v1/courses/:course_id/assignments/:assignment_id/submissions/:user_id/document_annotations/read


### GET /api/v1/sections/:section_id/assignments/:assignment_id/submissions/:user_id/document_annotations/read


Return whether annotations made on a submitted document have been read by the student


#### Example Request:


```
curl 'https://<canvas>/api/v1/courses/<course_id>/assignments/<assignment_id>/submissions/<user_id>/document_annotations/read' \
     -H "Authorization: Bearer <token>"
```


#### Example Response:


```
{
  "read": false
}
```


---

## Mark document annotations as readSubmissionsApiController#mark_document_annotations_read


### PUT /api/v1/courses/:course_id/assignments/:assignment_id/submissions/:user_id/document_annotations/read


### PUT /api/v1/sections/:section_id/assignments/:assignment_id/submissions/:user_id/document_annotations/read


Indicate that annotations made on a submitted document have been read by the student. Only the student who owns the submission can use this endpoint.


NOTE: Document annotations will be marked as read automatically when they are viewed in Canvas web.


#### Example Request:


```
curl 'https://<canvas>/api/v1/courses/<course_id>/assignments/<assignment_id>/submissions/<user_id>/document_annotations/read' \
     -X PUT \
     -H "Authorization: Bearer <token>" \
     -H "Content-Length: 0"
```


#### Example Response:


```
{
  "read": true
}
```


---

## Submission SummarySubmissionsApiController#submission_summary


### GET /api/v1/courses/:course_id/assignments/:assignment_id/submission_summary


### GET /api/v1/sections/:section_id/assignments/:assignment_id/submission_summary


Returns the number of submissions for the given assignment based on gradeable students that fall into three categories: graded, ungraded, not submitted.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| grouped |  | boolean | If this argument is true, the response will take into account student groups. |
| include_deactivated |  | boolean | If this argument is true, the response will include deactivated students in the summary (defaults to false). |


#### Example Response:


```
{
  "graded": 5,
  "ungraded": 10,
  "not_submitted": 42
}
```
