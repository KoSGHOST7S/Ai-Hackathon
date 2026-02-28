# Assignment Overrides

> Canvas API — Assignments & Grades  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List assignment overridesAssignmentOverridesController#index


### GET /api/v1/courses/:course_id/assignments/:assignment_id/overrides


Returns the paginated list of overrides for this assignment that target sections/groups/students visible to the current user.


---

## Get a single assignment overrideAssignmentOverridesController#show


### GET /api/v1/courses/:course_id/assignments/:assignment_id/overrides/:id


Returns details of the the override with the given id.


---

## Redirect to the assignment override for a groupAssignmentOverridesController#group_alias


### GET /api/v1/groups/:group_id/assignments/:assignment_id/override


Responds with a redirect to the override for the given group, if any (404 otherwise).


---

## Redirect to the assignment override for a sectionAssignmentOverridesController#section_alias


### GET /api/v1/sections/:course_section_id/assignments/:assignment_id/override


Responds with a redirect to the override for the given section, if any (404 otherwise).


---

## Create an assignment overrideAssignmentOverridesController#create


### POST /api/v1/courses/:course_id/assignments/:assignment_id/overrides


One of student_ids, group_id, or course_section_id must be present. At most one should be present; if multiple are present only the most specific (student_ids first, then group_id, then course_section_id) is used and any others are ignored.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| assignment_override[student_ids][] |  | integer | The IDs of the overrideâs target students. If present, the IDs must each identify a user with an active student enrollment in the course that is not already targetted by a different adhoc override. |
| assignment_override[title] |  | string | The title of the adhoc assignment override. Required if student_ids is present, ignored otherwise (the title is set to the name of the targetted group or section instead). |
| assignment_override[group_id] |  | integer | The ID of the overrideâs target group. If present, the following conditions must be met for the override to be successful: the assignment MUST be a group assignment (a group_category_id is assigned to it) the ID must identify an active group in the group set the assignment is in the ID must not be targetted by a different override See Appendix: Group assignments for more info. |
| assignment_override[course_section_id] |  | integer | The ID of the overrideâs target section. If present, must identify an active section of the assignmentâs course not already targetted by a different override. |
| assignment_override[due_at] |  | DateTime | The day/time the overridden assignment is due. Accepts times in ISO 8601 format, e.g. 2014-10-21T18:48:00Z. If absent, this override will not affect due date. May be present but null to indicate the override removes any previous due date. |
| assignment_override[unlock_at] |  | DateTime | The day/time the overridden assignment becomes unlocked. Accepts times in ISO 8601 format, e.g. 2014-10-21T18:48:00Z. If absent, this override will not affect the unlock date. May be present but null to indicate the override removes any previous unlock date. |
| assignment_override[lock_at] |  | DateTime | The day/time the overridden assignment becomes locked. Accepts times in ISO 8601 format, e.g. 2014-10-21T18:48:00Z. If absent, this override will not affect the lock date. May be present but null to indicate the override removes any previous lock date. |


#### Example Request:


```
curl 'https://<canvas>/api/v1/courses/1/assignments/2/overrides.json' \
     -X POST \
     -F 'assignment_override[student_ids][]=8' \
     -F 'assignment_override[title]=Fred Flinstone' \
     -F 'assignment_override[due_at]=2012-10-08T21:00:00Z' \
     -H "Authorization: Bearer <token>"
```


---

## Update an assignment overrideAssignmentOverridesController#update


### PUT /api/v1/courses/:course_id/assignments/:assignment_id/overrides/:id


All current overridden values must be supplied if they are to be retained; e.g. if due_at was overridden, but this PUT omits a value for due_at, due_at will no longer be overridden. If the override is adhoc and student_ids is not supplied, the target override set is unchanged. Target override sets cannot be changed for group or section overrides.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| assignment_override[student_ids][] |  | integer | The IDs of the overrideâs target students. If present, the IDs must each identify a user with an active student enrollment in the course that is not already targetted by a different adhoc override. Ignored unless the override being updated is adhoc. |
| assignment_override[title] |  | string | The title of an adhoc assignment override. Ignored unless the override being updated is adhoc. |
| assignment_override[due_at] |  | DateTime | The day/time the overridden assignment is due. Accepts times in ISO 8601 format, e.g. 2014-10-21T18:48:00Z. If absent, this override will not affect due date. May be present but null to indicate the override removes any previous due date. |
| assignment_override[unlock_at] |  | DateTime | The day/time the overridden assignment becomes unlocked. Accepts times in ISO 8601 format, e.g. 2014-10-21T18:48:00Z. If absent, this override will not affect the unlock date. May be present but null to indicate the override removes any previous unlock date. |
| assignment_override[lock_at] |  | DateTime | The day/time the overridden assignment becomes locked. Accepts times in ISO 8601 format, e.g. 2014-10-21T18:48:00Z. If absent, this override will not affect the lock date. May be present but null to indicate the override removes any previous lock date. |


