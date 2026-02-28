# Folders

> Canvas API — Files & Media  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List foldersFoldersController#api_index


### GET /api/v1/folders/:id/folders


Returns the paginated list of folders in the folder.


#### Example Request:


```
curl 'https://<canvas>/api/v1/folders/<folder_id>/folders' \
     -H 'Authorization: Bearer <token>'
```


---

## List all foldersFoldersController#list_all_folders


### GET /api/v1/courses/:course_id/folders


### GET /api/v1/users/:user_id/folders


### GET /api/v1/groups/:group_id/folders


Returns the paginated list of all folders for the given context. This will be returned as a flat list containing all subfolders as well.


#### Example Request:


```
curl 'https://<canvas>/api/v1/courses/<course_id>/folders' \
     -H 'Authorization: Bearer <token>'
```


---

## Resolve pathFoldersController#resolve_path


### GET /api/v1/courses/:course_id/folders/by_path/*full_path


### GET /api/v1/courses/:course_id/folders/by_path


### GET /api/v1/users/:user_id/folders/by_path/*full_path


### GET /api/v1/users/:user_id/folders/by_path


### GET /api/v1/groups/:group_id/folders/by_path/*full_path


### GET /api/v1/groups/:group_id/folders/by_path


Given the full path to a folder, returns a list of all Folders in the path hierarchy, starting at the root folder, and ending at the requested folder. The given path is relative to the contextâs root folder and does not include the root folderâs name (e.g., âcourse filesâ). If an empty path is given, the contextâs root folder alone is returned. Otherwise, if no folder exists with the given full path, a Not Found error is returned.


#### Example Request:


```
curl 'https://<canvas>/api/v1/courses/<course_id>/folders/by_path/foo/bar/baz' \
     -H 'Authorization: Bearer <token>'
```


---

## Get folderFoldersController#show


### GET /api/v1/courses/:course_id/folders/:id


### GET /api/v1/users/:user_id/folders/:id


### GET /api/v1/groups/:group_id/folders/:id


### GET /api/v1/folders/:id


Returns the details for a folder


You can get the root folder from a context by using ârootâ as the :id. For example, you could get the root folder for a course like:


#### Example Request:


```
curl 'https://<canvas>/api/v1/courses/1337/folders/root' \
     -H 'Authorization: Bearer <token>'
```


```
curl 'https://<canvas>/api/v1/folders/<folder_id>' \
     -H 'Authorization: Bearer <token>'
```


---

## Update folderFoldersController#update


### PUT /api/v1/folders/:id


Updates a folder


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| name |  | string | The new name of the folder |
| parent_folder_id |  | string | The id of the folder to move this folder into. The new folder must be in the same context as the original parent folder. |
| lock_at |  | DateTime | The datetime to lock the folder at |
| unlock_at |  | DateTime | The datetime to unlock the folder at |
| locked |  | boolean | Flag the folder as locked |
| hidden |  | boolean | Flag the folder as hidden |
| position |  | integer | Set an explicit sort position for the folder |


#### Example Request:


```
curl -XPUT 'https://<canvas>/api/v1/folders/<folder_id>' \
     -F 'name=<new_name>' \
     -F 'locked=true' \
     -H 'Authorization: Bearer <token>'
```


---

## Create folderFoldersController#create


### POST /api/v1/courses/:course_id/folders


### POST /api/v1/users/:user_id/folders


### POST /api/v1/groups/:group_id/folders


### POST /api/v1/folders/:folder_id/folders


### POST /api/v1/accounts/:account_id/folders


Creates a folder in the specified context


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| name | Required | string | The name of the folder |
| parent_folder_id |  | string | The id of the folder to store the new folder in. An error will be returned if this does not correspond to an existing folder. If this and parent_folder_path are sent an error will be returned. If neither is given, a default folder will be used. |
| parent_folder_path |  | string | The path of the folder to store the new folder in. The path separator is the forward slash / , never a back slash. The parent folder will be created if it does not already exist. This parameter only applies to new folders in a context that has folders, such as a user, a course, or a group. If this and parent_folder_id are sent an error will be returned. If neither is given, a default folder will be used. |
| lock_at |  | DateTime | The datetime to lock the folder at |
| unlock_at |  | DateTime | The datetime to unlock the folder at |
| locked |  | boolean | Flag the folder as locked |
| hidden |  | boolean | Flag the folder as hidden |
| position |  | integer | Set an explicit sort position for the folder |


#### Example Request:


```
curl 'https://<canvas>/api/v1/folders/<folder_id>/folders' \
     -F 'name=<new_name>' \
     -F 'locked=true' \
     -H 'Authorization: Bearer <token>'
```


```
curl 'https://<canvas>/api/v1/courses/<course_id>/folders' \
     -F 'name=<new_name>' \
     -F 'locked=true' \
     -H 'Authorization: Bearer <token>'
```


---

## Delete folderFoldersController#api_destroy


### DELETE /api/v1/folders/:id


Remove the specified folder. You can only delete empty folders unless you set the âforceâ flag


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| force |  | boolean | Set to âtrueâ to allow deleting a non-empty folder |


#### Example Request:


```
curl -X DELETE 'https://<canvas>/api/v1/folders/<folder_id>' \
     -H 'Authorization: Bearer <token>'
```


---

## Upload a fileFoldersController#create_file


### POST /api/v1/folders/:folder_id/files


Upload a file to a folder.


This API endpoint is the first step in uploading a file. See the File Upload Documentation for details on the file upload workflow.


Only those with the âManage Filesâ permission on a course or group can upload files to a folder in that course or group.


---

## Copy a fileFoldersController#copy_file


### POST /api/v1/folders/:dest_folder_id/copy_file


Copy a file from elsewhere in Canvas into a folder.


Copying a file across contexts (between courses and users) is permitted, but the source and destination must belong to the same institution.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| source_file_id | Required | string | The id of the source file |
| on_duplicate |  | string | What to do if a file with the same name already exists at the destination. If such a file exists and this parameter is not given, the call will fail. âoverwriteâ Replace an existing file with the same name ârenameâ Add a qualifier to make the new filename unique Allowed values: overwrite , rename |


#### Example Request:


```
curl 'https://<canvas>/api/v1/folders/123/copy_file' \
     -H 'Authorization: Bearer <token>'
     -F 'source_file_id=456'
```


---

## Copy a folderFoldersController#copy_folder


### POST /api/v1/folders/:dest_folder_id/copy_folder


Copy a folder (and its contents) from elsewhere in Canvas into a folder.


Copying a folder across contexts (between courses and users) is permitted, but the source and destination must belong to the same institution. If the source and destination folders are in the same context, the source folder may not contain the destination folder. A folder will be renamed at its destination if another folder with the same name already exists.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| source_folder_id | Required | string | The id of the source folder |


#### Example Request:


```
curl 'https://<canvas>/api/v1/folders/123/copy_folder' \
     -H 'Authorization: Bearer <token>'
     -F 'source_file_id=789'
```


---

## Get uploaded media folder for userFoldersController#media_folder


### GET /api/v1/courses/:course_id/folders/media


### GET /api/v1/groups/:group_id/folders/media


Returns the details for a designated upload folder that the user has rights to upload to, and creates it if it doesnât exist.


If the current user does not have the permissions to manage files in the course or group, the folder will belong to the current user directly.


#### Example Request:


```
curl 'https://<canvas>/api/v1/courses/1337/folders/media' \
     -H 'Authorization: Bearer <token>'
```
