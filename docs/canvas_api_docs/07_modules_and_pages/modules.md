# Modules

> Canvas API — Modules & Pages  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List modulesContextModulesApiController#index


### GET /api/v1/courses/:course_id/modules


A paginated list of the modules in a course


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| include[] |  | string | âitemsâ: Return module items inline if possible. This parameter suggests that Canvas return module items directly in the Module object JSON, to avoid having to make separate API requests for each module when enumerating modules and items. Canvas is free to omit âitemsâ for any particular module if it deems them too numerous to return inline. Callers must be prepared to use the List Module Items API if items are not returned. âcontent_detailsâ: Requires âitemsâ. Returns additional details with module items specific to their associated content items. Includes standard lock information for each item. Allowed values: items , content_details |
| search_term |  | string | The partial name of the modules (and module items, if âitemsâ is specified with include[]) to match and return. |
| student_id |  | string | Returns module completion information for the student with this id. |


#### Example Request:


```
curl -H 'Authorization: Bearer <token>' \
     https://<canvas>/api/v1/courses/222/modules
```


---

## Show moduleContextModulesApiController#show


### GET /api/v1/courses/:course_id/modules/:id


Get information about a single module


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| include[] |  | string | âitemsâ: Return module items inline if possible. This parameter suggests that Canvas return module items directly in the Module object JSON, to avoid having to make separate API requests for each module when enumerating modules and items. Canvas is free to omit âitemsâ for any particular module if it deems them too numerous to return inline. Callers must be prepared to use the List Module Items API if items are not returned. âcontent_detailsâ: Requires âitemsâ. Returns additional details with module items specific to their associated content items. Includes standard lock information for each item. Allowed values: items , content_details |
| student_id |  | string | Returns module completion information for the student with this id. |


#### Example Request:


```
curl -H 'Authorization: Bearer <token>' \
     https://<canvas>/api/v1/courses/222/modules/123
```


---

## Create a moduleContextModulesApiController#create


### POST /api/v1/courses/:course_id/modules


Create and return a new module


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| module[name] | Required | string | The name of the module |
| module[unlock_at] |  | DateTime | The date the module will unlock |
| module[position] |  | integer | The position of this module in the course (1-based) |
| module[require_sequential_progress] |  | boolean | Whether module items must be unlocked in order |
| module[prerequisite_module_ids][] |  | string | IDs of Modules that must be completed before this one is unlocked. Prerequisite modules must precede this module (i.e. have a lower position value), otherwise they will be ignored |
| module[publish_final_grade] |  | boolean | Whether to publish the studentâs final grade for the course upon completion of this module. |


#### Example Request:


```
curl https://<canvas>/api/v1/courses/<course_id>/modules \
  -X POST \
  -H 'Authorization: Bearer <token>' \
  -d 'module[name]=module' \
  -d 'module[position]=2' \
  -d 'module[prerequisite_module_ids][]=121' \
  -d 'module[prerequisite_module_ids][]=122'
```


---

## Update a moduleContextModulesApiController#update


### PUT /api/v1/courses/:course_id/modules/:id


Update and return an existing module


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| module[name] |  | string | The name of the module |
| module[unlock_at] |  | DateTime | The date the module will unlock |
| module[position] |  | integer | The position of the module in the course (1-based) |
| module[require_sequential_progress] |  | boolean | Whether module items must be unlocked in order |
| module[prerequisite_module_ids][] |  | string | IDs of Modules that must be completed before this one is unlocked Prerequisite modules must precede this module (i.e. have a lower position value), otherwise they will be ignored |
| module[publish_final_grade] |  | boolean | Whether to publish the studentâs final grade for the course upon completion of this module. |
| module[published] |  | boolean | Whether the module is published and visible to students |


#### Example Request:


```
curl https://<canvas>/api/v1/courses/<course_id>/modules/<module_id> \
  -X PUT \
  -H 'Authorization: Bearer <token>' \
  -d 'module[name]=module' \
  -d 'module[position]=2' \
  -d 'module[prerequisite_module_ids][]=121' \
  -d 'module[prerequisite_module_ids][]=122'
```


---

## Delete moduleContextModulesApiController#destroy


### DELETE /api/v1/courses/:course_id/modules/:id


Delete a module


#### Example Request:


```
curl https://<canvas>/api/v1/courses/<course_id>/modules/<module_id> \
  -X Delete \
  -H 'Authorization: Bearer <token>'
```


---

## Re-lock module progressionsContextModulesApiController#relock


### PUT /api/v1/courses/:course_id/modules/:id/relock


Resets module progressions to their default locked state and recalculates them based on the current requirements.


Adding progression requirements to an active course will not lock students out of modules they have already unlocked unless this action is called.


#### Example Request:


```
curl https://<canvas>/api/v1/courses/<course_id>/modules/<module_id>/relock \
  -X PUT \
  -H 'Authorization: Bearer <token>'
```
