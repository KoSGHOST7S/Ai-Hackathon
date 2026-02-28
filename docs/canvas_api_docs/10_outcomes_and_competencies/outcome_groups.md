# Outcome Groups

> Canvas API — Outcomes & Competencies  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Redirect to root outcome group for contextOutcomeGroupsApiController#redirect


### GET /api/v1/global/root_outcome_group


### GET /api/v1/accounts/:account_id/root_outcome_group


### GET /api/v1/courses/:course_id/root_outcome_group


Convenience redirect to find the root outcome group for a particular context. Will redirect to the appropriate outcome groupâs URL.


---

## Get all outcome groups for contextOutcomeGroupsApiController#index


### GET /api/v1/accounts/:account_id/outcome_groups


### GET /api/v1/courses/:course_id/outcome_groups


Returns a list of all outcome groups in the specified context.


---

## Get all outcome links for contextOutcomeGroupsApiController#link_index


### GET /api/v1/accounts/:account_id/outcome_group_links


### GET /api/v1/courses/:course_id/outcome_group_links


Returns a list of all outcome links in the specified context.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| outcome_style |  | string | The detail level of the outcomes. Defaults to âabbrevâ. Specify âfullâ for more information. |
| outcome_group_style |  | string | The detail level of the outcome groups. Defaults to âabbrevâ. Specify âfullâ for more information. |


---

## Show an outcome groupOutcomeGroupsApiController#show


### GET /api/v1/global/outcome_groups/:id


### GET /api/v1/accounts/:account_id/outcome_groups/:id


### GET /api/v1/courses/:course_id/outcome_groups/:id


Returns detailed information about a specific outcome group.


---

## Update an outcome groupOutcomeGroupsApiController#update


### PUT /api/v1/global/outcome_groups/:id


### PUT /api/v1/accounts/:account_id/outcome_groups/:id


### PUT /api/v1/courses/:course_id/outcome_groups/:id


Modify an existing outcome group. Fields not provided are left as is; unrecognized fields are ignored.


When changing the parent outcome group, the new parent group must belong to the same context as this outcome group, and must not be a descendant of this outcome group (i.e. no cycles allowed).


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| title |  | string | The new outcome group title. |
| description |  | string | The new outcome group description. |
| vendor_guid |  | string | A custom GUID for the learning standard. |
| parent_outcome_group_id |  | integer | The id of the new parent outcome group. |


#### Example Request:


```
curl 'https://<canvas>/api/v1/accounts/1/outcome_groups/2.json' \
     -X PUT \
     -F 'title=Outcome Group Title' \
     -F 'description=Outcome group description' \
     -F 'vendor_guid=customid9000' \
     -F 'parent_outcome_group_id=1' \
     -H "Authorization: Bearer <token>"
```


```
curl 'https://<canvas>/api/v1/accounts/1/outcome_groups/2.json' \
     -X PUT \
     --data-binary '{
           "title": "Outcome Group Title",
           "description": "Outcome group description",
           "vendor_guid": "customid9000",
           "parent_outcome_group_id": 1
         }' \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <token>"
```


---

## Delete an outcome groupOutcomeGroupsApiController#destroy


### DELETE /api/v1/global/outcome_groups/:id


### DELETE /api/v1/accounts/:account_id/outcome_groups/:id


### DELETE /api/v1/courses/:course_id/outcome_groups/:id


Deleting an outcome group deletes descendant outcome groups and outcome links. The linked outcomes themselves are only deleted if all links to the outcome were deleted.


Aligned outcomes cannot be deleted; as such, if all remaining links to an aligned outcome are included in this groupâs descendants, the group deletion will fail.


#### Example Request:


```
curl 'https://<canvas>/api/v1/accounts/1/outcome_groups/2.json' \
     -X DELETE \
     -H "Authorization: Bearer <token>"
```


---

## List linked outcomesOutcomeGroupsApiController#outcomes


### GET /api/v1/global/outcome_groups/:id/outcomes


### GET /api/v1/accounts/:account_id/outcome_groups/:id/outcomes


