# Files

> Canvas API — Files & Media  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Get quota informationFilesController#api_quota


### GET /api/v1/courses/:course_id/files/quota


### GET /api/v1/groups/:group_id/files/quota


### GET /api/v1/users/:user_id/files/quota


Returns the total and used storage quota for the course, group, or user.


#### Example Request:


```
curl 'https://<canvas>/api/v1/courses/1/files/quota' \
      -H 'Authorization: Bearer <token>'
```


#### Example Response:


```
{ "quota": 524288000, "quota_used": 402653184 }
```


---

## List filesFilesController#api_index


### GET /api/v1/courses/:course_id/files


### GET /api/v1/users/:user_id/files


### GET /api/v1/groups/:group_id/files


### GET /api/v1/folders/:id/files


Returns the paginated list of files for the folder or course.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| content_types[] |  | string | Filter results by content-type. You can specify type/subtype pairs (e.g., âimage/jpegâ), or simply types (e.g., âimageâ, which will match âimage/gifâ, âimage/jpegâ, etc.). |
| exclude_content_types[] |  | string | Exclude given content-types from your results. You can specify type/subtype pairs (e.g., âimage/jpegâ), or simply types (e.g., âimageâ, which will match âimage/gifâ, âimage/jpegâ, etc.). |
| search_term |  | string | The partial name of the files to match and return. |
| include[] |  | string | Array of additional information to include. âuserâ the user who uploaded the file or last edited its content âusage_rightsâ copyright and license information for the file (see UsageRights) Allowed values: user |
| only[] |  | Array | Array of information to restrict to. Overrides include[] ânamesâ only returns file name information |
| sort |  | string | Sort results by this field. Defaults to ânameâ. Note that âsort=user` implies `include[]=user`. Allowed values: name , size , created_at , updated_at , content_type , user |
| order |  | string | The sorting order. Defaults to âascâ. Allowed values: asc , desc |


#### Example Request:


```
curl 'https://<canvas>/api/v1/folders/<folder_id>/files?content_types[]=image&content_types[]=text/plain \
      -H 'Authorization: Bearer <token>'
```


---

## Get public inline preview urlFilesController#public_url


### GET /api/v1/files/:id/public_url


Determine the URL that should be used for inline preview of the file.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| submission_id |  | integer | The id of the submission the file is associated with.  Provide this argument to gain access to a file that has been submitted to an assignment (Canvas will verify that the file belongs to the submission and the calling user has rights to view the submission). |


#### Example Request:


```
curl 'https://<canvas>/api/v1/files/1/public_url' \
      -H 'Authorization: Bearer <token>'
```


#### Example Response:


```
{ "public_url": "https://example-bucket.s3.amazonaws.com/example-namespace/attachments/1/example-filename?AWSAccessKeyId=example-key&Expires=1400000000&Signature=example-signature" }
```


---

## Get fileFilesController#api_show


### GET /api/v1/files/:id


### POST /api/v1/files/:id


### GET /api/v1/courses/:course_id/files/:id


### GET /api/v1/groups/:group_id/files/:id


### GET /api/v1/users/:user_id/files/:id


Returns the standard attachment json object


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| include[] |  | string | Array of additional information to include. âuserâ the user who uploaded the file or last edited its content âusage_rightsâ copyright and license information for the file (see UsageRights) Allowed values: user |
| replacement_chain_context_type |  | string | When a user replaces a file during upload, Canvas keeps track of the âreplacement chain.â Include this parameter if you wish Canvas to follow the replacement chain if the requested file was deleted and replaced by another. Must be set to âcourseâ or âaccountâ. The âreplacement_chain_context_idâ parameter must also be included. |
| replacement_chain_context_id |  | integer | When a user replaces a file during upload, Canvas keeps track of the âreplacement chain.â Include this parameter if you wish Canvas to follow the replacement chain if the requested file was deleted and replaced by another. Indicates the context ID Canvas should use when following the âreplacement chain.â The âreplacement_chain_context_typeâ parameter must also be included. |


#### Example Request:


```
curl 'https://<canvas>/api/v1/files/<file_id>' \
      -H 'Authorization: Bearer <token>'

