# Permissions

> Canvas API — Accounts & Admin  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Get help text for permissionsPermissionsHelpController#help


### GET /api/v1/permissions/:context_type/:permission/help


Retrieve information about what Canvas permissions do and considerations for their use.


#### Example Request:


```
curl -H 'Authorization: Bearer <token>' \
     https://<canvas>/api/v1/permissions/account/view_user_logins/help
```


---

## Retrieve permission groupsPermissionsHelpController#groups


### GET /api/v1/permissions/groups


Retrieve information about groups of granular permissions


The return value is a dictionary of permission group keys to objects containing label and subtitle keys.
