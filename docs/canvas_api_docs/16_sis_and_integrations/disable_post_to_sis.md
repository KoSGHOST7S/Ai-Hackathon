# Disable Post To Sis

> Canvas API — SIS & Integrations  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Disable assignments currently enabled for grade export to SISDisablePostToSisApiController#disable_post_to_sis


### PUT /api/sis/courses/:course_id/disable_post_to_sis


Disable all assignments flagged as âpost_to_sisâ, with the option of making it specific to a grading period, in a course.


On success, the response will be 204 No Content with an empty body.


On failure, the response will be 400 Bad Request with a body of a specific message.


For disabling assignments in a specific grading period


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| course_id |  | integer | The ID of the course. |
| grading_period_id |  | integer | The ID of the grading period. |


#### Example Request:


```
curl 'https://<canvas>/api/sis/courses/<course_id>/disable_post_to_sis' \
     -X PUT \
     -H "Authorization: Bearer <token>" \
     -H "Content-Length: 0"
```


```
curl 'https://<canvas>/api/sis/courses/<course_id>/disable_post_to_sis' \
     -X PUT \
     -H "Authorization: Bearer <token>" \
     -H "Content-Length: 0" \
     -d 'grading_period_id=1'
```
