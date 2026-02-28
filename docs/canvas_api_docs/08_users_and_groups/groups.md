# Groups

> Canvas API — Users & Groups  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List your groupsGroupsController#index


### GET /api/v1/users/self/groups


Returns a paginated list of active groups for the current user.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| context_type |  | string | Only include groups that are in this type of context. Allowed values: Account , Course |
| include[] |  | string | âtabsâ: Include the list of tabs configured for each group.  See the List available tabs API for more information. Allowed values: tabs |


#### Example Request:


```
curl https://<canvas>/api/v1/users/self/groups?context_type=Account \
     -H 'Authorization: Bearer <token>'
```


---

## List the groups available in a context.GroupsController#context_index


### GET /api/v1/accounts/:account_id/groups


### GET /api/v1/courses/:course_id/groups


Returns the paginated list of active groups in the given context that are visible to user.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| only_own_groups |  | boolean | Will only include groups that the user belongs to if this is set |
| include[] |  | string | âtabsâ: Include the list of tabs configured for each group.  See the List available tabs API for more information. Allowed values: tabs |
| collaboration_state |  | string | Filter groups by their collaboration state: âallâ: Return both collaborative and non-collaborative groups âcollaborativeâ: Return only collaborative groups (default) ânon_collaborativeâ: Return only non-collaborative groups |


#### Example Request:


```
curl https://<canvas>/api/v1/courses/1/groups \
     -H 'Authorization: Bearer <token>'
```


---

## Bulk fetch user tags for multiple users in a courseGroupsController#bulk_user_tags


### GET /api/v1/courses/:course_id/bulk_user_tags


Returns a mapping of user IDs to arrays of non-collaborative group (tag) IDs for each user in the given course.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| course_id |  | integer | The ID of the course context (from the route). |
| user_ids[] |  | integer | An array of user IDs to fetch tags for. |


#### Example Request:


```
curl "https://<canvas>/api/v1/courses/1/bulk_user_tags?user_ids[]=35&user_ids[]=79" \
     -H 'Authorization: Bearer <token>'
```


---

## Get a single groupGroupsController#show


### GET /api/v1/groups/:group_id


Returns the data for a single group, or a 401 if the caller doesnât have the rights to see it.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| include[] |  | string | âpermissionsâ: Include permissions the current user has for the group. âtabsâ: Include the list of tabs configured for each group.  See the List available tabs API for more information. Allowed values: permissions , tabs |


#### Example Request:


```
curl https://<canvas>/api/v1/groups/<group_id> \
     -H 'Authorization: Bearer <token>'
```


---

## Create a groupGroupsController#create


### POST /api/v1/groups


### POST /api/v1/group_categories/:group_category_id/groups


Creates a new group. Groups created using the â/api/v1/groups/â endpoint will be community groups.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| name |  | string | The name of the group |
| description |  | string | A description of the group |
| is_public |  | boolean | whether the group is public (applies only to community groups) |
| join_level |  | string | no description Allowed values: parent_context_auto_join , parent_context_request , invitation_only |
| storage_quota_mb |  | integer | The allowed file storage for the group, in megabytes. This parameter is ignored if the caller does not have the manage_storage_quotas permission. |
| sis_group_id |  | string | The sis ID of the group. Must have manage_sis permission to set. |


#### Example Request:


```
curl https://<canvas>/api/v1/groups \
     -F 'name=Math Teachers' \
     -F 'description=A place to gather resources for our classes.' \
     -F 'is_public=true' \
     -F 'join_level=parent_context_auto_join' \
     -H 'Authorization: Bearer <token>'
```


---

## Edit a groupGroupsController#update


### PUT /api/v1/groups/:group_id


