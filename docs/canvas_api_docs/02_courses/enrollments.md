# Enrollments

> Canvas API — Courses  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List enrollmentsEnrollmentsApiController#index


### GET /api/v1/courses/:course_id/enrollments


### GET /api/v1/sections/:section_id/enrollments


### GET /api/v1/users/:user_id/enrollments


Depending on the URL given, return a paginated list of either (1) all of the enrollments in a course, (2) all of the enrollments in a section or (3) all of a userâs enrollments. This includes student, teacher, TA, and observer enrollments.


If a user has multiple enrollments in a context (e.g. as a teacher and a student or in multiple course sections), each enrollment will be listed separately.


note: Currently, only a root level admin user can return other usersâ enrollments. A user can, however, return his/her own enrollments.


Enrollments scoped to a course context will include inactive states by default if the caller has account admin authorization and the state[] parameter is omitted.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| type[] |  | string | A list of enrollment types to return. Accepted values are âStudentEnrollmentâ, âTeacherEnrollmentâ, âTaEnrollmentâ, âDesignerEnrollmentâ, and âObserverEnrollment.â If omitted, all enrollment types are returned. This argument is ignored if role is given. |
| role[] |  | string | A list of enrollment roles to return. Accepted values include course-level roles created by the Add Role API as well as the base enrollment types accepted by the type argument above. |
| state[] |  | string | Filter by enrollment state. If omitted, âactiveâ and âinvitedâ enrollments are returned. The following synthetic states are supported only when querying a userâs enrollments (either via user_id argument or via user enrollments endpoint): current_and_invited , current_and_future , current_future_and_restricted , current_and_concluded Allowed values: active , invited , creation_pending , deleted , rejected , completed , inactive , current_and_invited , current_and_future , current_future_and_restricted , current_and_concluded |
| include[] |  | string | Array of additional information to include on the enrollment or user records. âavatar_urlâ and âgroup_idsâ will be returned on the user record. If âcurrent_pointsâ is specified, the fields âcurrent_pointsâ and (if the caller has permissions to manage grades) âunposted_current_pointsâ will be included in the âgradesâ hash for student enrollments. Allowed values: avatar_url , group_ids , locked , observed_users , can_be_removed , uuid , current_points |
| user_id |  | string | Filter by user_id (only valid for course or section enrollment queries). If set to the current userâs id, this is a way to determine if the user has any enrollments in the course or section, independent of whether the user has permission to view other people on the roster. |
| grading_period_id |  | integer | Return grades for the given grading_period.  If this parameter is not specified, the returned grades will be for the whole course. |
| enrollment_term_id |  | integer | Returns only enrollments for the specified enrollment term. This parameter only applies to the user enrollments path. May pass the ID from the enrollment terms api or the SIS id prepended with âsis_term_id:â. |
| sis_account_id[] |  | string | Returns only enrollments for the specified SIS account ID(s). Does not look into sub_accounts. May pass in array or string. |
| sis_course_id[] |  | string | Returns only enrollments matching the specified SIS course ID(s). May pass in array or string. |
| sis_section_id[] |  | string | Returns only section enrollments matching the specified SIS section ID(s). May pass in array or string. |
| sis_user_id[] |  | string | Returns only enrollments for the specified SIS user ID(s). May pass in array or string. |
| created_for_sis_id[] |  | boolean | If sis_user_id is present and created_for_sis_id is true, Returns only enrollments for the specified SIS ID(s). If a user has two sis_idâs, one enrollment may be created using one of the two ids. This would limit the enrollments returned from the endpoint to enrollments that were created from a sis_import with that sis_user_id |


---

## Enrollment by IDEnrollmentsApiController#show


### GET /api/v1/accounts/:account_id/enrollments/:id


Get an Enrollment object by Enrollment ID


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| id | Required | integer | The ID of the enrollment object |


---

## Enroll a userEnrollmentsApiController#create


### POST /api/v1/courses/:course_id/enrollments


### POST /api/v1/sections/:section_id/enrollments


