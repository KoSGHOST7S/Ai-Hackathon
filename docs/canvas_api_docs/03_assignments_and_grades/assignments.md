# Assignments

> Canvas API — Assignments & Grades  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Delete an assignmentAssignmentsController#destroy


### DELETE /api/v1/courses/:course_id/assignments/:id


Delete the given assignment.


#### Example Request:


```
curl https://<canvas>/api/v1/courses/<course_id>/assignments/<assignment_id> \
     -X DELETE \
     -H 'Authorization: Bearer <token>'
```


---

## List assignmentsAssignmentsApiController#index


### GET /api/v1/courses/:course_id/assignments


### GET /api/v1/courses/:course_id/assignment_groups/:assignment_group_id/assignments


Returns the paginated list of assignments for the current course or assignment group.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| include[] |  | string | Optional information to include with each assignment: submission The current userâs current Submission assignment_visibility An array of ids of students who can see the assignment all_dates An array of AssignmentDate structures, one for each override, and also a base if the assignment has an âEveryoneâ / âEveryone Elseâ date overrides An array of AssignmentOverride structures observed_users An array of submissions for observed users can_edit an extra Boolean value will be included with each Assignment (and AssignmentDate if all_dates is supplied) to indicate whether the caller can edit the assignment or date. Moderated grading and closed grading periods may restrict a userâs ability to edit an assignment. score_statistics An object containing min, max, and mean score on this assignment. This will not be included for students if there are less than 5 graded assignments or if disabled by the instructor. Only valid if âsubmissionâ is also included. ab_guid An array of guid strings for academic benchmarks Allowed values: submission , assignment_visibility , all_dates , overrides , observed_users , can_edit , score_statistics , ab_guid |
| search_term |  | string | The partial title of the assignments to match and return. |
| override_assignment_dates |  | boolean | Apply assignment overrides for each assignment, defaults to true. |
| needs_grading_count_by_section |  | boolean | Split up âneeds_grading_countâ by sections into the âneeds_grading_count_by_sectionâ key, defaults to false |
| bucket |  | string | If included, only return certain assignments depending on due date and submission status. Allowed values: past , overdue , undated , ungraded , unsubmitted , upcoming , future |
| assignment_ids[] |  | string | if set, return only assignments specified |
| order_by |  | string | Determines the order of the assignments. Defaults to âpositionâ. Allowed values: position , name , due_at |
| post_to_sis |  | boolean | Return only assignments that have post_to_sis set or not set. |
| new_quizzes |  | boolean | Return only New Quizzes assignments |


---

## List assignments for userAssignmentsApiController#user_index


### GET /api/v1/users/:user_id/courses/:course_id/assignments


Returns the paginated list of assignments for the specified user if the current user has rights to view. See List assignments for valid arguments.


---

## Duplicate assignmentAssignmentsApiController#duplicate


### POST /api/v1/courses/:course_id/assignments/:assignment_id/duplicate


Duplicate an assignment and return a json based on result_type argument.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| result_type |  | string | Optional information: When the root account has the feature newquizzes_on_quiz_page enabled and this argument is set to âQuizâ the response will be serialized into a quiz format( quizzes ); When this argument isnât specified the response will be serialized into an assignment format; Allowed values: Quiz |


#### Example Request:


```
curl -X POST -H 'Authorization: Bearer <token>' \
https://<canvas>/api/v1/courses/123/assignments/123/duplicate
```


```
curl -X POST -H 'Authorization: Bearer <token>' \
https://<canvas>/api/v1/courses/123/assignments/123/duplicate?result_type=Quiz
```


---

## List group members for a student on an assignmentAssignmentsApiController#student_group_members


### GET /api/v1/courses/:course_id/assignments/:assignment_id/users/:user_id/group_members


Returns student ids and names for the group.


#### Example Request:


```
curl https://<canvas>/api/v1/courses/1/assignments/1/users/1/group_members
```


---

## Get a single assignmentAssignmentsApiController#show


### GET /api/v1/courses/:course_id/assignments/:id


Returns the assignment with the given id.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| include[] |  | string | Associations to include with the assignment. The âassignment_visibilityâ option requires that the Differentiated Assignments course feature be turned on. If âobserved_usersâ is passed, submissions for observed users will also be included. For âscore_statisticsâ to be included, the âsubmissionâ option must also be set. The âpeer_reviewâ option requires that the Peer Review Allocation and Grading course feature be turned on. Allowed values: submission , assignment_visibility , overrides , observed_users , can_edit , score_statistics , ab_guid , peer_review |
| override_assignment_dates |  | boolean | Apply assignment overrides to the assignment, defaults to true. |
| needs_grading_count_by_section |  | boolean | Split up âneeds_grading_countâ by sections into the âneeds_grading_count_by_sectionâ key, defaults to false |
| all_dates |  | boolean | All dates associated with the assignment, if applicable |