Modifies an existing group.  Note that to set an avatar image for the group, you must first upload the image file to the group, and the use the id in the response as the argument to this function.  See the File Upload Documentation for details on the file upload workflow.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| name |  | string | The name of the group |
| description |  | string | A description of the group |
| is_public |  | boolean | Whether the group is public (applies only to community groups). Currently you cannot set a group back to private once it has been made public. |
| join_level |  | string | no description Allowed values: parent_context_auto_join , parent_context_request , invitation_only |
| avatar_id |  | integer | The id of the attachment previously uploaded to the group that you would like to use as the avatar image for this group. |
| storage_quota_mb |  | integer | The allowed file storage for the group, in megabytes. This parameter is ignored if the caller does not have the manage_storage_quotas permission. |
| members[] |  | string | An array of user ids for users you would like in the group. Users not in the group will be sent invitations. Existing group members who arenât in the list will be removed from the group. |
| sis_group_id |  | string | The sis ID of the group. Must have manage_sis permission to set. |
| override_sis_stickiness |  | boolean | Default is true. If false, any fields containing âstickyâ changes will not be updated. See SIS CSV Format documentation for information on which fields can have SIS stickiness |


#### Example Request:


```
curl https://<canvas>/api/v1/groups/<group_id> \
     -X PUT \
     -F 'name=Algebra Teachers' \
     -F 'join_level=parent_context_request' \
     -H 'Authorization: Bearer <token>'
```


---

## Delete a groupGroupsController#destroy


### DELETE /api/v1/groups/:group_id


Deletes a group and removes all members.


#### Example Request:


```
curl https://<canvas>/api/v1/groups/<group_id> \
     -X DELETE \
     -H 'Authorization: Bearer <token>'
```


---

## Invite others to a groupGroupsController#invite


### POST /api/v1/groups/:group_id/invite


Sends an invitation to all supplied email addresses which will allow the receivers to join the group.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| invitees[] | Required | string | An array of email addresses to be sent invitations. |


#### Example Request:


```
curl https://<canvas>/api/v1/groups/<group_id>/invite \
     -F 'invitees[]=leonard@example.com' \
     -F 'invitees[]=sheldon@example.com' \
     -H 'Authorization: Bearer <token>'
```


---

## List group's usersGroupsController#users


### GET /api/v1/groups/:group_id/users


Returns a paginated list of users in the group.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| search_term |  | string | The partial name or full ID of the users to match and return in the results list. Must be at least 2 characters. |
| include[] |  | string | âavatar_urlâ: Include usersâ avatar_urls. Allowed values: avatar_url |
| exclude_inactive |  | boolean | Whether to filter out inactive users from the results. Defaults to false unless explicitly provided. |


#### Example Request:


```
curl https://<canvas>/api/v1/groups/1/users \
     -H 'Authorization: Bearer <token>'
```


---

## Upload a fileGroupsController#create_file


### POST /api/v1/groups/:group_id/files


Upload a file to the group.


This API endpoint is the first step in uploading a file to a group. See the File Upload Documentation for details on the file upload workflow.


Only those with the âManage Filesâ permission on a group can upload files to the group. By default, this is anybody participating in the group, or any admin over the group.


---

## Preview processed htmlGroupsController#preview_html


### POST /api/v1/groups/:group_id/preview_html


Preview html content processed for this group


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| html |  | string | The html content to process |


#### Example Request:


```
curl https://<canvas>/api/v1/groups/<group_id>/preview_html \
     -F 'html=<p><badhtml></badhtml>processed html</p>' \
     -H 'Authorization: Bearer <token>'
```


#### Example Response:


```
{
  "html": "<p>processed html</p>"
}
```


---

## Group activity streamGroupsController#activity_stream


### GET /api/v1/groups/:group_id/activity_stream


Returns the current userâs group-specific activity stream, paginated.


For full documentation, see the API documentation for the user activity stream, in the user api.


---

## Group activity stream summaryGroupsController#activity_stream_summary


### GET /api/v1/groups/:group_id/activity_stream/summary


Returns a summary of the current userâs group-specific activity stream.


For full documentation, see the API documentation for the user activity stream summary, in the user api.


---

## PermissionsGroupsController#permissions


### GET /api/v1/groups/:group_id/permissions


Returns permission information for the calling user in the given group. See also the Account and Course counterparts.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| permissions[] |  | string | List of permissions to check against the authenticated user. Permission names are documented in the List assignable permissions endpoint. |


#### Example Request:


```
curl https://<canvas>/api/v1/groups/<group_id>/permissions \
  -H 'Authorization: Bearer <token>' \
  -d 'permissions[]=read_roster'
  -d 'permissions[]=send_messages_all'
```


#### Example Response:


```
{'read_roster': 'true', 'send_messages_all': 'false'}
```