Create a new user enrollment for a course or section.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| enrollment[start_at] |  | DateTime | The start time of the enrollment, in ISO8601 format. e.g. 2012-04-18T23:08:51Z |
| enrollment[end_at] |  | DateTime | The end time of the enrollment, in ISO8601 format. e.g. 2012-04-18T23:08:51Z |
| enrollment[user_id] | Required | string | The ID of the user to be enrolled in the course. |
| enrollment[type] | Required | string | Enroll the user as a student, teacher, TA, observer, or designer. If no value is given, the type will be inferred by enrollment[role] if supplied, otherwise âStudentEnrollmentâ will be used. Allowed values: StudentEnrollment , TeacherEnrollment , TaEnrollment , ObserverEnrollment , DesignerEnrollment |
| enrollment[role] |  | Deprecated | Assigns a custom course-level role to the user. |
| enrollment[role_id] |  | integer | Assigns a custom course-level role to the user. |
| enrollment[enrollment_state] |  | string | If set to âactive,â student will be immediately enrolled in the course. Otherwise they will be required to accept a course invitation. Default is âinvited.â. If set to âinactiveâ, student will be listed in the course roster for teachers, but will not be able to participate in the course until their enrollment is activated. Allowed values: active , invited , inactive |
| enrollment[course_section_id] |  | integer | The ID of the course section to enroll the student in. If the section-specific URL is used, this argument is redundant and will be ignored. |
| enrollment[limit_privileges_to_course_section] |  | boolean | If set, the enrollment will only allow the user to see and interact with users enrolled in the section given by course_section_id. For teachers and TAs, this includes grading privileges. Section-limited students will not see any users (including teachers and TAs) not enrolled in their sections. Users may have other enrollments that grant privileges to multiple sections in the same course. |
| enrollment[notify] |  | boolean | If true, a notification will be sent to the enrolled user. Notifications are not sent by default. |
| enrollment[self_enrollment_code] |  | string | If the current user is not allowed to manage enrollments in this course, but the course allows self-enrollment, the user can self- enroll as a student in the default section by passing in a valid code. When self-enrolling, the user_id must be âselfâ. The enrollment_state will be set to âactiveâ and all other arguments will be ignored. |
| enrollment[self_enrolled] |  | boolean | If true, marks the enrollment as a self-enrollment, which gives students the ability to drop the course if desired. Defaults to false. |
| enrollment[associated_user_id] |  | integer | For an observer enrollment, the ID of a student to observe. This is a one-off operation; to automatically observe all a studentâs enrollments (for example, as a parent), please use the User Observees API . |
| enrollment[sis_user_id] |  | string | Required if the user is being enrolled from another trusted account. The unique identifier for the user (sis_user_id) must also be accompanied by the root_account parameter. The user_id will be ignored. |
| enrollment[integration_id] |  | string | Required if the user is being enrolled from another trusted account. The unique identifier for the user (integration_id) must also be accompanied by the root_account parameter. The user_id will be ignored. |
| root_account |  | string | The domain of the account to search for the user. Will be a no-op unless the sis_user_id or integration_id parameter is also included. |


#### Example Request:


```
curl https://<canvas>/api/v1/courses/:course_id/enrollments \
  -X POST \
  -F 'enrollment[user_id]=1' \
  -F 'enrollment[type]=StudentEnrollment' \
  -F 'enrollment[enrollment_state]=active' \
  -F 'enrollment[course_section_id]=1' \
  -F 'enrollment[limit_privileges_to_course_section]=true' \
  -F 'enrollment[notify]=false'
```


```
curl https://<canvas>/api/v1/courses/:course_id/enrollments \
  -X POST \
  -F 'enrollment[user_id]=2' \
  -F 'enrollment[type]=StudentEnrollment'
```


---

## Enroll multiple users to one or more coursesEnrollmentsApiController#bulk_enrollment


### POST /api/v1/accounts/:account_id/bulk_enrollment


