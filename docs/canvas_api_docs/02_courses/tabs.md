# Tabs

> Canvas API — Courses  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List available tabs for a course or groupTabsController#index


### GET /api/v1/accounts/:account_id/tabs


### GET /api/v1/courses/:course_id/tabs


### GET /api/v1/groups/:group_id/tabs


### GET /api/v1/users/:user_id/tabs


Returns a paginated list of navigation tabs available in the current context.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| include[] |  | string | âcourse_subject_tabsâ: Optional flag to return the tabs associated with a canvas_for_elementary subject courseâs home page instead of the typical sidebar navigation. Only takes effect if this request is for a course context in a canvas_for_elementary-enabled account or sub-account. Allowed values: course_subject_tabs |


#### Example Request:


```
curl -H 'Authorization: Bearer <token>' \
     https://<canvas>/api/v1/groups/<group_id>/tabs"
```


#### Example Response:


```
[
  {
    "html_url": "/courses/1",
    "id": "home",
    "label": "Home",
    "position": 1,
    "visibility": "public",
    "type": "internal"
  },
  {
    "html_url": "/courses/1/external_tools/4",
    "id": "context_external_tool_4",
    "label": "WordPress",
    "hidden": true,
    "visibility": "public",
    "position": 2,
    "type": "external"
  },
  {
    "html_url": "https://example.com/resource",
    "id": "nav_menu_link_5",
    "label": "External Resource",
    "position": 3,
    "visibility": "public",
    "type": "external"
  },
  {
    "html_url": "/courses/1/grades",
    "id": "grades",
    "label": "Grades",
    "position": 4,
    "hidden": true
    "visibility": "admins"
    "type": "internal"
  }
]
```


---

## Update a tab for a courseTabsController#update


### PUT /api/v1/courses/:course_id/tabs/:tab_id


Home and Settings tabs are not manageable, and canât be hidden or moved


Returns a tab object


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| position |  | integer | The new position of the tab, 1-based |
| hidden |  | boolean | no description |


#### Example Request:


```
curl https://<canvas>/api/v1/courses/<course_id>/tabs/tab_id \
  -X PUT \
  -H 'Authorization: Bearer <token>' \
  -d 'hidden=true' \
  -d 'position=2' // 1 based
```