#### Example Request:


```
curl 'https://<canvas>/api/v1/courses/1/assignments/2/overrides/3.json' \
     -X PUT \
     -F 'assignment_override[title]=Fred Flinstone' \
     -F 'assignment_override[due_at]=2012-10-08T21:00:00Z' \
     -H "Authorization: Bearer <token>"
```


---

## Delete an assignment overrideAssignmentOverridesController#destroy


### DELETE /api/v1/courses/:course_id/assignments/:assignment_id/overrides/:id


Deletes an override and returns its former details.


#### Example Request:


```
curl 'https://<canvas>/api/v1/courses/1/assignments/2/overrides/3.json' \
     -X DELETE \
     -H "Authorization: Bearer <token>"
```


---

## Batch retrieve overrides in a courseAssignmentOverridesController#batch_retrieve


### GET /api/v1/courses/:course_id/assignments/overrides


Returns a list of specified overrides in this course, providing they target sections/groups/students visible to the current user. Returns null elements in the list for requests that were not found.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| assignment_overrides[][id] | Required | string | Ids of overrides to retrieve |
| assignment_overrides[][assignment_id] | Required | string | Ids of assignments for each override |


#### Example Request:


```
curl 'https://<canvas>/api/v1/courses/12/assignments/overrides.json?assignment_overrides[][id]=109&assignment_overrides[][assignment_id]=122&assignment_overrides[][id]=99&assignment_overrides[][assignment_id]=111' \
     -H "Authorization: Bearer <token>"
```


---

## Batch create overrides in a courseAssignmentOverridesController#batch_create


### POST /api/v1/courses/:course_id/assignments/overrides


Creates the specified overrides for each assignment.  Handles creation in a transaction, so all records are created or none are.


One of student_ids, group_id, or course_section_id must be present. At most one should be present; if multiple are present only the most specific (student_ids first, then group_id, then course_section_id) is used and any others are ignored.


Errors are reported in an errors attribute, an array of errors corresponding to inputs.  Global errors will be reported as a single element errors array


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| assignment_overrides[] | Required | AssignmentOverride | Attributes for the new assignment overrides. See Create an assignment override for available attributes |


#### Example Request:


```
curl "https://<canvas>/api/v1/courses/12/assignments/overrides.json" \
     -X POST \
     -F "assignment_overrides[][assignment_id]=109" \
     -F 'assignment_overrides[][student_ids][]=8' \
     -F "assignment_overrides[][title]=foo" \
     -F "assignment_overrides[][assignment_id]=13" \
     -F "assignment_overrides[][course_section_id]=200" \
     -F "assignment_overrides[][due_at]=2012-10-08T21:00:00Z" \
     -H "Authorization: Bearer <token>"
```


---

## Batch update overrides in a courseAssignmentOverridesController#batch_update


### PUT /api/v1/courses/:course_id/assignments/overrides


Updates a list of specified overrides for each assignment.  Handles overrides in a transaction, so either all updates are applied or none. See Update an assignment override for available attributes.


All current overridden values must be supplied if they are to be retained; e.g. if due_at was overridden, but this PUT omits a value for due_at, due_at will no longer be overridden. If the override is adhoc and student_ids is not supplied, the target override set is unchanged. Target override sets cannot be changed for group or section overrides.


Errors are reported in an errors attribute, an array of errors corresponding to inputs.  Global errors will be reported as a single element errors array


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| assignment_overrides[] | Required | AssignmentOverride | Attributes for the updated overrides. |


#### Example Request:


```
curl "https://<canvas>/api/v1/courses/12/assignments/overrides.json" \
     -X PUT \
     -F "assignment_overrides[][id]=122" \
     -F "assignment_overrides[][assignment_id]=109" \
     -F "assignment_overrides[][title]=foo" \
     -F "assignment_overrides[][id]=993" \
     -F "assignment_overrides[][assignment_id]=13" \
     -F "assignment_overrides[][due_at]=2012-10-08T21:00:00Z" \
     -H "Authorization: Bearer <token>"
```
