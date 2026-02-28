# Sis Imports

> Canvas API — SIS & Integrations  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Get SIS import listSisImportsApiController#index


### GET /api/v1/accounts/:account_id/sis_imports


Returns the list of SIS imports for an account


Example:


```
curl https://<canvas>/api/v1/accounts/<account_id>/sis_imports \
  -H 'Authorization: Bearer <token>'

```


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| created_since |  | DateTime | If set, only shows imports created after the specified date (use ISO8601 format) |
| created_before |  | DateTime | If set, only shows imports created before the specified date (use ISO8601 format) |
| workflow_state[] |  | string | If set, only returns imports that are in the given state. Allowed values: initializing , created , importing , cleanup_batch , imported , imported_with_messages , aborted , failed , failed_with_messages , restoring , partially_restored , restored |


---

## Get the current importing SIS importSisImportsApiController#importing


### GET /api/v1/accounts/:account_id/sis_imports/importing


Returns the SIS imports that are currently processing for an account. If no imports are running, will return an empty array.


Example:


```
curl https://<canvas>/api/v1/accounts/<account_id>/sis_imports/importing \
  -H 'Authorization: Bearer <token>'

```


---

## Import SIS dataSisImportsApiController#create


### POST /api/v1/accounts/:account_id/sis_imports


Import SIS data into Canvas. Must be on a root account with SIS imports enabled.


For more information on the format thatâs expected here, please see the âSIS CSVâ section in the API docs.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| import_type |  | string | Choose the data format for reading SIS data. With a standard Canvas install, this option can only be âinstructure_csvâ, and if unprovided, will be assumed to be so. Can be part of the query string. |
| attachment |  | string | There are three ways to post SIS import data: As a multipart/form-data form field named attachment As a raw post with a Content-Type of application/zip or application/octet-stream Using the File Upload process, which can be more reliable for large files. Use the pre_attachment[name] argument to start that flow. attachment is required for multipart/form-data style posts. Assumed to be SIS data from a file upload form field named attachment . Examples: curl -F attachment=@<filename> -H "Authorization: Bearer <token>" \     https://<canvas>/api/v1/accounts/<account_id>/sis_imports.json?import_type=instructure_csv If you decide to do a raw post, you can skip the âattachmentâ argument, but you will then be required to provide a suitable Content-Type header. You are encouraged to also provide the âextensionâ argument. Examples: curl -H 'Content-Type: application/octet-stream' --data-binary @<filename>.zip \     -H "Authorization: Bearer <token>" \     https://<canvas>/api/v1/accounts/<account_id>/sis_imports.json?import_type=instructure_csv&extension=zip  curl -H 'Content-Type: application/zip' --data-binary @<filename>.zip \     -H "Authorization: Bearer <token>" \     https://<canvas>/api/v1/accounts/<account_id>/sis_imports.json?import_type=instructure_csv  curl -H 'Content-Type: text/csv' --data-binary @<filename>.csv \     -H "Authorization: Bearer <token>" \     https://<canvas>/api/v1/accounts/<account_id>/sis_imports.json?import_type=instructure_csv  curl -H 'Content-Type: text/csv' --data-binary @<filename>.csv \     -H "Authorization: Bearer <token>" \     https://<canvas>/api/v1/accounts/<account_id>/sis_imports.json?import_type=instructure_csv&batch_mode=1&batch_mode_term_id=15 If the attachment is a zip file, the uncompressed file(s) cannot be 100x larger than the zip, or the import will fail. For example, if the zip file is 1KB but the total size of the uncompressed file(s) is 100KB or greater the import will fail. There is a hard cap of 50 GB. |
| pre_attachment[name] |  | string | The name of the file to be uploaded in a separate request via the File Upload workflow. Do not supply attachment when using this option. This option decouples the file upload from the SIS import request, which can improve reliability with larger files. |
| pre_attachment[*] |  | string | Other file upload properties; see File Upload Documentation |
| extension |  | string | Recommended for raw post request style imports. This field will be used to distinguish between zip, xml, csv, and other file format extensions that would usually be provided with the filename in the multipart post request scenario. If not provided, this value will be inferred from the Content-Type, falling back to zip-file format if all else fails. |
| batch_mode |  | boolean | If set, this SIS import will be run in batch mode, deleting any data previously imported via SIS that is not present in this latest import. See the SIS CSV Format page for details. Batch mode cannot be used with diffing. |
| batch_mode_term_id |  | string | Limit deletions to only this term. Required if batch mode is enabled. |
| multi_term_batch_mode |  | boolean | Runs batch mode against all terms in terms file. Requires change_threshold. |
| skip_deletes |  | boolean | When set the import will skip any deletes. This does not account for objects that are deleted during the batch mode cleanup process. |
| override_sis_stickiness |  | boolean | Default is false. If true, any fields containing âstickyâ or UI changes will be overridden. See SIS CSV Format documentation for information on which fields can have SIS stickiness |
| add_sis_stickiness |  | boolean | This option, if present, will process all changes as if they were UI changes. This means that âstickinessâ will be added to changed fields. This option is only processed if âoverride_sis_stickinessâ is also provided. |
| clear_sis_stickiness |  | boolean | This option, if present, will clear âstickinessâ from all fields processed by this import. Requires that âoverride_sis_stickinessâ is also provided. If âadd_sis_stickinessâ is also provided, âclear_sis_stickinessâ will overrule the behavior of âadd_sis_stickinessâ |
| update_sis_id_if_login_claimed |  | boolean | This option, if present, will override the old (or non-existent) non-matching SIS ID with the new SIS ID in the upload, if a pseudonym is found from the login field and the SIS ID doesnât match. |
| diffing_data_set_identifier |  | string | If set on a CSV import, Canvas will attempt to optimize the SIS import by comparing this set of CSVs to the previous set that has the same data set identifier, and only applying the difference between the two. See the SIS CSV Format documentation for more details. Diffing cannot be used with batch_mode |
| diffing_remaster_data_set |  | boolean | If true, and diffing_data_set_identifier is sent, this SIS import will be part of the data set, but diffing will not be performed. See the SIS CSV Format documentation for details. |
| diffing_drop_status |  | string | If diffing_drop_status is passed, this SIS import will use this status for enrollments that are not included in the sis_batch. Defaults to âdeletedâ Allowed values: deleted , completed , inactive |
| diffing_user_remove_status |  | string | For users removed from one batch to the next one using the same diffing_data_set_identifier, set their status to the value of this argument. Defaults to âdeletedâ. Allowed values: deleted , suspended |
| batch_mode_enrollment_drop_status |  | string | If batch_mode_enrollment_drop_status is passed, this SIS import will use this status for enrollments that are not included in the sis_batch. This will have an effect if multi_term_batch_mode is set. Defaults to âdeletedâ This will still mark courses and sections that are not included in the sis_batch as deleted, and subsequently enrollments in the deleted courses and sections as deleted. Allowed values: deleted , completed , inactive |
| change_threshold |  | integer | If set with batch_mode, the batch cleanup process will not run if the number of items deleted is higher than the percentage set. If set to 10 and a term has 200 enrollments, and batch would delete more than 20 of the enrollments the batch will abort before the enrollments are deleted. The change_threshold will be evaluated for course, sections, and enrollments independently. If set with diffing, diffing will not be performed if the files are greater than the threshold as a percent. If set to 5 and the file is more than 5% smaller or more than 5% larger than the file that is being compared to, diffing will not be performed. If the files are less than 5%, diffing will be performed. The way the percent is calculated is by taking the size of the current import and dividing it by the size of the previous import. The formula used is: |(1 - current_file_size / previous_file_size)| * 100 See the SIS CSV Format documentation for more details. Required for multi_term_batch_mode. |
| diff_row_count_threshold |  | integer | If set with diffing, diffing will not be performed if the number of rows to be run in the fully calculated diff import exceeds the threshold. |


