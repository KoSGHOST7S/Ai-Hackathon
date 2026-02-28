# Content Exports

> Canvas API — Content Management  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List content exportsContentExportsApiController#index


### GET /api/v1/courses/:course_id/content_exports


### GET /api/v1/groups/:group_id/content_exports


### GET /api/v1/users/:user_id/content_exports


A paginated list of the past and pending content export jobs for a course, group, or user. Exports are returned newest first.


---

## Show content exportContentExportsApiController#show


### GET /api/v1/courses/:course_id/content_exports/:id


### GET /api/v1/groups/:group_id/content_exports/:id


### GET /api/v1/users/:user_id/content_exports/:id


Get information about a single content export.


---

## Export contentContentExportsApiController#create


### POST /api/v1/courses/:course_id/content_exports


### POST /api/v1/groups/:group_id/content_exports


### POST /api/v1/users/:user_id/content_exports


Begin a content export job for a course, group, or user.


You can use the Progress API to track the progress of the export. The migrationâs progress is linked to with the progress_url value.


When the export completes, use the Show content export endpoint to retrieve a download URL for the exported content.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| export_type | Required | string | âcommon_cartridgeâ Export the contents of the course in the Common Cartridge (.imscc) format âqtiâ Export quizzes from a course in the QTI format âzipâ Export files from a course, group, or user in a zip file Allowed values: common_cartridge , qti , zip |
| skip_notifications |  | boolean | Donât send the notifications about the export to the user. Default: false |
| select |  | Hash | The select parameter allows exporting specific data. The keys are object types like âfilesâ, âfoldersâ, âpagesâ, etc. The value for each key is a list of object ids. An id can be an integer or a string. Multiple object types can be selected in the same call. However, not all object types are valid for every export_type. Common Cartridge supports all object types. Zip and QTI only support the object types as described below. âfoldersâ Also supported for zip export_type. âfilesâ Also supported for zip export_type. âquizzesâ Also supported for qti export_type. Allowed values: folders , files , attachments , quizzes , assignments , announcements , calendar_events , discussion_topics , modules , module_items , pages , rubrics |
