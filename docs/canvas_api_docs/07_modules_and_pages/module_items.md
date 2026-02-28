# Module Items

> Canvas API — Modules & Pages  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List module itemsContextModuleItemsApiController#index


### GET /api/v1/courses/:course_id/modules/:module_id/items


A paginated list of the items in a module


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| include[] |  | string | If included, will return additional details specific to the content associated with each item. Refer to the Module Item specification for more details. Includes standard lock information for each item. Allowed values: content_details |
| search_term |  | string | The partial title of the items to match and return. |
| student_id |  | string | Returns module completion information for the student with this id. |


#### Example Request:


```
curl -H 'Authorization: Bearer <token>' \
     https://<canvas>/api/v1/courses/222/modules/123/items
```


---

## Show module itemContextModuleItemsApiController#show


### GET /api/v1/courses/:course_id/modules/:module_id/items/:id


Get information about a single module item


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| include[] |  | string | If included, will return additional details specific to the content associated with this item. Refer to the Module Item specification for more details. Includes standard lock information for each item. Allowed values: content_details |
| student_id |  | string | Returns module completion information for the student with this id. |


#### Example Request:


```
curl -H 'Authorization: Bearer <token>' \
     https://<canvas>/api/v1/courses/222/modules/123/items/768
```


---

## Create a module itemContextModuleItemsApiController#create


### POST /api/v1/courses/:course_id/modules/:module_id/items


