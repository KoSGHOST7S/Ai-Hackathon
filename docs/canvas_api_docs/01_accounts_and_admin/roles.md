# Roles

> Canvas API — Accounts & Admin  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List rolesRoleOverridesController#api_index


### GET /api/v1/accounts/:account_id/roles


A paginated list of the roles available to an account.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| account_id | Required | string | The id of the account to retrieve roles for. |
| state[] |  | string | Filter by role state. If this argument is omitted, only âactiveâ roles are returned. Allowed values: active , inactive |
| show_inherited |  | boolean | If this argument is true, all roles inherited from parent accounts will be included. |


---

## Get a single roleRoleOverridesController#show


### GET /api/v1/accounts/:account_id/roles/:id


Retrieve information about a single role


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| account_id | Required | string | The id of the account containing the role |
| role_id | Required | integer | The unique identifier for the role |
| role |  | string | The name for the role |


---

## Create a new roleRoleOverridesController#add_role


### POST /api/v1/accounts/:account_id/roles


Create a new course-level or account-level role.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| label | Required | string | Label for the role. |
| role |  | string | Deprecated alias for label. |
| base_role_type |  | string | Specifies the role type that will be used as a base for the permissions granted to this role. Defaults to âAccountMembershipâ if absent Allowed values: AccountMembership , StudentEnrollment , TeacherEnrollment , TaEnrollment , ObserverEnrollment , DesignerEnrollment |
| permissions[<X>][explicit] |  | boolean | no description |
| permissions[<X>][enabled] |  | boolean | If explicit is 1 and enabled is 1, permission <X> will be explicitly granted to this role. If explicit is 1 and enabled has any other value (typically 0), permission <X> will be explicitly denied to this role. If explicit is any other value (typically 0) or absent, or if enabled is absent, the value for permission <X> will be inherited from upstream. Ignored if permission <X> is locked upstream (in an ancestor account). May occur multiple times with unique values for <X>. Recognized permission names for <X> can be found on the Permissions list page . Some of these permissions are applicable only for roles on the site admin account, on a root account, or for course-level roles with a particular base role type; if a specified permission is inapplicable, it will be ignored. Additional permissions may exist based on installed plugins. A comprehensive list of all permissions are available: Course Permissions PDF: bit.ly/cnvs-course-permissions Account Permissions PDF: bit.ly/cnvs-acct-permissions |
| permissions[<X>][locked] |  | boolean | If the value is 1, permission <X> will be locked downstream (new roles in subaccounts cannot override the setting). For any other value, permission <X> is left unlocked. Ignored if permission <X> is already locked upstream. May occur multiple times with unique values for <X>. |
| permissions[<X>][applies_to_self] |  | boolean | If the value is 1, permission <X> applies to the account this role is in. The default value is 1. Must be true if applies_to_descendants is false. This value is only returned if enabled is true. |
| permissions[<X>][applies_to_descendants] |  | boolean | If the value is 1, permission <X> cascades down to sub accounts of the account this role is in. The default value is 1.  Must be true if applies_to_self is false.This value is only returned if enabled is true. |


#### Example Request:


```
curl 'https://<canvas>/api/v1/accounts/<account_id>/roles.json' \
     -H "Authorization: Bearer <token>" \
     -F 'label=New Role' \
     -F 'permissions[read_course_content][explicit]=1' \
     -F 'permissions[read_course_content][enabled]=1' \
     -F 'permissions[read_course_list][locked]=1' \
     -F 'permissions[read_question_banks][explicit]=1' \
     -F 'permissions[read_question_banks][enabled]=0' \
     -F 'permissions[read_question_banks][locked]=1'
```


---

## Deactivate a roleRoleOverridesController#remove_role


### DELETE /api/v1/accounts/:account_id/roles/:id


Deactivates a custom role.  This hides it in the user interface and prevents it from being assigned to new users.  Existing users assigned to the role will continue to function with the same permissions they had previously. Built-in roles cannot be deactivated.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| role_id | Required | integer | The unique identifier for the role |
| role |  | string | The name for the role |


---

## Activate a roleRoleOverridesController#activate_role


### POST /api/v1/accounts/:account_id/roles/:id/activate


Re-activates an inactive role (allowing it to be assigned to new users)


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| role_id | Required | integer | The unique identifier for the role |
| role |  | Deprecated | The name for the role |


---

## Update a roleRoleOverridesController#update


### PUT /api/v1/accounts/:account_id/roles/:id


Update permissions for an existing role.


Recognized roles are:

- TeacherEnrollment
- StudentEnrollment
- TaEnrollment
- ObserverEnrollment
- DesignerEnrollment
- AccountAdmin
- Any previously created custom role


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| label |  | string | The label for the role. Can only change the label of a custom role that belongs directly to the account. |
| permissions[<X>][explicit] |  | boolean | no description |
| permissions[<X>][enabled] |  | boolean | These arguments are described in the documentation for the add_role method . The list of available permissions can be found on the Permissions list page . |
| permissions[<X>][applies_to_self] |  | boolean | If the value is 1, permission <X> applies to the account this role is in. The default value is 1. Must be true if applies_to_descendants is false. This value is only returned if enabled is true. |
| permissions[<X>][applies_to_descendants] |  | boolean | If the value is 1, permission <X> cascades down to sub accounts of the account this role is in. The default value is 1.  Must be true if applies_to_self is false.This value is only returned if enabled is true. |


#### Example Request:


```
curl https://<canvas>/api/v1/accounts/:account_id/roles/2 \
  -X PUT \
  -H 'Authorization: Bearer <access_token>' \
  -F 'label=New Role Name' \
  -F 'permissions[manage_groups][explicit]=1' \
  -F 'permissions[manage_groups][enabled]=1' \
  -F 'permissions[manage_groups][locked]=1' \
  -F 'permissions[send_messages][explicit]=1' \
  -F 'permissions[send_messages][enabled]=0'
```


---

## List assignable permissionsRoleOverridesController#manageable_permissions


### GET /api/v1/accounts/:account_id/roles/permissions


List all permissions that can be granted to roles in the given account.


This returns largely the same information documented on the Permissions list page , with a few caveats:

- Permission labels and group labels returned by this API are localized (the same text visible in the web UI).
- This API includes permissions added by plugins.
- This API excludes permissions that are disabled in or otherwise do not apply to the given account.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| search_term |  | string | If provided, return only permissions whose key, label, group, or group_label match the search string. |
