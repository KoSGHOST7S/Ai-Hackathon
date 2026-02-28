# Assignment Groups

> Canvas API — Assignments & Grades  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List assignment groupsAssignmentGroupsController#index


### GET /api/v1/courses/:course_id/assignment_groups


Returns the paginated list of assignment groups for the current context. The returned groups are sorted by their position field.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| include[] |  | string | Associations to include with the group. âdiscussion_topicâ, âall_datesâ, âcan_editâ, âassignment_visibilityâ & âsubmissionâ are only valid if âassignmentsâ is also included. âscore_statisticsâ requires that the âassignmentsâ and âsubmissionâ options are included. The âassignment_visibilityâ option additionally requires that the Differentiated Assignments course feature be turned on. If âobserved_usersâ is passed along with âassignmentsâ and âsubmissionâ, submissions for observed users will also be included as an array. The âpeer_reviewâ option requires that the Peer Review Grading course feature be turned on and that âassignmentsâ is included. Allowed values: assignments , discussion_topic , all_dates , assignment_visibility , overrides , submission , observed_users , can_edit , score_statistics , peer_review |
| assignment_ids[] |  | string | If âassignmentsâ are included, optionally return only assignments having their ID in this array. This argument may also be passed as a comma separated string. |
| exclude_assignment_submission_types[] |  | string | If âassignmentsâ are included, those with the specified submission types will be excluded from the assignment groups. Allowed values: online_quiz , discussion_topic , wiki_page , external_tool |
| override_assignment_dates |  | boolean | Apply assignment overrides for each assignment, defaults to true. |
| grading_period_id |  | integer | The id of the grading period in which assignment groups are being requested (Requires grading periods to exist.) |
| scope_assignments_to_student |  | boolean | If true, all assignments returned will apply to the current user in the specified grading period. If assignments apply to other students in the specified grading period, but not the current user, they will not be returned. (Requires the grading_period_id argument and grading periods to exist. In addition, the current user must be a student.) |


---

## Get an Assignment GroupAssignmentGroupsApiController#show


### GET /api/v1/courses/:course_id/assignment_groups/:assignment_group_id


Returns the assignment group with the given id.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| include[] |  | string | Associations to include with the group. âdiscussion_topicâ and âassignment_visibilityâ and âsubmissionâ are only valid if âassignmentsâ is also included. âscore_statisticsâ is only valid if âsubmissionâ and âassignmentsâ are also included. The âassignment_visibilityâ option additionally requires that the Differentiated Assignments course feature be turned on. Allowed values: assignments , discussion_topic , assignment_visibility , submission , score_statistics |
| override_assignment_dates |  | boolean | Apply assignment overrides for each assignment, defaults to true. |
| grading_period_id |  | integer | The id of the grading period in which assignment groups are being requested (Requires grading periods to exist on the account) |


---

## Create an Assignment GroupAssignmentGroupsApiController#create


### POST /api/v1/courses/:course_id/assignment_groups


Create a new assignment group for this course.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| name |  | string | The assignment groupâs name |
| position |  | integer | The position of this assignment group in relation to the other assignment groups |
| group_weight |  | number | The percent of the total grade that this assignment group represents |
| sis_source_id |  | string | The sis source id of the Assignment Group |
| integration_data |  | Object | The integration data of the Assignment Group |


---

## Edit an Assignment GroupAssignmentGroupsApiController#update


### PUT /api/v1/courses/:course_id/assignment_groups/:assignment_group_id


Modify an existing Assignment Group.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| name |  | string | The assignment groupâs name |
| position |  | integer | The position of this assignment group in relation to the other assignment groups |
| group_weight |  | number | The percent of the total grade that this assignment group represents |
| sis_source_id |  | string | The sis source id of the Assignment Group |
| integration_data |  | Object | The integration data of the Assignment Group |
| rules |  | string | The grading rules that are applied within this assignment group See the Assignment Group object definition for format |


---

## Destroy an Assignment GroupAssignmentGroupsApiController#destroy


### DELETE /api/v1/courses/:course_id/assignment_groups/:assignment_group_id


Deletes the assignment group with the given id.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| move_assignments_to |  | integer | The ID of an active Assignment Group to which the assignments that are currently assigned to the destroyed Assignment Group will be assigned. NOTE: If this argument is not provided, any assignments in this Assignment Group will be deleted. |
