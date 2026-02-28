# Group Categories

> Canvas API — Users & Groups  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List group categories for a contextGroupCategoriesController#index


### GET /api/v1/accounts/:account_id/group_categories


### GET /api/v1/courses/:course_id/group_categories


Returns a paginated list of group categories in a context. The list returned depends on the permissions of the current user and the specified collaboration state.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| collaboration_state |  | string | Filter group categories by their collaboration state: âallâ: Return both collaborative and non-collaborative group categories âcollaborativeâ: Return only collaborative group categories (default) ânon_collaborativeâ: Return only non-collaborative group categories |


#### Example Request:


```
curl https://<canvas>/api/v1/accounts/<account_id>/group_categories \
     -H 'Authorization: Bearer <token>' \
     -d 'collaboration_state=all'
```


---

## Get a single group categoryGroupCategoriesController#show


### GET /api/v1/group_categories/:group_category_id


Returns the data for a single group category, or a 401 if the caller doesnât have the rights to see it.


#### Example Request:


```
curl https://<canvas>/api/v1/group_categories/<group_category_id> \
     -H 'Authorization: Bearer <token>'
```


---

## Create a Group CategoryGroupCategoriesController#create


### POST /api/v1/accounts/:account_id/group_categories


### POST /api/v1/courses/:course_id/group_categories


Create a new group category


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| name | Required | string | Name of the group category |
| non_collaborative |  | boolean | Can only be set by users with the Differentiation Tag - Add permission If set to true, groups in this category will be only be visible to users with the Differentiation Tag - Manage permission. |
| self_signup |  | string | Allow students to sign up for a group themselves (Course Only). valid values are: âenabledâ allows students to self sign up for any group in course ârestrictedâ allows students to self sign up only for groups in the same section null disallows self sign up Allowed values: enabled , restricted |
| auto_leader |  | string | Assigns group leaders automatically when generating and allocating students to groups Valid values are: âfirstâ the first student to be allocated to a group is the leader ârandomâ a random student from all members is chosen as the leader Allowed values: first , random |
| group_limit |  | integer | Limit the maximum number of users in each group (Course Only). Requires self signup. |
| sis_group_category_id |  | string | The unique SIS identifier. |
| create_group_count |  | integer | Create this number of groups (Course Only). |
| split_group_count |  | string | (Deprecated) Create this number of groups, and evenly distribute students among them. not allowed with âenable_self_signupâ. because the group assignment happens synchronously, itâs recommended that you instead use the assign_unassigned_members endpoint. (Course Only) |


#### Example Request:


```
curl htps://<canvas>/api/v1/courses/<course_id>/group_categories \
    -F 'name=Project Groups' \
    -H 'Authorization: Bearer <token>'
```


---

## Bulk manage differentiation tagsGroupCategoriesController#bulk_manage_differentiation_tag


### POST /api/v1/courses/:course_id/group_categories/bulk_manage_differentiation_tag


This API is only meant for Groups and GroupCategories where non_collaborative is true.


Perform bulk operations on groups within a group category, or create a new group category along with the groups in one transaction. If creation of the GroupCategory or any Group fails, the entire operation will be rolled back.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| operations | Required | Hash | A hash containing arrays of create/update/delete operations: { "create": [   { "name": "New Group A" },   { "name": "New Group B" } ], "update": [   { "id": 123, "name": "Updated Group Name A" },   { "id": 456, "name": "Updated Group Name B" } ], "delete": [   { "id": 789 },   { "id": 101 } ] } |
| group_category | Required | Hash | Attributes for the GroupCategory. May include: - id [Optional, Integer]: The ID of an existing GroupCategory. - name [Optional, String]: A new name for the GroupCategory. If provided with an ID, the category name will be updated. |


#### Example Request:


```
curl https://<canvas>/api/v1/courses/:course_id/group_categories/bulk_manage_differentiation_tag \
     -X POST \
     -H 'Authorization: Bearer <token>' \
     -H 'Content-Type: application/json' \
     -d '{
           "operations": {
             "create": [{"name": "New Group"}],
             "update": [{"id": 123, "name": "Updated Group"}],
             "delete": [{"id": 456}]
           },
           "group_category": {"id": 1, "name": "New Category Name"}
         }'
```


