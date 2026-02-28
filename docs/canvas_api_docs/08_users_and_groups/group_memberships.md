# Group Memberships

> Canvas API — Users & Groups  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List group membershipsGroupMembershipsController#index


### GET /api/v1/groups/:group_id/memberships


A paginated list of the members of a group.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| filter_states[] |  | string | Only list memberships with the given workflow_states. By default it will return all memberships. Allowed values: accepted , invited , requested |


#### Example Request:


```
curl https://<canvas>/api/v1/groups/<group_id>/memberships \
     -F 'filter_states[]=invited&filter_states[]=requested' \
     -H 'Authorization: Bearer <token>'
```


---

## Get a single group membershipGroupMembershipsController#show


### GET /api/v1/groups/:group_id/memberships/:membership_id


### GET /api/v1/groups/:group_id/users/:user_id


Returns the group membership with the given membership id or user id.


#### Example Request:


```
curl https://<canvas>/api/v1/groups/<group_id>/memberships/<membership_id> \
     -H 'Authorization: Bearer <token>'
```


```
curl https://<canvas>/api/v1/groups/<group_id>/users/<user_id> \
     -H 'Authorization: Bearer <token>'
```


---

## Create a membershipGroupMembershipsController#create


### POST /api/v1/groups/:group_id/memberships


Join, or request to join, a group, depending on the join_level of the group. If the membership or join request already exists, then it is simply returned.


For differentiation tags, you can bulk add users using one of two methods:

1. Provide an array of user IDs via the members[] parameter.
2. Use the course-wide option with the following parameters: all_in_group_course [Boolean]: If set to true, the endpoint will add every currently enrolled student (from the course context) to the differentiation tag. exclude_user_ids[] [Integer]: When using all_in_group_course , you can optionally exclude specific users by providing their IDs in this parameter.


In this context, these parameters only apply to differentiation tag memberships.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| user_id |  | string | The ID of the user for individual membership creation. |
| members[] |  | integer | Bulk add multiple users to a differentiation tag. |
| all_in_group_course |  | boolean | If true, add all enrolled students from the course. |
| exclude_user_ids[] |  | integer | An array of user IDs to exclude when using all_in_group_course. |


#### Example Request:


```
(Individual membership creation)
curl https://<canvas>/api/v1/groups/<group_id>/memberships \
     -F 'user_id=self' \
     -H 'Authorization: Bearer <token>'
```


```
(Bulk addition using members array)
curl https://<canvas>/api/v1/groups/<group_id>/memberships \
     -F 'members[]=123' \
     -F 'members[]=456' \
     -H 'Authorization: Bearer <token>'
```


```
(Bulk addition using all_in_group_course with exclusions)
curl https://<canvas>/api/v1/groups/<group_id>/memberships \
     -F 'all_in_group_course=true' \
     -F 'exclude_user_ids[]=123' \
     -H 'Authorization: Bearer <token>'
```


---

## Update a membershipGroupMembershipsController#update


### PUT /api/v1/groups/:group_id/memberships/:membership_id


### PUT /api/v1/groups/:group_id/users/:user_id


Accept a membership request, or add/remove moderator rights.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| workflow_state |  | string | Currently, the only allowed value is âacceptedâ Allowed values: accepted |
| moderator |  | string | no description |


#### Example Request:


```
curl https://<canvas>/api/v1/groups/<group_id>/memberships/<membership_id> \
     -F 'moderator=true'
     -H 'Authorization: Bearer <token>'
```


```
curl https://<canvas>/api/v1/groups/<group_id>/users/<user_id> \
     -F 'moderator=true'
     -H 'Authorization: Bearer <token>'
```


---

## Leave a groupGroupMembershipsController#destroy


### DELETE /api/v1/groups/:group_id/memberships/:membership_id


### DELETE /api/v1/groups/:group_id/users/:user_id


Leave a group if you are allowed to leave (some groups, such as sets of course groups created by teachers, cannot be left). You may also use âselfâ in place of a membership_id.


#### Example Request:


```
curl https://<canvas>/api/v1/groups/<group_id>/memberships/<membership_id> \
     -X DELETE \
     -H 'Authorization: Bearer <token>'
```


```
curl https://<canvas>/api/v1/groups/<group_id>/users/<user_id> \
     -X DELETE \
     -H 'Authorization: Bearer <token>'
```


---

## Bulk delete memberships
Bulk deletes memberships by providing an array of user IDs.GroupMembershipsController#destroy_bulk


### DELETE /api/v1/groups/:group_id/users