### GET /api/v1/courses/:course_id/outcome_groups/:id/outcomes


A paginated list of the immediate OutcomeLink children of the outcome group.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| outcome_style |  | string | The detail level of the outcomes. Defaults to âabbrevâ. Specify âfullâ for more information. |


---

## Create/link an outcomeOutcomeGroupsApiController#link


### POST /api/v1/global/outcome_groups/:id/outcomes


### PUT /api/v1/global/outcome_groups/:id/outcomes/:outcome_id


### POST /api/v1/accounts/:account_id/outcome_groups/:id/outcomes


### PUT /api/v1/accounts/:account_id/outcome_groups/:id/outcomes/:outcome_id


### POST /api/v1/courses/:course_id/outcome_groups/:id/outcomes


### PUT /api/v1/courses/:course_id/outcome_groups/:id/outcomes/:outcome_id


Link an outcome into the outcome group. The outcome to link can either be specified by a PUT to the link URL for a specific outcome (the outcome_id in the PUT URLs) or by supplying the information for a new outcome (title, description, ratings, mastery_points) in a POST to the collection.


If linking an existing outcome, the outcome_id must identify an outcome available to this context; i.e. an outcome owned by this groupâs context, an outcome owned by an associated account, or a global outcome. With outcome_id present, any other parameters (except move_from) are ignored.


If defining a new outcome, the outcome is created in the outcome groupâs context using the provided title, description, ratings, and mastery points; the title is required but all other fields are optional. The new outcome is then linked into the outcome group.


If ratings are provided when creating a new outcome, an embedded rubric criterion is included in the new outcome. This criterionâs mastery_points default to the maximum points in the highest rating if not specified in the mastery_points parameter. Any ratings lacking a description are given a default of âNo descriptionâ. Any ratings lacking a point value are given a default of 0. If no ratings are provided, the mastery_points parameter is ignored.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| outcome_id |  | integer | The ID of the existing outcome to link. |
| move_from |  | integer | The ID of the old outcome group. Only used if outcome_id is present. |
| title |  | string | The title of the new outcome. Required if outcome_id is absent. |
| display_name |  | string | A friendly name shown in reports for outcomes with cryptic titles, such as common core standards names. |
| description |  | string | The description of the new outcome. |
| vendor_guid |  | string | A custom GUID for the learning standard. |
| mastery_points |  | integer | The mastery threshold for the embedded rubric criterion. |
| ratings[][description] |  | string | The description of a rating level for the embedded rubric criterion. |
| ratings[][points] |  | integer | The points corresponding to a rating level for the embedded rubric criterion. |
| calculation_method |  | string | The new calculation method.  Defaults to âdecaying_averageâ if the Outcomes New Decaying Average Calculation Method FF is ENABLED then Defaults to âweighted_averageâ Allowed values: weighted_average , decaying_average , n_mastery , latest , highest , average |
| calculation_int |  | integer | The new calculation int.  Only applies if the calculation_method is âweighted_averageâ, âdecaying_averageâ or ân_masteryâ. Defaults to 65 |


#### Example Request:


```
curl 'https://<canvas>/api/v1/accounts/1/outcome_groups/1/outcomes/1.json' \
     -X PUT \
     -H "Authorization: Bearer <token>"
```


```
curl 'https://<canvas>/api/v1/accounts/1/outcome_groups/1/outcomes.json' \
     -X POST \
     -F 'title=Outcome Title' \
     -F 'display_name=Title for reporting' \
     -F 'description=Outcome description' \
     -F 'vendor_guid=customid9000' \
     -F 'mastery_points=3' \
     -F 'calculation_method=decaying_average' \
     -F 'calculation_int=65' \
     -F 'ratings[][description]=Exceeds Expectations' \
     -F 'ratings[][points]=5' \
     -F 'ratings[][description]=Meets Expectations' \
     -F 'ratings[][points]=3' \
     -F 'ratings[][description]=Does Not Meet Expectations' \
     -F 'ratings[][points]=0' \
     -H "Authorization: Bearer <token>"
```


