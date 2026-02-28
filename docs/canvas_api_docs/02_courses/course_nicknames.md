# Course Nicknames

> Canvas API — Courses  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List course nicknamesCourseNicknamesController#index


### GET /api/v1/users/self/course_nicknames


Returns all course nicknames you have set.


#### Example Request:


```
curl 'https://<canvas>/api/v1/users/self/course_nicknames \
  -H 'Authorization: Bearer <token>'
```


---

## Get course nicknameCourseNicknamesController#show


### GET /api/v1/users/self/course_nicknames/:course_id


Returns the nickname for a specific course.


#### Example Request:


```
curl 'https://<canvas>/api/v1/users/self/course_nicknames/<course_id> \
  -H 'Authorization: Bearer <token>'
```


---

## Set course nicknameCourseNicknamesController#update


### PUT /api/v1/users/self/course_nicknames/:course_id


Set a nickname for the given course. This will replace the courseâs name in output of API calls you make subsequently, as well as in selected places in the Canvas web user interface.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| nickname | Required | string | The nickname to set.  It must be non-empty and shorter than 60 characters. |


#### Example Request:


```
curl 'https://<canvas>/api/v1/users/self/course_nicknames/<course_id> \
  -X PUT \
  -F 'nickname=Physics' \
  -H 'Authorization: Bearer <token>'
```


---

## Remove course nicknameCourseNicknamesController#delete


### DELETE /api/v1/users/self/course_nicknames/:course_id


Remove the nickname for the given course. Subsequent course API calls will return the actual name for the course.


#### Example Request:


```
curl 'https://<canvas>/api/v1/users/self/course_nicknames/<course_id> \
  -X DELETE \
  -H 'Authorization: Bearer <token>'
```


---

## Clear course nicknamesCourseNicknamesController#clear


### DELETE /api/v1/users/self/course_nicknames


Remove all stored course nicknames.


#### Example Request:


```
curl 'https://<canvas>/api/v1/users/self/course_nicknames \
  -X DELETE \
  -H 'Authorization: Bearer <token>'
```
