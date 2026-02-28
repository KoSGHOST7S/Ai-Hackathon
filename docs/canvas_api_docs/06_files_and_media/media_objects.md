# Media Objects

> Canvas API — Files & Media  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List Media ObjectsMediaObjectsController#index


### GET /api/v1/media_objects


### GET /api/v1/courses/:course_id/media_objects


### GET /api/v1/groups/:group_id/media_objects


### GET /api/v1/media_attachments


### GET /api/v1/courses/:course_id/media_attachments


### GET /api/v1/groups/:group_id/media_attachments


Returns media objects created by the user making the request. When using the second version, returns media objects associated with the given course.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| sort |  | string | Field to sort on. Default is âtitleâ title sorts on user_entered_title if available, title if not. created_at sorts on the objectâs creation time. Allowed values: title , created_at |
| order |  | string | Sort direction. Default is âascâ Allowed values: asc , desc |
| exclude[] |  | string | Array of data to exclude. By excluding âsourcesâ and âtracksâ, the api will not need to query kaltura, which greatly speeds up its response. sources Do not query kaltura for media_sources tracks Do not query kaltura for media_tracks Allowed values: sources , tracks |


#### Example Request:


```
curl https://<canvas>/api/v1/media_objects?exclude[]=sources&exclude[]=tracks \
     -H 'Authorization: Bearer <token>'

curl https://<canvas>/api/v1/courses/17/media_objects?exclude[]=sources&exclude[]=tracks \
     -H 'Authorization: Bearer <token>'
```


---

## Update Media ObjectMediaObjectsController#update_media_object


### PUT /api/v1/media_objects/:media_object_id


### PUT /api/v1/media_attachments/:attachment_id


Updates the title of a media object.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| user_entered_title |  | string | The new title. |