```
curl 'https://<canvas>/api/v1/accounts/1/outcome_groups/1/outcomes.json' \
     -X POST \
     --data-binary '{
           "title": "Outcome Title",
           "display_name": "Title for reporting",
           "description": "Outcome description",
           "vendor_guid": "customid9000",
           "mastery_points": 3,
           "ratings": [
             { "description": "Exceeds Expectations", "points": 5 },
             { "description": "Meets Expectations", "points": 3 },
             { "description": "Does Not Meet Expectations", "points": 0 }
           ]
         }' \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <token>"
```


---

## Unlink an outcomeOutcomeGroupsApiController#unlink


### DELETE /api/v1/global/outcome_groups/:id/outcomes/:outcome_id


### DELETE /api/v1/accounts/:account_id/outcome_groups/:id/outcomes/:outcome_id


### DELETE /api/v1/courses/:course_id/outcome_groups/:id/outcomes/:outcome_id


Unlinking an outcome only deletes the outcome itself if this was the last link to the outcome in any group in any context. Aligned outcomes cannot be deleted; as such, if this is the last link to an aligned outcome, the unlinking will fail.


#### Example Request:


```
curl 'https://<canvas>/api/v1/accounts/1/outcome_groups/1/outcomes/1.json' \
     -X DELETE \
     -H "Authorization: Bearer <token>"
```


---

## List subgroupsOutcomeGroupsApiController#subgroups


### GET /api/v1/global/outcome_groups/:id/subgroups


### GET /api/v1/accounts/:account_id/outcome_groups/:id/subgroups


### GET /api/v1/courses/:course_id/outcome_groups/:id/subgroups


A paginated list of the immediate OutcomeGroup children of the outcome group.


---

## Create a subgroupOutcomeGroupsApiController#create


### POST /api/v1/global/outcome_groups/:id/subgroups


### POST /api/v1/accounts/:account_id/outcome_groups/:id/subgroups


### POST /api/v1/courses/:course_id/outcome_groups/:id/subgroups


Creates a new empty subgroup under the outcome group with the given title and description.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| title | Required | string | The title of the new outcome group. |
| description |  | string | The description of the new outcome group. |
| vendor_guid |  | string | A custom GUID for the learning standard |


#### Example Request:


```
curl 'https://<canvas>/api/v1/accounts/1/outcome_groups/1/subgroups.json' \
     -X POST \
     -F 'title=Outcome Group Title' \
     -F 'description=Outcome group description' \
     -F 'vendor_guid=customid9000' \
     -H "Authorization: Bearer <token>"
```


```
curl 'https://<canvas>/api/v1/accounts/1/outcome_groups/1/subgroups.json' \
     -X POST \
     --data-binary '{
           "title": "Outcome Group Title",
           "description": "Outcome group description",
           "vendor_guid": "customid9000"
         }' \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <token>"
```


---

## Import an outcome groupOutcomeGroupsApiController#import


### POST /api/v1/global/outcome_groups/:id/import


### POST /api/v1/accounts/:account_id/outcome_groups/:id/import


### POST /api/v1/courses/:course_id/outcome_groups/:id/import


Creates a new subgroup of the outcome group with the same title and description as the source group, then creates links in that new subgroup to the same outcomes that are linked in the source group. Recurses on the subgroups of the source group, importing them each in turn into the new subgroup.


Allows you to copy organizational structure, but does not create copies of the outcomes themselves, only new links.


The source group must be either global, from the same context as this outcome group, or from an associated account. The source group cannot be the root outcome group of its context.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| source_outcome_group_id | Required | integer | The ID of the source outcome group. |
| async |  | boolean | If true, perform action asynchronously.  In that case, this endpoint will return a Progress object instead of an OutcomeGroup. Use the progress endpoint to query the status of the operation.  The imported outcome group id and url will be returned in the results of the Progress object as âoutcome_group_idâ and âoutcome_group_urlâ |


#### Example Request:


```
curl 'https://<canvas>/api/v1/accounts/2/outcome_groups/3/import.json' \
     -X POST \
     -F 'source_outcome_group_id=2' \
     -H "Authorization: Bearer <token>"
```
