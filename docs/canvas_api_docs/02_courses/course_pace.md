# Course Pace

> Canvas API — Courses  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Show a Course paceCoursePacesController#api_show


### GET /api/v1/courses/:course_id/course_pacing/:id


Returns a course pace for the course and pace id provided


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| course_id | Required | integer | The id of the course |
| course_pace_id | Required | integer | The id of the course_pace |


#### Example Request:


```
curl https://<canvas>/api/v1/courses/1/course_pacing/1 \
  -H 'Authorization: Bearer <token>'
```


---

## Create a Course paceCoursePacesController#create


### POST /api/v1/courses/:course_id/course_pacing


Creates a new course pace with specified parameters.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| course_id | Required | integer | The id of the course |
| end_date |  | Datetime | End date of the course pace |
| end_date_context |  | string | End date context (course, section, hupothetical) |
| start_date |  | Datetime | Start date of the course pace |
| start_date_context |  | string | Start date context (course, section, hupothetical) |
| exclude_weekends |  | boolean | Course pace dates excludes weekends if true |
| selected_days_to_skip |  | string | Array<String> Course pace dates excludes weekends if true |
| hard_end_dates |  | boolean | Course pace uess hard end dates if true |
| workflow_state |  | string | The state of the course pace |
| course_pace_module_item_attributes[] |  | string | Module Items attributes |
| context_id |  | integer | Pace Context ID |
| context_type |  | string | Pace Context Type (Course, Section, User) |


#### Example Request:


```
curl https://<canvas>/api/v1/courses/1/course_pacing \
  -X POST \
  -H 'Authorization: Bearer <token>'
```


---

## Update a Course paceCoursePacesController#update


### PUT /api/v1/courses/:course_id/course_pacing/:id


Returns the updated course pace


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| course_id | Required | integer | The id of the course |
| course_pace_id | Required | integer | The id of the course pace |
| end_date |  | Datetime | End date of the course pace |
| exclude_weekends |  | boolean | Course pace dates excludes weekends if true |
| selected_days_to_skip |  | string | Array<String> Course pace dates excludes weekends if true |
| hard_end_dates |  | boolean | Course pace uess hard end dates if true |
| workflow_state |  | string | The state of the course pace |
| course_pace_module_item_attributes[] |  | string | Module Items attributes |


#### Example Request:


```
curl https://<canvas>/api/v1/courses/1/course_pacing/1 \
  -X PUT \
  -H 'Authorization: Bearer <token>'
```


---

## Delete a Course paceCoursePacesController#destroy


### DELETE /api/v1/courses/:course_id/course_pacing/:id


Returns the updated course pace


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| course_id | Required | integer | The id of the course |
| course_pace_id | Required | integer | The id of the course_pace |


#### Example Request:


```
curl https://<canvas>/api/v1/courses/1/course_pacing/1 \
  -X DELETE \
  -H 'Authorization: Bearer <token>'
```
