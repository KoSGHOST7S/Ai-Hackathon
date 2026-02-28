# Accounts

> Canvas API — Accounts & Admin  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List accountsAccountsController#index


### GET /api/v1/accounts


A paginated list of accounts that the current user can view or manage. Typically, students and even teachers will get an empty list in response, only account admins can view the accounts that they are in.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| include[] |  | string | Array of additional information to include. âlti_guidâ the âtool_consumer_instance_guidâ that will be sent for this account on LTI launches âregistration_settingsâ returns info about the privacy policy and terms of use âservicesâ returns services and whether they are enabled (requires account management permissions) âcourse_countâ returns the number of courses directly under each account âsub_account_countâ returns the number of sub-accounts directly under each account Allowed values: lti_guid , registration_settings , services , course_count , sub_account_count |


---

## Get accounts that admins can manageAccountsController#manageable_accounts


### GET /api/v1/manageable_accounts


A paginated list of accounts where the current user has permission to create or manage courses. List will be empty for students and teachers as only admins can view which accounts they are in.


---

## Get accounts that users can create courses inAccountsController#course_creation_accounts


### GET /api/v1/course_creation_accounts


A paginated list of accounts where the current user has permission to create courses.


---

## List accounts for course adminsAccountsController#course_accounts


### GET /api/v1/course_accounts


A paginated list of accounts that the current user can view through their admin course enrollments. (Teacher, TA, or designer enrollments). Only returns âidâ, ânameâ, âworkflow_stateâ, âroot_account_idâ and âparent_account_idâ


---

## Get a single accountAccountsController#show


### GET /api/v1/accounts/:id


Retrieve information on an individual account, given by id or sis sis_account_id.


---

## SettingsAccountsController#show_settings


### GET /api/v1/accounts/:account_id/settings


Returns a JSON object containing a subset of settings for the specified account. Itâs possible an empty set will be returned if no settings are applicable. The caller must be an Account admin with the manage_account_settings permission.


#### Example Request:


```
curl https://<canvas>/api/v1/accounts/<account_id>/settings \
  -H 'Authorization: Bearer <token>'
```


#### Example Response:


```
{"microsoft_sync_enabled": true, "microsoft_sync_login_attribute_suffix": false}
```


---

## List environment settingsAccountsController#environment


### GET /api/v1/settings/environment


Return a hash of global settings for the root account This is the same information supplied to the web interface as ENV.SETTINGS .


#### Example Request:


```
curl 'http://<canvas>/api/v1/settings/environment' \
  -H "Authorization: Bearer <token>"
```


#### Example Response:


```
{ "calendar_contexts_limit": 10, "open_registration": false, ...}
```


---

## PermissionsAccountsController#permissions


### GET /api/v1/accounts/:account_id/permissions


Returns permission information for the calling user and the given account. You may use self as the account id to check permissions against the domain root account. The caller must have an account role or admin (teacher/TA/designer) enrollment in a course in the account.


See also the Course and Group counterparts.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| permissions[] |  | string | List of permissions to check against the authenticated user. Permission names are documented in the List assignable permissions endpoint. |


#### Example Request:


```
curl https://<canvas>/api/v1/accounts/self/permissions \
  -H 'Authorization: Bearer <token>' \
  -d 'permissions[]=manage_account_memberships' \
  -d 'permissions[]=become_user'
```


#### Example Response:


```
{'manage_account_memberships': 'false', 'become_user': 'true'}
```


---

## Get the sub-accounts of an accountAccountsController#sub_accounts


### GET /api/v1/accounts/:account_id/sub_accounts


List accounts that are sub-accounts of the given account.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| recursive |  | boolean | If true, the entire account tree underneath this account will be returned (though still paginated). If false, only direct sub-accounts of this account will be returned. Defaults to false. |
| order |  | string | Sorts the accounts by id or name. Only applies when recursive is false. Defaults to id. Allowed values: id , name |
| include[] |  | string | Array of additional information to include. âcourse_countâ returns the number of courses directly under each account âsub_account_countâ returns the number of sub-accounts directly under each account Allowed values: course_count , sub_account_count |