---

## Import differentiation tagsGroupCategoriesController#import_tags


### POST /api/v1/courses/:course_id/group_categories/import_tags


Create Differentiation Tags through a CSV import


For more information on the format thatâs expected here, please see the âDifferentiation Tag CSVâ section in the API docs.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| attachment |  | string | There are two ways to post differentiation tag import data - either via a multipart/form-data form-field-style attachment, or via a non-multipart raw post request. âattachmentâ is required for multipart/form-data style posts. Assumed to be tag data from a file upload form field named âattachmentâ. Examples: curl -F attachment=@<filename> -H "Authorization: Bearer <token>" \     'https://<canvas>/api/v1/group_categories/import_tags' If you decide to do a raw post, you can skip the âattachmentâ argument, but you will then be required to provide a suitable Content-Type header. You are encouraged to also provide the âextensionâ argument. Examples: curl -H 'Content-Type: text/csv' --data-binary @<filename>.csv \     -H "Authorization: Bearer <token>" \     'https://<canvas>/api/v1/group_categories_tags' |


#### Example Response:


```
# Progress (default)
{
    "completion": 0,
    "context_id": 20,
    "context_type": "Course",
    "created_at": "2013-07-05T10:57:48-06:00",
    "id": 2,
    "message": null,
    "tag": "course_tag_import",
    "updated_at": "2013-07-05T10:57:48-06:00",
    "user_id": null,
    "workflow_state": "running",
    "url": "http://localhost:3000/api/v1/progress/2"
}
```


---

## Import category groupsGroupCategoriesController#import


### POST /api/v1/group_categories/:group_category_id/import


Create Groups in a Group Category through a CSV import


For more information on the format thatâs expected here, please see the âGroup Category CSVâ section in the API docs.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| attachment |  | string | There are two ways to post group category import data - either via a multipart/form-data form-field-style attachment, or via a non-multipart raw post request. âattachmentâ is required for multipart/form-data style posts. Assumed to be outcome data from a file upload form field named âattachmentâ. Examples: curl -F attachment=@<filename> -H "Authorization: Bearer <token>" \     'https://<canvas>/api/v1/group_categories/<category_id>/import' If you decide to do a raw post, you can skip the âattachmentâ argument, but you will then be required to provide a suitable Content-Type header. You are encouraged to also provide the âextensionâ argument. Examples: curl -H 'Content-Type: text/csv' --data-binary @<filename>.csv \     -H "Authorization: Bearer <token>" \     'https://<canvas>/api/v1/group_categories/<category_id>/import' |


#### Example Response:


```
# Progress (default)
{
    "completion": 0,
    "context_id": 20,
    "context_type": "GroupCategory",
    "created_at": "2013-07-05T10:57:48-06:00",
    "id": 2,
    "message": null,
    "tag": "course_group_import",
    "updated_at": "2013-07-05T10:57:48-06:00",
    "user_id": null,
    "workflow_state": "running",
    "url": "http://localhost:3000/api/v1/progress/2"
}
```


---

## Update a Group CategoryGroupCategoriesController#update


### PUT /api/v1/group_categories/:group_category_id


Modifies an existing group category.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| name |  | string | Name of the group category |
| self_signup |  | string | Allow students to sign up for a group themselves (Course Only). Valid values are: âenabledâ allows students to self sign up for any group in course ârestrictedâ allows students to self sign up only for groups in the same section null disallows self sign up Allowed values: enabled , restricted |
| auto_leader |  | string | Assigns group leaders automatically when generating and allocating students to groups Valid values are: âfirstâ the first student to be allocated to a group is the leader ârandomâ a random student from all members is chosen as the leader Allowed values: first , random |
| group_limit |  | integer | Limit the maximum number of users in each group (Course Only). Requires self signup. |
| sis_group_category_id |  | string | The unique SIS identifier. |
| create_group_count |  | integer | Create this number of groups (Course Only). |
| split_group_count |  | string | (Deprecated) Create this number of groups, and evenly distribute students among them. not allowed with âenable_self_signupâ. because the group assignment happens synchronously, itâs recommended that you instead use the assign_unassigned_members endpoint. (Course Only) |


#### Example Request:


