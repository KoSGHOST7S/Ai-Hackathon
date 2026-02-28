# Usage Rights

> Canvas API — Files & Media  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Set usage rightsUsageRightsController#set_usage_rights


### PUT /api/v1/courses/:course_id/usage_rights


### PUT /api/v1/groups/:group_id/usage_rights


### PUT /api/v1/users/:user_id/usage_rights


Sets copyright and license information for one or more files


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| file_ids[] | Required | string | List of ids of files to set usage rights for. |
| folder_ids[] |  | string | List of ids of folders to search for files to set usage rights for. Note that new files uploaded to these folders do not automatically inherit these rights. |
| publish |  | boolean | Whether the file(s) or folder(s) should be published on save, provided that usage rights have been specified (set to true to publish on save). |
| usage_rights[use_justification] | Required | string | The intellectual property justification for using the files in Canvas Allowed values: own_copyright , used_by_permission , fair_use , public_domain , creative_commons |
| usage_rights[legal_copyright] |  | string | The legal copyright line for the files |
| usage_rights[license] |  | string | The license that applies to the files. See the List licenses endpoint for the supported license types. |


---

## Remove usage rightsUsageRightsController#remove_usage_rights


### DELETE /api/v1/courses/:course_id/usage_rights


### DELETE /api/v1/groups/:group_id/usage_rights


### DELETE /api/v1/users/:user_id/usage_rights


Removes copyright and license information associated with one or more files


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| file_ids[] | Required | string | List of ids of files to remove associated usage rights from. |
| folder_ids[] |  | string | List of ids of folders. Usage rights will be removed from all files in these folders. |


---

## List licensesUsageRightsController#licenses


### GET /api/v1/courses/:course_id/content_licenses


### GET /api/v1/groups/:group_id/content_licenses


### GET /api/v1/users/:user_id/content_licenses


A paginated list of licenses that can be applied
