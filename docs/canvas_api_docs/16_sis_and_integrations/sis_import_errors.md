# Sis Import Errors

> Canvas API — SIS & Integrations  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Get SIS import error listSisImportErrorsApiController#index


### GET /api/v1/accounts/:account_id/sis_imports/:id/errors


### GET /api/v1/accounts/:account_id/sis_import_errors


Returns the list of SIS import errors for an account or a SIS import. Import errors are only stored for 30 days.


Example:


```
curl 'https://<canvas>/api/v1/accounts/<account_id>/sis_imports/<id>/sis_import_errors' \
  -H "Authorization: Bearer <token>"

```


Example:


```
curl 'https://<canvas>/api/v1/accounts/<account_id>/sis_import_errors' \
  -H "Authorization: Bearer <token>"

```


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| failure |  | boolean | If set, only shows errors on a sis import that would cause a failure. |
