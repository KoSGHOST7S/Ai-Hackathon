# Authentication Audit

> Canvas API — Accounts & Admin  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Query by login.AuthenticationAuditApiController#for_login


### GET /api/v1/audit/authentication/logins/:login_id


List authentication events for a given login.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| start_time |  | DateTime | The beginning of the time range from which you want events. Events are stored for one year. |
| end_time |  | DateTime | The end of the time range from which you want events. |


---

## Query by account.AuthenticationAuditApiController#for_account


### GET /api/v1/audit/authentication/accounts/:account_id


List authentication events for a given account.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| start_time |  | DateTime | The beginning of the time range from which you want events. Events are stored for one year. |
| end_time |  | DateTime | The end of the time range from which you want events. |


---

## Query by user.AuthenticationAuditApiController#for_user


### GET /api/v1/audit/authentication/users/:user_id


List authentication events for a given user.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| start_time |  | DateTime | The beginning of the time range from which you want events. Events are stored for one year. |
| end_time |  | DateTime | The end of the time range from which you want events. |