---

## Create an assignmentAssignmentsApiController#create


### POST /api/v1/courses/:course_id/assignments


Create a new assignment for this course. The assignment is created in the active state.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| assignment[name] | Required | string | The assignment name. |
| assignment[position] |  | integer | The position of this assignment in the group when displaying assignment lists. |
| assignment[submission_types][] |  | string | List of supported submission types for the assignment. Unless the assignment is allowing online submissions, the array should only have one element. If not allowing online submissions, your options are: " online_quiz " " none " " on_paper " " discussion_topic " " external_tool " If you are allowing online submissions, you can have one or many allowed submission types: "online_upload" "online_text_entry" "online_url" "media_recording" (Only valid when the Kaltura plugin is enabled) "student_annotation" Allowed values: online_quiz , none , on_paper , discussion_topic , external_tool , online_upload , online_text_entry , online_url , media_recording , student_annotation |
| assignment[allowed_extensions][] |  | string | Allowed extensions if submission_types includes âonline_uploadâ Example: allowed_extensions: ["docx","ppt"] |
| assignment[turnitin_enabled] |  | boolean | Only applies when the Turnitin plugin is enabled for a course and the submission_types array includes âonline_uploadâ. Toggles Turnitin submissions for the assignment. Will be ignored if Turnitin is not available for the course. |
| assignment[vericite_enabled] |  | boolean | Only applies when the VeriCite plugin is enabled for a course and the submission_types array includes âonline_uploadâ. Toggles VeriCite submissions for the assignment. Will be ignored if VeriCite is not available for the course. |
| assignment[turnitin_settings] |  | string | Settings to send along to turnitin. See Assignment object definition for format. |
| assignment[integration_data] |  | string | Data used for SIS integrations. Requires admin-level token with the âManage SISâ permission. JSON string required. |
| assignment[integration_id] |  | string | Unique ID from third party integrations |
| assignment[peer_reviews] |  | boolean | If submission_types does not include external_tool,discussion_topic, online_quiz, or on_paper, determines whether or not peer reviews will be turned on for the assignment. |
| assignment[automatic_peer_reviews] |  | boolean | Whether peer reviews will be assigned automatically by Canvas or if teachers must manually assign peer reviews. Does not apply if peer reviews are not enabled. |
| assignment[notify_of_update] |  | boolean | If true, Canvas will send a notification to students in the class notifying them that the content has changed. |
| assignment[group_category_id] |  | integer | If present, the assignment will become a group assignment assigned to the group. |
| assignment[grade_group_students_individually] |  | integer | If this is a group assignment, teachers have the options to grade students individually. If false, Canvas will apply the assignmentâs score to each member of the group. If true, the teacher can manually assign scores to each member of the group. |
| assignment[external_tool_tag_attributes] |  | string | Hash of external tool parameters if submission_types is [âexternal_toolâ]. See Assignment object definition for format. |
| assignment[points_possible] |  | number | The maximum points possible on the assignment. |
| assignment[grading_type] |  | string | The strategy used for grading the assignment. The assignment defaults to âpointsâ if this field is omitted. Allowed values: pass_fail , percent , letter_grade , gpa_scale , points , not_graded |
| assignment[due_at] |  | DateTime | The day/time the assignment is due. Must be between the lock dates if there are lock dates. Accepts times in ISO 8601 format, e.g. 2014-10-21T18:48:00Z. |
| assignment[lock_at] |  | DateTime | The day/time the assignment is locked after. Must be after the due date if there is a due date. Accepts times in ISO 8601 format, e.g. 2014-10-21T18:48:00Z. |
| assignment[unlock_at] |  | DateTime | The day/time the assignment is unlocked. Must be before the due date if there is a due date. Accepts times in ISO 8601 format, e.g. 2014-10-21T18:48:00Z. |
| assignment[description] |  | string | The assignmentâs description, supports HTML. |
| assignment[assignment_group_id] |  | integer | The assignment group id to put the assignment in. Defaults to the top assignment group in the course. |
| assignment[assignment_overrides][] |  | AssignmentOverride | List of overrides for the assignment. |
| assignment[only_visible_to_overrides] |  | boolean | Whether this assignment is only visible to overrides (Only useful if âdifferentiated assignmentsâ account setting is on) |
| assignment[published] |  | boolean | Whether this assignment is published. (Only useful if âdraft stateâ account setting is on) Unpublished assignments are not visible to students. |
| assignment[grading_standard_id] |  | integer | The grading standard id to set for the course.  If no value is provided for this argument the current grading_standard will be un-set from this course. This will update the grading_type for the course to âletter_gradeâ unless it is already âgpa_scaleâ. |
| assignment[omit_from_final_grade] |  | boolean | Whether this assignment is counted towards a studentâs final grade. |
| assignment[hide_in_gradebook] |  | boolean | Whether this assignment is shown in the gradebook. |
| assignment[quiz_lti] |  | boolean | Whether this assignment should use the Quizzes 2 LTI tool. Sets the submission type to âexternal_toolâ and configures the external tool attributes to use the Quizzes 2 LTI tool configured for this course. Has no effect if no Quizzes 2 LTI tool is configured. |
| assignment[moderated_grading] |  | boolean | Whether this assignment is moderated. |
| assignment[grader_count] |  | integer | The maximum number of provisional graders who may issue grades for this assignment. Only relevant for moderated assignments. Must be a positive value, and must be set to 1 if the course has fewer than two active instructors. Otherwise, the maximum value is the number of active instructors in the course minus one, or 10 if the course has more than 11 active instructors. |
| assignment[final_grader_id] |  | integer | The user ID of the grader responsible for choosing final grades for this assignment. Only relevant for moderated assignments. |
| assignment[grader_comments_visible_to_graders] |  | boolean | Boolean indicating if provisional gradersâ comments are visible to other provisional graders. Only relevant for moderated assignments. |
| assignment[graders_anonymous_to_graders] |  | boolean | Boolean indicating if provisional gradersâ identities are hidden from other provisional graders. Only relevant for moderated assignments. |
| assignment[graders_names_visible_to_final_grader] |  | boolean | Boolean indicating if provisional grader identities are visible to the the final grader. Only relevant for moderated assignments. |
| assignment[anonymous_grading] |  | boolean | Boolean indicating if the assignment is graded anonymously. If true, graders cannot see student identities. |
| assignment[allowed_attempts] |  | integer | The number of submission attempts allowed for this assignment. Set to -1 for unlimited attempts. |
| assignment[annotatable_attachment_id] |  | integer | The Attachment ID of the document being annotated. Only applies when submission_types includes âstudent_annotationâ. |
| assignment[asset_processors][] |  | Array | Document processors for this assignment. New document processors can only be added via the interactive LTI Deep Linking flow (in a browser), not via API token or JWT authentication. Deletion of document processors (passing an empty array) is allowed via API. |
| assignment[peer_review][points_possible] |  | number | The maximum points possible for peer reviews. |
| assignment[peer_review][grading_type] |  | string | The strategy used for grading peer reviews. Defaults to âpointsâ if this field is omitted. Allowed values: pass_fail , percent , letter_grade , gpa_scale , points , not_graded |
| assignment[peer_review][due_at] |  | DateTime | The day/time the peer reviews are due. Must be between the lock dates if there are lock dates. Accepts times in ISO 8601 format, e.g. 2025-08-20T12:10:00Z. |
| assignment[peer_review][lock_at] |  | DateTime | The day/time the peer reviews are locked after. Must be after the due date if there is a due date. Accepts times in ISO 8601 format, e.g. 2025-08-25T12:10:00Z. |
| assignment[peer_review][unlock_at] |  | DateTime | The day/time the peer reviews are unlocked. Must be before the due date if there is a due date. Accepts times in ISO 8601 format, e.g. 2025-08-15T12:10:00Z. |
| assignment[peer_review][peer_review_overrides][] |  | AssignmentOverride | List of overrides for the peer reviews. |