#### Example Request:


```
curl https://<canvas>/api/v1/accounts/<account_id>/sub_accounts \
     -H 'Authorization: Bearer <token>'
```


---

## Get the Terms of ServiceAccountsController#terms_of_service


### GET /api/v1/accounts/:account_id/terms_of_service


Returns the terms of service for that account


---

## Get help linksAccountsController#help_links


### GET /api/v1/accounts/:account_id/help_links


Returns the help links for that account


---

## Get the manually-created courses sub-account for the domain root accountAccountsController#manually_created_courses_account


### GET /api/v1/manually_created_courses_account


Returns the sub-account that contains manually created courses for the domain root account.


---

## List active courses in an accountAccountsController#courses_api


### GET /api/v1/accounts/:account_id/courses


Retrieve a paginated list of courses in this account.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| with_enrollments |  | boolean | If true, include only courses with at least one enrollment.  If false, include only courses with no enrollments.  If not present, do not filter on course enrollment status. |
| enrollment_type[] |  | string | If set, only return courses that have at least one user enrolled in in the course with one of the specified enrollment types. Allowed values: teacher , student , ta , observer , designer |
| enrollment_workflow_state[] |  | string | If set, only return courses that have at least one user enrolled in in the course with one of the specified enrollment workflow states. Allowed values: active , completed , deleted , invited , pending , creation_pending , rejected , inactive |
| published |  | boolean | If true, include only published courses.  If false, exclude published courses.  If not present, do not filter on published status. |
| completed |  | boolean | If true, include only completed courses (these may be in state âcompletedâ, or their enrollment term may have ended).  If false, exclude completed courses.  If not present, do not filter on completed status. |
| blueprint |  | boolean | If true, include only blueprint courses. If false, exclude them. If not present, do not filter on this basis. |
| blueprint_associated |  | boolean | If true, include only courses that inherit content from a blueprint course. If false, exclude them. If not present, do not filter on this basis. |
| public |  | boolean | If true, include only public courses. If false, exclude them. If not present, do not filter on this basis. |
| by_teachers[] |  | integer | List of User IDs of teachers; if supplied, include only courses taught by one of the referenced users. |
| by_subaccounts[] |  | integer | List of Account IDs; if supplied, include only courses associated with one of the referenced subaccounts. |
| hide_enrollmentless_courses |  | boolean | If present, only return courses that have at least one enrollment. Equivalent to âwith_enrollments=trueâ; retained for compatibility. |
| state[] |  | string | If set, only return courses that are in the given state(s). By default, all states but âdeletedâ are returned. Allowed values: created , claimed , available , completed , deleted , all |
| enrollment_term_id |  | integer | If set, only includes courses from the specified term. |
| search_term |  | string | The partial course name, code, or full ID to match and return in the results list. Must be at least 3 characters. |
| include[] |  | string | All explanations can be seen in the Course API index documentation âsectionsâ, âneeds_grading_countâ and âtotal_scoresâ are not valid options at the account level Allowed values: syllabus_body , term , course_progress , storage_quota_used_mb , total_students , teachers , account_name , concluded , post_manually |
| sort |  | string | The column to sort results by. Allowed values: course_status , course_name , sis_course_id , teacher , account_name |
| order |  | string | The order to sort the given column by. Allowed values: asc , desc |
| search_by |  | string | The filter to search by. âcourseâ searches for course names, course codes, and SIS IDs. âteacherâ searches for teacher names Allowed values: course , teacher |
| starts_before |  | Date | If set, only return courses that start before the value (inclusive) or their enrollment term starts before the value (inclusive) or both the courseâs start_at and the enrollment termâs start_at are set to null. The value should be formatted as: yyyy-mm-dd or ISO 8601 YYYY-MM-DDTHH:MM:SSZ. |
| ends_after |  | Date | If set, only return courses that end after the value (inclusive) or their enrollment term ends after the value (inclusive) or both the courseâs end_at and the enrollment termâs end_at are set to null. The value should be formatted as: yyyy-mm-dd or ISO 8601 YYYY-MM-DDTHH:MM:SSZ. |
| homeroom |  | boolean | If set, only return homeroom courses. |


