# Collaborations

> Canvas API — Content Management  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List collaborationsCollaborationsController#api_index


### GET /api/v1/courses/:course_id/collaborations


### GET /api/v1/groups/:group_id/collaborations


A paginated list of collaborations the current user has access to in the context of the course provided in the url. NOTE: this only returns ExternalToolCollaboration type collaborations.


```
curl https://<canvas>/api/v1/courses/1/collaborations/

```


---

## List members of a collaboration.CollaborationsController#members


### GET /api/v1/collaborations/:id/members


A paginated list of the collaborators of a given collaboration


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| include[] |  | string | âcollaborator_lti_idâ: Optional information to include with each member. Represents an identifier to be used for the member in an LTI context. âavatar_image_urlâ: Optional information to include with each member. The url for the avatar of a collaborator with type âuserâ. Allowed values: collaborator_lti_id , avatar_image_url |


#### Example Request:


```
curl https://<canvas>/api/v1/courses/1/collaborations/1/members
```


---

## List potential membersCollaborationsController#potential_collaborators


### GET /api/v1/courses/:course_id/potential_collaborators


### GET /api/v1/groups/:group_id/potential_collaborators


A paginated list of the users who can potentially be added to a collaboration in the given context.


For courses, this consists of all enrolled users.  For groups, it is comprised of the group members plus the admins of the course containing the group.
