# Conferences

> Canvas API — Calendar & Scheduling  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List conferencesConferencesController#index


### GET /api/v1/courses/:course_id/conferences


### GET /api/v1/groups/:group_id/conferences


Retrieve the paginated list of conferences for this context


This API returns a JSON object containing the list of conferences, the key for the list of conferences is âconferencesâ


#### Example Request:


```
curl 'https://<canvas>/api/v1/courses/<course_id>/conferences' \
    -H "Authorization: Bearer <token>"

curl 'https://<canvas>/api/v1/groups/<group_id>/conferences' \
    -H "Authorization: Bearer <token>"
```


---

## List conferences for the current userConferencesController#for_user


### GET /api/v1/conferences


Retrieve the paginated list of conferences for all courses and groups the current user belongs to


This API returns a JSON object containing the list of conferences. The key for the list of conferences is âconferencesâ.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| state |  | string | If set to âliveâ, returns only conferences that are live (i.e., have started and not finished yet). If omitted, returns all conferences for this userâs groups and courses. |


#### Example Request:


```
curl 'https://<canvas>/api/v1/conferences' \
    -H "Authorization: Bearer <token>"
```