---

## Update an accountAccountsController#update


### PUT /api/v1/accounts/:id


Update an existing account.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| account[name] |  | string | Updates the account name |
| account[sis_account_id] |  | string | Updates the account sis_account_id Must have manage_sis permission and must not be a root_account. |
| account[default_time_zone] |  | string | The default time zone of the account. Allowed time zones are IANA time zones or friendlier Ruby on Rails time zones . |
| account[default_storage_quota_mb] |  | integer | The default course storage quota to be used, if not otherwise specified. |
| account[default_user_storage_quota_mb] |  | integer | The default user storage quota to be used, if not otherwise specified. |
| account[default_group_storage_quota_mb] |  | integer | The default group storage quota to be used, if not otherwise specified. |
| account[course_template_id] |  | integer | The ID of a course to be used as a template for all newly created courses. Empty means to inherit the setting from parent account, 0 means to not use a template even if a parent account has one set. The course must be marked as a template. |
| account[parent_account_id] |  | integer | The ID of a parent account to move the account to. The new parent account must be in the same root account as the original. The hierarchy of sub-accounts will be preserved in the new parent account. The caller must be an administrator in both the original parent account and the new parent account. |
| account[settings][restrict_student_past_view][value] |  | boolean | Restrict students from viewing courses after end date |
| account[settings][restrict_student_past_view][locked] |  | boolean | Lock this setting for sub-accounts and courses |
| account[settings][restrict_student_future_view][value] |  | boolean | Restrict students from viewing courses before start date |
| account[settings][microsoft_sync_enabled] |  | boolean | Determines whether this account has Microsoft Teams Sync enabled or not. Note that if you are altering Microsoft Teams sync settings you must enable the Microsoft Group enrollment syncing feature flag. In addition, if you are enabling Microsoft Teams sync, you must also specify a tenant, login attribute, and a remote attribute. Specifying a suffix to use is optional. |
| account[settings][microsoft_sync_tenant] |  | string | The tenant this account should use when using Microsoft Teams Sync. This should be an Azure Active Directory domain name. |
| account[settings][microsoft_sync_login_attribute] |  | string | The attribute this account should use to lookup users when using Microsoft Teams Sync. Must be one of âsubâ, âemailâ, âoidâ, âpreferred_usernameâ, or âintegration_idâ. |
| account[settings][microsoft_sync_login_attribute_suffix] |  | string | A suffix that will be appended to the result of the login attribute when associating Canvas users with Microsoft users. Must be under 255 characters and contain no whitespace. This field is optional. |
| account[settings][microsoft_sync_remote_attribute] |  | string | The Active Directory attribute to use when associating Canvas users with Microsoft users. Must be one of âmailâ, âmailNicknameâ, or âuserPrincipalNameâ. |
| account[settings][restrict_student_future_view][locked] |  | boolean | Lock this setting for sub-accounts and courses |
| account[settings][lock_all_announcements][value] |  | boolean | Disable comments on announcements |
| account[settings][lock_all_announcements][locked] |  | boolean | Lock this setting for sub-accounts and courses |
| account[settings][usage_rights_required][value] |  | boolean | Copyright and license information must be provided for files before they are published. |
| account[settings][usage_rights_required][locked] |  | boolean | Lock this setting for sub-accounts and courses |
| account[settings][restrict_student_future_listing][value] |  | boolean | Restrict students from viewing future enrollments in course list |
| account[settings][restrict_student_future_listing][locked] |  | boolean | Lock this setting for sub-accounts and courses |
| account[settings][conditional_release][value] |  | boolean | Enable or disable individual learning paths for students based on assessment |
| account[settings][conditional_release][locked] |  | boolean | Lock this setting for sub-accounts and courses |
| account[settings][enable_course_paces][value] |  | boolean | Enable or disable course pacing |
| account[settings][enable_course_paces][locked] |  | boolean | Lock this setting for sub-accounts and courses |
| account[settings][password_policy] |  | Hash | Hash of optional password policy configuration parameters for a root account allow_login_suspension boolean Allow suspension of user logins upon reaching maximum_login_attempts require_number_characters boolean Require the use of number characters when setting up a new password require_symbol_characters boolean Require the use of symbol characters when setting up a new password minimum_character_length integer Minimum number of characters required for a new password maximum_login_attempts integer Maximum number of login attempts before a user is locked out Required feature option: Enhance password options |
| account[settings][enable_as_k5_account][value] |  | boolean | Enable or disable Canvas for Elementary for this account |
| account[settings][use_classic_font_in_k5][value] |  | boolean | Whether or not the classic font is used on the dashboard. Only applies if enable_as_k5_account is true. |
| account[settings][horizon_account][value] |  | boolean | Enable or disable Canvas Career for this account |
| override_sis_stickiness |  | boolean | Default is true. If false, any fields containing âstickyâ changes will not be updated. See SIS CSV Format documentation for information on which fields can have SIS stickiness |
| account[settings][lock_outcome_proficiency][value] |  | boolean | DEPRECATED Restrict instructors from changing mastery scale |
| account[lock_outcome_proficiency][locked] |  | boolean | DEPRECATED Lock this setting for sub-accounts and courses |
| account[settings][lock_proficiency_calculation][value] |  | boolean | DEPRECATED Restrict instructors from changing proficiency calculation method |
| account[lock_proficiency_calculation][locked] |  | boolean | DEPRECATED Lock this setting for sub-accounts and courses |
| account[services] |  | Hash | Give this a set of keys and boolean values to enable or disable services matching the keys |


