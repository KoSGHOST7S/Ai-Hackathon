# Lti Line Items

> Canvas API — Assignments & Grades  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Create a Line ItemLti::Ims::LineItemsController#create


### POST /api/lti/courses/:course_id/line_items


Create a new Line Item


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| scoreMaximum | Required | number | The maximum score for the line item. Scores created for the Line Item may exceed this value. |
| label | Required | string | The label for the Line Item. If no resourceLinkId is specified this value will also be used as the name of the placeholder assignment. |
| resourceId |  | string | A Tool Provider specified id for the Line Item. Multiple line items may share the same resourceId within a given context. |
| tag |  | string | A value used to qualify a line Item beyond its ids. Line Items may be queried by this value in the List endpoint. Multiple line items can share the same tag within a given context. |
| resourceLinkId |  | string | The resource link id the Line Item should be attached to. This value should match the LTI id of the Canvas assignment associated with the tool. |
| startDateTime |  | string | The ISO8601 date and time when the line item is made available. Corresponds to the assignmentâs unlock_at date. |
| endDateTime |  | string | The ISO8601 date and time when the line item stops receiving submissions. Corresponds to the assignmentâs due_at date. |
| https://canvas.instructure.com/lti/submission_type |  | object | (EXTENSION) - Optional block to set Assignment Submission Type when creating a new assignment is created. type - ânoneâ or âexternal_toolâ external_tool_url - Submission URL only used when type: âexternal_toolâ |


#### Example Request:


```
{
  "scoreMaximum": 100.0,
  "label": "LineItemLabel1",
  "resourceId": 1,
  "tag": "MyTag",
  "resourceLinkId": "1",
  "startDateTime": "2022-01-31T22:23:11+0000",
  "endDateTime": "2022-02-07T22:23:11+0000",
  "https://canvas.instructure.com/lti/submission_type": {
    "type": "external_tool",
    "external_tool_url": "https://my.launch.url"
  }
}
```


---

## Update a Line ItemLti::Ims::LineItemsController#update


### PUT /api/lti/courses/:course_id/line_items/:id


Update new Line Item


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| scoreMaximum |  | number | The maximum score for the line item. Scores created for the Line Item may exceed this value. |
| label |  | string | The label for the Line Item. If no resourceLinkId is specified this value will also be used as the name of the placeholder assignment. |
| resourceId |  | string | A Tool Provider specified id for the Line Item. Multiple line items may share the same resourceId within a given context. |
| tag |  | string | A value used to qualify a line Item beyond its ids. Line Items may be queried by this value in the List endpoint. Multiple line items can share the same tag within a given context. |
| startDateTime |  | string | The ISO8601 date and time when the line item is made available. Corresponds to the assignmentâs unlock_at date. |
| endDateTime |  | string | The ISO8601 date and time when the line item stops receiving submissions. Corresponds to the assignmentâs due_at date. |


---

## Show a Line ItemLti::Ims::LineItemsController#show


### GET /api/lti/courses/:course_id/line_items/:id


Show existing Line Item


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| include[] |  | string | Array of additional information to include. âlaunch_urlâ includes the launch URL for this line item using the âhttps://canvas.instructure.com/lti/launch_urlâ extension Allowed values: launch_url |


---

## List line ItemsLti::Ims::LineItemsController#index


### GET /api/lti/courses/:course_id/line_items


List all Line Items for a course


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| tag |  | string | If specified only Line Items with this tag will be included. |
| resource_id |  | string | If specified only Line Items with this resource_id will be included. |
| resource_link_id |  | string | If specified only Line Items attached to the specified resource_link_id will be included. |
| limit |  | string | May be used to limit the number of Line Items returned in a page |
| include[] |  | string | Array of additional information to include. âlaunch_urlâ includes the launch URL for each line item using the âhttps://canvas.instructure.com/lti/launch_urlâ extension Allowed values: launch_url |


---

## Delete a Line ItemLti::Ims::LineItemsController#destroy


### DELETE /api/lti/courses/:course_id/line_items/:id


Delete an existing Line Item