```
curl https://<canvas>/api/v1/group_categories/<group_category_id> \
    -X PUT \
    -F 'name=Project Groups' \
    -H 'Authorization: Bearer <token>'
```


---

## Delete a Group CategoryGroupCategoriesController#destroy


### DELETE /api/v1/group_categories/:group_category_id


Deletes a group category and all groups under it. Protected group categories can not be deleted, i.e. âcommunitiesâ and âstudent_organizedâ.


#### Example Request:


```
curl https://<canvas>/api/v1/group_categories/<group_category_id> \
      -X DELETE \
      -H 'Authorization: Bearer <token>'
```


---

## List groups in group categoryGroupCategoriesController#groups


### GET /api/v1/group_categories/:group_category_id/groups


Returns a paginated list of groups in a group category


#### Example Request:


```
curl https://<canvas>/api/v1/group_categories/<group_cateogry_id>/groups \
     -H 'Authorization: Bearer <token>'
```


---

## export groups in and users in categoryGroupCategoriesController#export


### BETA: This API endpoint is not finalized, and there could be breaking changes before its final release.


### GET /api/v1/group_categories/:group_category_id/export


Returns a csv file of users in format ready to import.


#### Example Request:


```
curl https://<canvas>/api/v1/group_categories/<group_category_id>/export \
     -H 'Authorization: Bearer <token>'
```


---

## export tags and users in courseGroupCategoriesController#export_tags


### BETA: This API endpoint is not finalized, and there could be breaking changes before its final release.


### GET /api/v1/courses/:course_id/group_categories/export_tags


Returns a csv file of users in format ready to import.


#### Example Request:


```
curl https://<canvas>/api/v1/group_categories/export_tags \
     -H 'Authorization: Bearer <token>'
```


---

## List users in group categoryGroupCategoriesController#users


### GET /api/v1/group_categories/:group_category_id/users


Returns a paginated list of users in the group category.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| search_term |  | string | The partial name or full ID of the users to match and return in the results list. Must be at least 3 characters. |
| unassigned |  | boolean | Set this value to true if you wish only to search unassigned users in the group category. |


#### Example Request:


```
curl https://<canvas>/api/v1/group_categories/1/users \
     -H 'Authorization: Bearer <token>'
```


---

## Assign unassigned membersGroupCategoriesController#assign_unassigned_members


### POST /api/v1/group_categories/:group_category_id/assign_unassigned_members


Assign all unassigned members as evenly as possible among the existing student groups.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| sync |  | boolean | The assigning is done asynchronously by default. If you would like to override this and have the assigning done synchronously, set this value to true. |


#### Example Request:


```
curl https://<canvas>/api/v1/group_categories/1/assign_unassigned_members \
     -H 'Authorization: Bearer <token>'
```


#### Example Response:


```
# Progress (default)
{
    "completion": 0,
    "context_id": 20,
    "context_type": "GroupCategory",
    "created_at": "2013-07-05T10:57:48-06:00",
    "id": 2,
    "message": null,
    "tag": "assign_unassigned_members",
    "updated_at": "2013-07-05T10:57:48-06:00",
    "user_id": null,
    "workflow_state": "running",
    "url": "http://localhost:3000/api/v1/progress/2"
}
```


```
# New Group Memberships (when sync = true)
[
  {
    "id": 65,
    "new_members": [
      {
        "user_id": 2,
        "name": "Sam",
        "display_name": "Sam",
        "sections": [
          {
            "section_id": 1,
            "section_code": "Section 1"
          }
        ]
      },
      {
        "user_id": 3,
        "name": "Sue",
        "display_name": "Sue",
        "sections": [
          {
            "section_id": 2,
            "section_code": "Section 2"
          }
        ]
      }
    ]
  },
  {
    "id": 66,
    "new_members": [
      {
        "user_id": 5,
        "name": "Joe",
        "display_name": "Joe",
        "sections": [
          {
            "section_id": 2,
            "section_code": "Section 2"
          }
        ]
      },
      {
        "user_id": 11,
        "name": "Cecil",
        "display_name": "Cecil",
        "sections": [
          {
            "section_id": 3,
            "section_code": "Section 3"
          }
        ]
      }
    ]
  }
]
```
