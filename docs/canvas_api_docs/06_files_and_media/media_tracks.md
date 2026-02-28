# Media Tracks

> Canvas API — Files & Media  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List media tracks for a Media Object or AttachmentMediaTracksController#index


### GET /api/v1/media_objects/:media_object_id/media_tracks


### GET /api/v1/media_attachments/:attachment_id/media_tracks


List the media tracks associated with a media object or attachment


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| include[] |  | string | By default, index returns id, locale, kind, media_object_id, and user_id for each of the result MediaTracks. Use include[] to add additional fields. For example include[]=content Allowed values: content , webvtt_content , updated_at , created_at |


#### Example Request:


```
curl https://<canvas>/api/v1/media_objects/<media_object_id>/media_tracks?include[]=content
    -H 'Authorization: Bearer <token>'
```


```
curl https://<canvas>/api/v1/media_attachments/<attachment_id>/media_tracks?include[]=content
    -H 'Authorization: Bearer <token>'
```


---

## Update Media TracksMediaTracksController#update


### PUT /api/v1/media_objects/:media_object_id/media_tracks


### PUT /api/v1/media_attachments/:attachment_id/media_tracks


Replace the media tracks associated with a media object or attachment with the array of tracks provided in the body. Update will delete any existing tracks not listed, leave untouched any tracks with no content field, and update or create tracks with a content field.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| include[] |  | string | By default, an update returns id, locale, kind, media_object_id, and user_id for each of the result MediaTracks. Use include[] to add additional fields. For example include[]=content Allowed values: content , webvtt_content , updated_at , created_at |


#### Example Request:


```
curl -X PUT https://<canvas>/api/v1/media_objects/<media_object_id>/media_tracks?include[]=content \
  -H 'Authorization: Bearer <token>'
  -d '[{"locale": "en"}, {"locale": "af","content": "1\r\n00:00:00,000 --> 00:00:01,251\r\nThis is the content\r\n"}]'
```


```
curl -X PUT https://<canvas>/api/v1/media_attachments/<attachment_id>/media_tracks?include[]=content \
  -H 'Authorization: Bearer <token>'
  -d '[{"locale": "en"}, {"locale": "af","content": "1\r\n00:00:00,000 --> 00:00:01,251\r\nThis is the content\r\n"}]'
```