Enrolls multiple users in one or more courses in a single operation.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| user_ids[] | Required | integer | The user IDs to enroll in the courses. |
| course_ids[] | Required | integer | The course IDs to enroll each user in. |
| enrollment_type |  | string | Enroll each user as a student, teacher, TA, observer, or designer. If no value is given, the type will be âStudentEnrollmentâ. Allowed values: StudentEnrollment , TeacherEnrollment , TaEnrollment , ObserverEnrollment , DesignerEnrollment |
| enrollment_role_id |  | integer | Optional custom course-level role id to apply to created enrollments. |


#### Example Request:


```
curl https://<canvas>/api/v1/accounts/:account_id/bulk_enrollment \
  -X POST \
  -F 'user_ids[]=1' \
  -F 'user_ids[]=2' \
  -F 'course_ids[]=10' \
  -F 'course_ids[]=11' \
```


```
curl https://<canvas>/api/v1/accounts/:account_id/bulk_enrollment \
  -X POST \
  -F 'user_ids[]=1' \
  -F 'course_ids[]=10' \
  -F 'course_ids[]=11' \
  -F 'course_ids[]=12' \
  -F 'enrollment_type=TeacherEnrollment' \
```


---

## Conclude, deactivate, or delete an enrollmentEnrollmentsApiController#destroy


### DELETE /api/v1/courses/:course_id/enrollments/:id


Conclude, deactivate, or delete an enrollment. If the task argument isnât given, the enrollment will be concluded.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| task |  | string | The action to take on the enrollment. When inactive, a user will still appear in the course roster to admins, but be unable to participate. (âinactivateâ and âdeactivateâ are equivalent tasks) Allowed values: conclude , delete , inactivate , deactivate |


#### Example Request:


```
curl https://<canvas>/api/v1/courses/:course_id/enrollments/:enrollment_id \
  -X DELETE \
  -F 'task=conclude'
```


---

## Accept Course InvitationEnrollmentsApiController#accept


### POST /api/v1/courses/:course_id/enrollments/:id/accept


accepts a pending course invitation for the current user


#### Example Request:


```
curl https://<canvas>/api/v1/courses/<course_id>/enrollments/:id/accept \
  -X POST \
  -H 'Authorization: Bearer <token>'
```


#### Example Response:


```
{
  "success": true
}
```


---

## Reject Course InvitationEnrollmentsApiController#reject


### POST /api/v1/courses/:course_id/enrollments/:id/reject


rejects a pending course invitation for the current user


#### Example Request:


```
curl https://<canvas>/api/v1/courses/<course_id>/enrollments/:id/reject \
  -X POST \
  -H 'Authorization: Bearer <token>'
```


#### Example Response:


```
{
  "success": true
}
```


---

## Re-activate an enrollmentEnrollmentsApiController#reactivate


### PUT /api/v1/courses/:course_id/enrollments/:id/reactivate


Activates an inactive enrollment


#### Example Request:


```
curl https://<canvas>/api/v1/courses/:course_id/enrollments/:enrollment_id/reactivate \
  -X PUT
```


---

## Add last attended dateEnrollmentsApiController#last_attended


### PUT /api/v1/courses/:course_id/users/:user_id/last_attended


Add last attended date to student enrollment in course


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| date |  | Date | The last attended date of a student enrollment in a course. |


#### Example Request:


```
curl https://<canvas>/api/v1/courses/:course_id/user/:user_id/last_attended"
  -X PUT => date="Thu%20Dec%2021%202017%2000:00:00%20GMT-0700%20(MST)
```


---

## Show Temporary Enrollment recipient and provider statusEnrollmentsApiController#show_temporary_enrollment_status


### BETA: This API endpoint is not finalized, and there could be breaking changes before its final release.


### GET /api/v1/users/:user_id/temporary_enrollment_status


Returns a JSON Object containing the temporary enrollment status for a user.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| account_id |  | string | The ID of the account to check for temporary enrollment status. Defaults to the domain root account if not provided. |


#### Example Response:


```
{
  "is_provider": false, "is_recipient": true, "can_provide": false
}
```