---

## Get SIS import statusSisImportsApiController#show


### GET /api/v1/accounts/:account_id/sis_imports/:id


Get the status of an already created SIS import.


```
Examples:
  curl https://<canvas>/api/v1/accounts/<account_id>/sis_imports/<sis_import_id> \
      -H 'Authorization: Bearer <token>'

```


---

## Restore workflow_states of SIS imported itemsSisImportsApiController#restore_states


### PUT /api/v1/accounts/:account_id/sis_imports/:id/restore_states


This will restore the the workflow_state for all the items that changed their workflow_state during the import being restored. This will restore states for items imported with the following importers: accounts.csv terms.csv courses.csv sections.csv group_categories.csv groups.csv users.csv admins.csv This also restores states for other items that changed during the import. An example would be if an enrollment was deleted from a sis import and the group_membership was also deleted as a result of the enrollment deletion, both items would be restored when the sis batch is restored.


Restore data is retained for 30 days post-import. This endpoint is unavailable after that time.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| batch_mode |  | boolean | If set, will only restore items that were deleted from batch_mode. |
| undelete_only |  | boolean | If set, will only restore items that were deleted. This will ignore any items that were created or modified. |
| unconclude_only |  | boolean | If set, will only restore enrollments that were concluded. This will ignore any items that were created or deleted. |


#### Example Request:


```
curl https://<canvas>/api/v1/accounts/<account_id>/sis_imports/<sis_import_id>/restore_states \
  -H 'Authorization: Bearer <token>'
```


---

## Abort SIS importSisImportsApiController#abort


### PUT /api/v1/accounts/:account_id/sis_imports/:id/abort


Abort a SIS import that has not completed.


Aborting a sis batch that is running can take some time for every process to see the abort event. Subsequent sis batches begin to process 10 minutes after the abort to allow each process to clean up properly.


#### Example Request:


```
curl https://<canvas>/api/v1/accounts/<account_id>/sis_imports/<sis_import_id>/abort \
  -H 'Authorization: Bearer <token>'
```


---

## Abort all pending SIS importsSisImportsApiController#abort_all_pending


### PUT /api/v1/accounts/:account_id/sis_imports/abort_all_pending


Abort already created but not processed or processing SIS imports.


#### Example Request:


```
curl https://<canvas>/api/v1/accounts/<account_id>/sis_imports/abort_all_pending \
  -H 'Authorization: Bearer <token>'
```
