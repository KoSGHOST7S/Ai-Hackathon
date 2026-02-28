# Admins

> Canvas API — Accounts & Admin  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List account adminsAdminsController#index


### GET /api/v1/accounts/:account_id/admins


A paginated list of the admins in the account


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| user_id[] |  | [Integer] | Scope the results to those with user IDs equal to any of the IDs specified here. |
| search_term |  | string | The partial name or full ID of the admins to match and return in the results list. Must be at least 2 characters. |
| include_deleted |  | boolean | When set to true, returns admins who have been deleted |


---

## Make an account adminAdminsController#create


### POST /api/v1/accounts/:account_id/admins


Flag an existing user as an admin within the account.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| user_id | Required | integer | The id of the user to promote. |
| role |  | string | DEPRECATED The userâs admin relationship with the account will be created with the given role. Defaults to âAccountAdminâ. |
| role_id |  | integer | The userâs admin relationship with the account will be created with the given role. Defaults to the built-in role for âAccountAdminâ. |
| send_confirmation |  | boolean | Send a notification email to the new admin if true. Default is true. |


---

## Remove account adminAdminsController#destroy


### DELETE /api/v1/accounts/:account_id/admins/:user_id


Remove the rights associated with an account admin role from a user.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| role |  | string | DEPRECATED Account role to remove from the user. |
| role_id | Required | integer | The id of the role representing the userâs admin relationship with the account. |


---

## List my admin rolesAdminsController#self_roles


### GET /api/v1/accounts/:account_id/admins/self


A paginated list of the current userâs roles in the account. The results are the same as those returned by the List account admins endpoint with user_id set to self , except the âAdmins - Add / Removeâ permission is not required.