---

## Edit an assignmentAssignmentsApiController#update


### PUT /api/v1/courses/:course_id/assignments/:id


Modify an existing assignment.


#### Request Parameters:

| Parameter |  | Type |  | Description |
| --- | --- | --- | --- | --- |
| assignment[name] |  | string |  | The assignment name. |
| assignment[position] |  | integer |  | The position of this assignment in the group when displaying assignment lists. |
| assignment[submission_types][] |  | string |  | Only applies if the assignment doesnât have student submissions. List of supported submission types for the assignment. Unless the assignment is allowing online submissions, the array should only have one element. If not allowing online submissions, your options are: " online_quiz " " none " " on_paper " " discussion_topic " " external_tool " If you are allowing online submissions, you can have one or many allowed submission types: "online_upload" "online_text_entry" "online_url" "media_recording" (Only valid when the Kaltura plugin is enabled) "student_annotation" Allowed values: online_quiz , none , on_paper , discussion_topic , external_tool , online_upload , online_text_entry , online_url , media_recording , student_annotation |
| assignment[allowed_extensions][] |  | string |  | Allowed extensions if submission_types includes âonline_uploadâ Example: allowed_extensions: ["docx","ppt"] |
| assignment[turnitin_enabled] |  | boolean |  | Only applies when the Turnitin plugin is enabled for a course and the submission_types array includes âonline_uploadâ. Toggles Turnitin submissions for the assignment. Will be ignored if Turnitin is not available for the course. |
| assignment[vericite_enabled] |  | boolean |  | Only applies when the VeriCite plugin is enabled for a course and the submission_types array includes âonline_uploadâ. Toggles VeriCite submissions for the assignment. Will be ignored if VeriCite is not available for the course. |
| assignment[turnitin_settings] |  | string |  | Settings to send along to turnitin. See Assignment object definition for format. |
| assignment[sis_assignment_id] |  | string |  | The sis id of the Assignment |
| assignment[integration_data] |  | string |  | Data used for SIS integrations. Requires admin-level token with the âManage SISâ permission. JSON string required. |
| assignment[integration_id] |  | string |  | Unique ID from third party integrations |
| assignment[peer_reviews] |  | boolean |  | If submission_types does not include external_tool,discussion_topic, online_quiz, or on_paper, determines whether or not peer reviews will be turned on for the assignment. |
| assignment[automatic_peer_reviews] |  | boolean |  | Whether peer reviews will be assigned automatically by Canvas or if teachers must manually assign peer reviews. Does not apply if peer reviews are not enabled. |
| assignment[notify_of_update] |  | boolean |  | If true, Canvas will send a notification to students in the class notifying them that the content has changed. |
| assignment[group_category_id] |  | integer |  | If present, the assignment will become a group assignment assigned to the group. |
| assignment[grade_group_students_individually] |  | integer |  | If this is a group assignment, teachers have the options to grade students individually. If false, Canvas will apply the assignmentâs score to each member of the group. If true, the teacher can manually assign scores to each member of the group. |
| assignment[external_tool_tag_attributes] |  | string |  | Hash of external tool parameters if submission_types is [âexternal_toolâ]. See Assignment object definition for format. |
| assignment[points_possible] |  | number |  | The maximum points possible on the assignment. |
| assignment[grading_type] |  | string |  | The strategy used for grading the assignment. The assignment defaults to âpointsâ if this field is omitted. Allowed values: pass_fail , percent , letter_grade , gpa_scale , points , not_graded |
| assignment[due_at] |  | DateTime |  | The day/time the assignment is due. Accepts times in ISO 8601 format, e.g. 2014-10-21T18:48:00Z. |
| assignment[lock_at] |  | DateTime |  | The day/time the assignment is locked after. Must be after the due date if there is a due date. Accepts times in ISO 8601 format, e.g. 2014-10-21T18:48:00Z. |
| assignment[unlock_at] |  | DateTime |  | The day/time the assignment is unlocked. Must be before the due date if there is a due date. Accepts times in ISO 8601 format, e.g. 2014-10-21T18:48:00Z. |
| assignment[description] |  | string |  | The assignmentâs description, supports HTML. |
| assignment[assignment_group_id] |  | integer |  | The assignment group id to put the assignment in. Defaults to the top assignment group in the course. |
| assignment[assignment_overrides][] |  | AssignmentOverride |  | List of overrides for the assignment. If the assignment[assignment_overrides] key is absent, any existing overrides are kept as is. If the assignment[assignment_overrides] key is present, existing overrides are updated or deleted (and new ones created, as necessary) to match the provided list. |
| assignment[only_visible_to_overrides] |  | boolean |  | Whether this assignment is only visible to overrides (Only useful if âdifferentiated assignmentsâ account setting is on) |
| assignment[published] |  | boolean |  | Whether this assignment is published. (Only useful if âdraft stateâ account setting is on) Unpublished assignments are not visible to students. |
| assignment[grading_standard_id] |  | integer |  | The grading standard id to set for the course.  If no value is provided for this argument the current grading_standard will be un-set from this course. This will update the grading_type for the course to âletter_gradeâ unless it is already âgpa_scaleâ. |
| assignment[omit_from_final_grade] |  | boolean |  | Whether this assignment is counted towards a studentâs final grade. |
| assignment[hide_in_gradebook] |  | boolean |  | Whether this assignment is shown in the gradebook. |
| assignment[moderated_grading] |  | boolean |  | Whether this assignment is moderated. |
| assignment[grader_count] |  | integer |  | The maximum number of provisional graders who may issue grades for this assignment. Only relevant for moderated assignments. Must be a positive value, and must be set to 1 if the course has fewer than two active instructors. Otherwise, the maximum value is the number of active instructors in the course minus one, or 10 if the course has more than 11 active instructors. |
| assignment[final_grader_id] |  | integer |  | The user ID of the grader responsible for choosing final grades for this assignment. Only relevant for moderated assignments. |
| assignment[grader_comments_visible_to_graders] |  | boolean |  | Boolean indicating if provisional gradersâ comments are visible to other provisional graders. Only relevant for moderated assignments. |
| assignment[graders_anonymous_to_graders] |  | boolean |  | Boolean indicating if provisional gradersâ identities are hidden from other provisional graders. Only relevant for moderated assignments. |
| assignment[graders_names_visible_to_final_grader] |  | boolean |  | Boolean indicating if provisional grader identities are visible to the the final grader. Only relevant for moderated assignments. |
| assignment[anonymous_grading] |  | boolean |  | Boolean indicating if the assignment is graded anonymously. If true, graders cannot see student identities. |
| assignment[allowed_attempts] |  | integer |  | The number of submission attempts allowed for this assignment. Set to -1 or null for unlimited attempts. |
| assignment[annotatable_attachment_id] |  | integer |  | The Attachment ID of the document being annotated. Only applies when submission_types includes âstudent_annotationâ. |
| assignment[asset_processors][] |  | Array |  | Document processors for this assignment. New document processors can only be added via the interactive LTI Deep Linking flow (in a browser), not via API token or JWT authentication. Deletion of document processors (passing an empty array) is allowed via API. |
| assignment[force_updated_at] |  | boolean |  | If true, updated_at will be set even if no changes were made. |
| assignment[peer_review][points_possible] |  | number |  | The maximum points possible for peer reviews. |
| assignment[peer_review][grading_type] |  | string |  | The strategy used for grading peer reviews. Defaults to âpointsâ if this field is omitted. Allowed values: pass_fail , percent , letter_grade , gpa_scale , points , not_graded |
| assignment[peer_review][due_at] |  | DateTime |  | The day/time the peer reviews are due. Must be between the lock dates if there are lock dates. Accepts times in ISO 8601 format, e.g. 2025-08-20T12:10:00Z. |
| assignment[peer_review][lock_at] |  | DateTime |  | The day/time the peer reviews are locked after. Must be after the due date if there is a due date. Accepts times in ISO 8601 format, e.g. 2025-08-25T12:10:00Z. |
| assignment[peer_review][unlock_at] |  | DateTime |  | The day/time the peer reviews are unlocked. Must be before the due date if there is a due date. Accepts times in ISO 8601 format, e.g. 2025-08-15T12:10:00Z. |
| assignment[peer_review][peer_review_overrides][] |  | AssignmentOverride |  | List of overrides for the peer reviews. When updating overrides: Include âidâ to update an existing override Omit âidâ to create a new override Omit an override from the list to delete it |
| assignment[submission_types][] |  | string | [DEPRECATED] Effective 2021-05-26 (notice given 2021-02-18) | Only applies if the assignment doesnât have student submissions. |


---

## Bulk update assignment datesAssignmentsApiController#bulk_update


### PUT /api/v1/courses/:course_id/assignments/bulk_update


Update due dates and availability dates for multiple assignments in a course.


Accepts a JSON array of objects containing two keys each: id , the assignment id, and all_dates , an array of AssignmentDate structures containing the base and/or override dates for the assignment, as returned from the List assignments endpoint with include[]=all_dates .


This endpoint cannot create or destroy assignment overrides; any existing assignment overrides that are not referenced in the arguments will be left alone. If an override is given, any dates that are not supplied with it will be defaulted. To clear a date, specify null explicitly.


All referenced assignments will be validated before any are saved. A list of errors will be returned if any provided dates are invalid, and no changes will be saved.


The bulk update is performed in a background job, use the Progress API to check its status.


#### Example Request:


```
curl 'https://<canvas>/api/v1/courses/1/assignments/bulk_update' \
     -X PUT \
     --data '[{
           "id": 1,
           "all_dates": [{
             "base": true,
             "due_at": "2020-08-29T23:59:00-06:00"
           }, {
             "id": 2,
             "due_at": "2020-08-30T23:59:00-06:00"
           }]
         }]' \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <token>"
```
