# External Feeds

> Canvas API — Discussions & Announcements  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List external feedsExternalFeedsController#index


### GET /api/v1/courses/:course_id/external_feeds


### GET /api/v1/groups/:group_id/external_feeds


Returns the paginated list of External Feeds this course or group.


#### Example Request:


```
curl https://<canvas>/api/v1/courses/<course_id>/external_feeds \
     -H 'Authorization: Bearer <token>'
```


---

## Create an external feedExternalFeedsController#create


### POST /api/v1/courses/:course_id/external_feeds


### POST /api/v1/groups/:group_id/external_feeds


Create a new external feed for the course or group.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| url | Required | string | The url to the external rss or atom feed |
| header_match |  | boolean | If given, only feed entries that contain this string in their title will be imported |
| verbosity |  | string | Defaults to âfullâ Allowed values: full , truncate , link_only |


#### Example Request:


```
curl https://<canvas>/api/v1/courses/<course_id>/external_feeds \
    -F url='http://example.com/rss.xml' \
    -F header_match='news flash!' \
    -F verbosity='full' \
    -H 'Authorization: Bearer <token>'
```


---

## Delete an external feedExternalFeedsController#destroy


### DELETE /api/v1/courses/:course_id/external_feeds/:external_feed_id


### DELETE /api/v1/groups/:group_id/external_feeds/:external_feed_id


Deletes the external feed.


#### Example Request:


```
curl -X DELETE https://<canvas>/api/v1/courses/<course_id>/external_feeds/<feed_id> \
     -H 'Authorization: Bearer <token>'
```
