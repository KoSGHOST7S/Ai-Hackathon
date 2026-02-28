# Outcome Imports

> Canvas API — Outcomes & Competencies  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Import OutcomesOutcomeImportsApiController#create


### POST /api/v1/accounts/:account_id/outcome_imports(/group/:learning_outcome_group_id)


### POST /api/v1/courses/:course_id/outcome_imports(/group/:learning_outcome_group_id)


Import outcomes into Canvas.


For more information on the format thatâs expected here, please see the âOutcomes CSVâ section in the API docs.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| import_type |  | string | Choose the data format for reading outcome data. With a standard Canvas install, this option can only be âinstructure_csvâ, and if unprovided, will be assumed to be so. Can be part of the query string. |
| attachment |  | string | There are two ways to post outcome import data - either via a multipart/form-data form-field-style attachment, or via a non-multipart raw post request. âattachmentâ is required for multipart/form-data style posts. Assumed to be outcome data from a file upload form field named âattachmentâ. Examples: curl -F attachment=@<filename> -H "Authorization: Bearer <token>" \     'https://<canvas>/api/v1/accounts/<account_id>/outcome_imports?import_type=instructure_csv' curl -F attachment=@<filename> -H "Authorization: Bearer <token>" \     'https://<canvas>/api/v1/courses/<course_id>/outcome_imports?import_type=instructure_csv' If you decide to do a raw post, you can skip the âattachmentâ argument, but you will then be required to provide a suitable Content-Type header. You are encouraged to also provide the âextensionâ argument. Examples: curl -H 'Content-Type: text/csv' --data-binary @<filename>.csv \     -H "Authorization: Bearer <token>" \     'https://<canvas>/api/v1/accounts/<account_id>/outcome_imports?import_type=instructure_csv'  curl -H 'Content-Type: text/csv' --data-binary @<filename>.csv \     -H "Authorization: Bearer <token>" \     'https://<canvas>/api/v1/courses/<course_id>/outcome_imports?import_type=instructure_csv' |
| extension |  | string | Recommended for raw post request style imports. This field will be used to distinguish between csv and other file format extensions that would usually be provided with the filename in the multipart post request scenario. If not provided, this value will be inferred from the Content-Type, falling back to csv-file format if all else fails. |


---

## Get Outcome import statusOutcomeImportsApiController#show


### GET /api/v1/accounts/:account_id/outcome_imports/:id


### GET /api/v1/courses/:course_id/outcome_imports/:id


Get the status of an already created Outcome import. Pass âlatestâ for the outcome import id for the latest import.


```
Examples:
  curl 'https://<canvas>/api/v1/accounts/<account_id>/outcome_imports/<outcome_import_id>' \
      -H "Authorization: Bearer <token>"
  curl 'https://<canvas>/api/v1/courses/<course_id>/outcome_imports/<outcome_import_id>' \
      -H "Authorization: Bearer <token>"

```


---

## Get IDs of outcome groups created after successful importOutcomeImportsApiController#created_group_ids


### GET /api/v1/accounts/:account_id/outcome_imports/:id/created_group_ids


### GET /api/v1/courses/:course_id/outcome_imports/:id/created_group_ids


Get the IDs of the outcome groups created after a successful import. Pass âlatestâ for the outcome import id for the latest import.


```
Examples:
  curl 'https://<canvas>/api/v1/accounts/<account_id>/outcome_imports/outcomes_group_ids/<outcome_import_id>' \
      -H "Authorization: Bearer <token>"
  curl 'https://<canvas>/api/v1/courses/<course_id>/outcome_imports/outcome_group_ids/<outcome_import_id>' \
      -H "Authorization: Bearer <token>"

```
