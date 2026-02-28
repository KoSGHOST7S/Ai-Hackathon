# Discussion Entries

> Canvas API — Discussions & Announcements  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Update an entryDiscussionEntriesController#update


### PUT /api/v1/courses/:course_id/discussion_topics/:topic_id/entries/:id


### PUT /api/v1/groups/:group_id/discussion_topics/:topic_id/entries/:id


Update an existing discussion entry.


The entry must have been created by the current user, or the current user must have admin rights to the discussion. If the edit is not allowed, a 401 will be returned.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| message |  | string | The updated body of the entry. |


#### Example Request:


```
curl -X PUT 'https://<canvas>/api/v1/courses/<course_id>/discussion_topics/<topic_id>/entries/<entry_id>' \
     -F 'message=<message>' \
     -H "Authorization: Bearer <token>"
```


---

## Delete an entryDiscussionEntriesController#destroy


### DELETE /api/v1/courses/:course_id/discussion_topics/:topic_id/entries/:id


### DELETE /api/v1/groups/:group_id/discussion_topics/:topic_id/entries/:id


Delete a discussion entry.


The entry must have been created by the current user, or the current user must have admin rights to the discussion. If the delete is not allowed, a 401 will be returned.


The discussion will be marked deleted, and the user_id and message will be cleared out.


#### Example Request:


```
curl -X DELETE 'https://<canvas>/api/v1/courses/<course_id>/discussion_topics/<topic_id>/entries/<entry_id>' \
     -H "Authorization: Bearer <token>"
```