curl 'https://<canvas>/api/v1/courses/<course_id>/files/<file_id>' \
      -H 'Authorization: Bearer <token>'
```


---

## Translate file referenceFilesController#file_ref


### GET /api/v1/courses/:course_id/files/file_ref/:migration_id


Get information about a file from a course copy file reference


#### Example Request:


```
curl https://<canvas>/api/v1/courses/1/files/file_ref/i567b573b77fab13a1a39937c24ae88f2 \
     -H 'Authorization: Bearer <token>'
```


---

## Update fileFilesController#api_update


### PUT /api/v1/files/:id


Update some settings on the specified file


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| name |  | string | The new display name of the file, with a limit of 255 characters. |
| parent_folder_id |  | string | The id of the folder to move this file into. The new folder must be in the same context as the original parent folder. If the file is in a context without folders this does not apply. |
| on_duplicate |  | string | If the file is moved to a folder containing a file with the same name, or renamed to a name matching an existing file, the API call will fail unless this parameter is supplied. âoverwriteâ Replace the existing file with the same name ârenameâ Add a qualifier to make the new filename unique Allowed values: overwrite , rename |
| lock_at |  | DateTime | The datetime to lock the file at |
| unlock_at |  | DateTime | The datetime to unlock the file at |
| locked |  | boolean | Flag the file as locked |
| hidden |  | boolean | Flag the file as hidden |
| visibility_level |  | string | Configure which roles can access this file |


#### Example Request:


```
curl -X PUT 'https://<canvas>/api/v1/files/<file_id>' \
     -F 'name=<new_name>' \
     -F 'locked=true' \
     -H 'Authorization: Bearer <token>'
```


---

## Delete fileFilesController#destroy


### DELETE /api/v1/files/:id


Remove the specified file. Unlike most other DELETE endpoints, using this endpoint will result in comprehensive, irretrievable destruction of the file. It should be used with the replace parameter set to true in cases where the file preview also needs to be destroyed (such as to remove files that violate privacy laws).


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| replace |  | boolean | This action is irreversible. If replace is set to true the file contents will be replaced with a generic âfile has been removedâ file. This also destroys any previews that have been generated for the file. Must have manage files and become other users permissions |


#### Example Request:


```
curl -X DELETE 'https://<canvas>/api/v1/files/<file_id>' \
     -H 'Authorization: Bearer <token>'
```


---

## Get icon metadataFilesController#icon_metadata


### GET /api/v1/files/:id/icon_metadata


Returns the icon maker file attachment metadata


#### Example Request:


```
curl 'https://<canvas>/api/v1/courses/1/files/1/metadata' \
      -H 'Authorization: Bearer <token>'
```


#### Example Response:


```
{
  "type":"image/svg+xml-icon-maker-icons",
  "alt":"",
  "shape":"square",
  "size":"small",
  "color":"#FFFFFF",
  "outlineColor":"#65499D",
  "outlineSize":"large",
  "text":"Hello",
  "textSize":"x-large",
  "textColor":"#65499D",
  "textBackgroundColor":"#FFFFFF",
  "textPosition":"bottom-third",
  "encodedImage":"data:image/svg+xml;base64,PH==",
  "encodedImageType":"SingleColor",
  "encodedImageName":"Health Icon",
  "x":"50%",
  "y":"50%",
  "translateX":-54,
  "translateY":-54,
  "width":108,
  "height":108,
  "transform":"translate(-54,-54)"
}
```


---

## Reset link verifierFilesController#reset_verifier


### POST /api/v1/files/:id/reset_verifier


Resets the link verifier. Any existing links to the file using the previous hard-coded âverifierâ parameter will no longer automatically grant access.


Must have manage files and become other users permissions


#### Example Request:


```
curl -X POST 'https://<canvas>/api/v1/files/<file_id>/reset_verifier' \
     -H 'Authorization: Bearer <token>'
```