#### Example Request:


```
curl https://<canvas>/api/v1/accounts/<account_id> \
  -X PUT \
  -H 'Authorization: Bearer <token>' \
  -d 'account[name]=New account name' \
  -d 'account[default_time_zone]=Mountain Time (US & Canada)' \
  -d 'account[default_storage_quota_mb]=450'
```


---

## Delete a user from the root accountAccountsController#remove_user


### DELETE /api/v1/accounts/:account_id/users/:user_id


Delete a user record from a Canvas root account. If a user is associated with multiple root accounts (in a multi-tenant instance of Canvas), this action will NOT remove them from the other accounts.


WARNING: This API will allow a user to remove themselves from the account. If they do this, they wonât be able to make API calls or log into Canvas at that account.


#### Example Request:


```
curl https://<canvas>/api/v1/accounts/3/users/5 \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -X DELETE
```


---

## Delete multiple users from the root accountAccountsController#remove_users


### DELETE /api/v1/accounts/:account_id/users


Delete multiple users from a Canvas root account. If a user is associated with multiple root accounts (in a multi-tenant instance of Canvas), this action will NOT remove them from the other accounts.


WARNING: This API will allow a user to remove themselves from the account. If they do this, they wonât be able to make API calls or log into Canvas at that account.


#### Example Request:


```
curl https://<canvas>/api/v1/accounts/3/users \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -X DELETE
  -d 'user_ids[]=1' \
  -d 'user_ids[]=2'
```


---

## Update multiple usersAccountsController#update_users


### PUT /api/v1/accounts/:account_id/users/bulk_update


Updates multiple users in bulk.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| user_ids |  | string | Array<Integer> The IDs of the users to update. |
| user |  | Hash | The attributes to update for each user. |


#### Example Request:


```
curl https://<canvas>/api/v1/accounts/3/users/bulk_update \
  -X PUT \
  -H 'Authorization: Bearer <token>' \
  -d 'user_ids[]=1' \
  -d 'user_ids[]=2' \
  -d 'user[event]=suspend'
```


---

## Restore a deleted user from a root accountAccountsController#restore_user


### PUT /api/v1/accounts/:account_id/users/:user_id/restore


Restore a user record along with the most recently deleted pseudonym from a Canvas root account.


#### Example Request:


```
curl https://<canvas>/api/v1/accounts/3/users/5/restore \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -X PUT
```