Create and return a new module item


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| module_item[title] |  | string | The name of the module item and associated content |
| module_item[type] | Required | string | The type of content linked to the item Allowed values: File , Page , Discussion , Assignment , Quiz , SubHeader , ExternalUrl , ExternalTool |
| module_item[content_id] | Required | string | The id of the content to link to the module item. Required, except for âExternalUrlâ, âPageâ, and âSubHeaderâ types. |
| module_item[position] |  | integer | The position of this item in the module (1-based). |
| module_item[indent] |  | integer | 0-based indent level; module items may be indented to show a hierarchy |
| module_item[page_url] |  | string | Suffix for the linked wiki page (e.g. âfront-pageâ). Required for âPageâ type. |
| module_item[external_url] |  | string | External url that the item points to. [Required for âExternalUrlâ and âExternalToolâ types. |
| module_item[new_tab] |  | boolean | Whether the external tool opens in a new tab. Only applies to âExternalToolâ type. |
| module_item[completion_requirement][type] |  | string | Completion requirement for this module item. âmust_viewâ: Applies to all item types âmust_contributeâ: Only applies to âAssignmentâ, âDiscussionâ, and âPageâ types âmust_submitâ, âmin_scoreâ: Only apply to âAssignmentâ and âQuizâ types âmust_mark_doneâ: Only applies to âAssignmentâ and âPageâ types Inapplicable types will be ignored Allowed values: must_view , must_contribute , must_submit , must_mark_done |
| module_item[completion_requirement][min_score] |  | integer | Minimum score required to complete. Required for completion_requirement type âmin_scoreâ. |
| module_item[iframe][width] |  | integer | Width of the ExternalTool on launch |
| module_item[iframe][height] |  | integer | Height of the ExternalTool on launch |


#### Example Request:


```
curl https://<canvas>/api/v1/courses/<course_id>/modules/<module_id>/items \
  -X POST \
  -H 'Authorization: Bearer <token>' \
  -d 'module_item[title]=module item' \
  -d 'module_item[type]=ExternalTool' \
  -d 'module_item[content_id]=10' \
  -d 'module_item[position]=2' \
  -d 'module_item[indent]=1' \
  -d 'module_item[new_tab]=true' \
  -d 'module_item[iframe][width]=300' \
  -d 'module_item[iframe][height]=200'
```


---

## Update a module itemContextModuleItemsApiController#update


### PUT /api/v1/courses/:course_id/modules/:module_id/items/:id


Update and return an existing module item


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| module_item[title] |  | string | The name of the module item |
| module_item[position] |  | integer | The position of this item in the module (1-based) |
| module_item[indent] |  | integer | 0-based indent level; module items may be indented to show a hierarchy |
| module_item[external_url] |  | string | External url that the item points to. Only applies to âExternalUrlâ type. |
| module_item[new_tab] |  | boolean | Whether the external tool opens in a new tab. Only applies to âExternalToolâ type. |
| module_item[completion_requirement][type] |  | string | Completion requirement for this module item. âmust_viewâ: Applies to all item types âmust_contributeâ: Only applies to âAssignmentâ, âDiscussionâ, and âPageâ types âmust_submitâ, âmin_scoreâ: Only apply to âAssignmentâ and âQuizâ types âmust_mark_doneâ: Only applies to âAssignmentâ and âPageâ types Inapplicable types will be ignored Allowed values: must_view , must_contribute , must_submit , must_mark_done |
| module_item[completion_requirement][min_score] |  | integer | Minimum score required to complete, Required for completion_requirement type âmin_scoreâ. |
| module_item[published] |  | boolean | Whether the module item is published and visible to students. |
| module_item[module_id] |  | string | Move this item to another module by specifying the target module id here. The target module must be in the same course. |


#### Example Request:


```
curl https://<canvas>/api/v1/courses/<course_id>/modules/<module_id>/items/<item_id> \
  -X PUT \
  -H 'Authorization: Bearer <token>' \
  -d 'module_item[position]=2' \
  -d 'module_item[indent]=1' \
  -d 'module_item[new_tab]=true'
```


---

## Select a mastery pathContextModuleItemsApiController#select_mastery_path


### POST /api/v1/courses/:course_id/modules/:module_id/items/:id/select_mastery_path


Select a mastery path when module item includes several possible paths. Requires Mastery Paths feature to be enabled.  Returns a compound document with the assignments included in the given path and any module items related to those assignments


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| assignment_set_id |  | string | Assignment set chosen, as specified in the mastery_paths portion of the context module item response |
| student_id |  | string | Which student the selection applies to.  If not specified, current user is implied. |


#### Example Request:


```
curl https://<canvas>/api/v1/courses/<course_id>/modules/<module_id>/items/<item_id>/select_master_path \
  -X POST \
  -H 'Authorization: Bearer <token>' \
  -d 'assignment_set_id=2992'
```


---

## Delete module itemContextModuleItemsApiController#destroy


### DELETE /api/v1/courses/:course_id/modules/:module_id/items/:id


Delete a module item


#### Example Request:


```
curl https://<canvas>/api/v1/courses/<course_id>/modules/<module_id>/items/<item_id> \
  -X Delete \
  -H 'Authorization: Bearer <token>'
```


---

## Mark module item as done/not doneContextModuleItemsApiController#mark_as_done


### PUT /api/v1/courses/:course_id/modules/:module_id/items/:id/done


Mark a module item as done/not done. Use HTTP method PUT to mark as done, and DELETE to mark as not done.


#### Example Request:


```
curl https://<canvas>/api/v1/courses/<course_id>/modules/<module_id>/items/<item_id>/done \
  -X Put \
  -H 'Authorization: Bearer <token>'
```


---

## Get module item sequenceContextModuleItemsApiController#item_sequence


### GET /api/v1/courses/:course_id/module_item_sequence


Given an asset in a course, find the ModuleItem it belongs to, the previous and next Module Items in the course sequence, and also any applicable mastery path rules


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| asset_type |  | string | The type of asset to find module sequence information for. Use the ModuleItem if it is known (e.g., the user navigated from a module item), since this will avoid ambiguity if the asset appears more than once in the module sequence. Allowed values: ModuleItem , File , Page , Discussion , Assignment , Quiz , ExternalTool |
| asset_id |  | integer | The id of the asset (or the url in the case of a Page) |


#### Example Request:


```
curl https://<canvas>/api/v1/courses/<course_id>/module_item_sequence?asset_type=Assignment&asset_id=123 \
  -H 'Authorization: Bearer <token>'
```


---

## Mark module item readContextModuleItemsApiController#mark_item_read


### POST /api/v1/courses/:course_id/modules/:module_id/items/:id/mark_read


Fulfills âmust viewâ requirement for a module item. It is generally not necessary to do this explicitly, but it is provided for applications that need to access external content directly (bypassing the html_url redirect that normally allows Canvas to fulfill âmust viewâ requirements).


This endpoint cannot be used to complete requirements on locked or unpublished module items.


#### Example Request:


```
curl https://<canvas>/api/v1/courses/<course_id>/modules/<module_id>/items/<item_id>/mark_read \
  -X POST \
  -H 'Authorization: Bearer <token>'
```
