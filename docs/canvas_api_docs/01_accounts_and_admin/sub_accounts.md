# Sub Accounts

> Canvas API — Accounts & Admin  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Create a new sub-accountSubAccountsController#create


### POST /api/v1/accounts/:account_id/sub_accounts


Add a new sub-account to a given account.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| account[name] | Required | string | The name of the new sub-account. |
| account[sis_account_id] |  | string | The accountâs identifier in the Student Information System. |
| account[default_storage_quota_mb] |  | integer | The default course storage quota to be used, if not otherwise specified. |
| account[default_user_storage_quota_mb] |  | integer | The default user storage quota to be used, if not otherwise specified. |
| account[default_group_storage_quota_mb] |  | integer | The default group storage quota to be used, if not otherwise specified. |


---

## Delete a sub-accountSubAccountsController#destroy


### DELETE /api/v1/accounts/:account_id/sub_accounts/:id


Cannot delete an account with active courses or active sub_accounts. Cannot delete a root_account
