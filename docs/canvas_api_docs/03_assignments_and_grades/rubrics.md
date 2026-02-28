# Rubrics

> Canvas API — Assignments & Grades  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Create a single rubricRubricsController#create


### POST /api/v1/courses/:course_id/rubrics


Returns the rubric with the given id.


Unfortunately this endpoint does not return a standard Rubric object, instead it returns a hash that looks like


```
{ 'rubric': Rubric, 'rubric_association': RubricAssociation }

```


This may eventually be deprecated in favor of a more standardized return value, but that is not currently planned.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| id |  | integer | The id of the rubric |
| rubric_association_id |  | integer | The id of the rubric association object (not the course/assignment itself, but the join table record id). It can be used in place of rubric_association[association_id] and rubric_association[association_type] if desired. |
| rubric[title] |  | string | The title of the rubric |
| rubric[free_form_criterion_comments] |  | boolean | Whether or not you can write custom comments in the ratings field for a rubric |
| rubric_association[association_id] |  | integer | The id of the object with which this rubric is associated |
| rubric_association[association_type] |  | string | The type of object this rubric is associated with Allowed values: Assignment , Course , Account |
| rubric_association[use_for_grading] |  | boolean | Whether or not the associated rubric is used for grade calculation |
| rubric_association[hide_score_total] |  | boolean | Whether or not the score total is displayed within the rubric. This option is only available if the rubric is not used for grading. |
| rubric_association[purpose] |  | string | Whether or not the association is for grading (and thus linked to an assignment) or if itâs to indicate the rubric should appear in its context |
| rubric[criteria] |  | Hash | An indexed Hash of RubricCriteria objects where the keys are integer ids and the values are the RubricCriteria objects |


---

## Update a single rubricRubricsController#update


### PUT /api/v1/courses/:course_id/rubrics/:id


Returns the rubric with the given id.


Unfortunately this endpoint does not return a standard Rubric object, instead it returns a hash that looks like


```
{ 'rubric': Rubric, 'rubric_association': RubricAssociation }

```


This may eventually be deprecated in favor of a more standardized return value, but that is not currently planned.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| id |  | integer | The id of the rubric |
| rubric_association_id |  | integer | The id of the rubric association object (not the course/assignment itself, but the join table record id). It can be used in place of rubric_association[association_id] and rubric_association[association_type] if desired. |
| rubric[title] |  | string | The title of the rubric |
| rubric[free_form_criterion_comments] |  | boolean | Whether or not you can write custom comments in the ratings field for a rubric |
| rubric[skip_updating_points_possible] |  | boolean | Whether or not to update the points possible |
| rubric_association[association_id] |  | integer | The id of the object with which this rubric is associated |
| rubric_association[association_type] |  | string | The type of object this rubric is associated with Allowed values: Assignment , Course , Account |
| rubric_association[use_for_grading] |  | boolean | Whether or not the associated rubric is used for grade calculation |
| rubric_association[hide_score_total] |  | boolean | Whether or not the score total is displayed within the rubric. This option is only available if the rubric is not used for grading. |
| rubric_association[purpose] |  | string | Whether or not the association is for grading (and thus linked to an assignment) or if itâs to indicate the rubric should appear in its context Allowed values: grading , bookmark |
| rubric[criteria] |  | Hash | An indexed Hash of RubricCriteria objects where the keys are integer ids and the values are the RubricCriteria objects |


---

## Delete a singleRubricsController#destroy


### DELETE /api/v1/courses/:course_id/rubrics/:id


Deletes a Rubric and removes all RubricAssociations.


---

## List rubricsRubricsApiController#index


### GET /api/v1/accounts/:account_id/rubrics


### GET /api/v1/courses/:course_id/rubrics


Returns the paginated list of active rubrics for the current context.


---

## Get a single rubricRubricsApiController#show


### GET /api/v1/accounts/:account_id/rubrics/:id


### GET /api/v1/courses/:course_id/rubrics/:id


Returns the rubric with the given id.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| include[] |  | string | Related records to include in the response. Allowed values: assessments , graded_assessments , peer_assessments , associations , assignment_associations , course_associations , account_associations |
| style |  | string | Applicable only if assessments are being returned. If included, returns either all criteria data associated with the assessment, or just the comments. If not included, both data and comments are omitted. Allowed values: full , comments_only |


---

## Get the courses and assignments for a rubricRubricsApiController#used_locations


### GET /api/v1/courses/:course_id/rubrics/:id/used_locations


### GET /api/v1/accounts/:account_id/rubrics/:id/used_locations


Returns the courses and assignments where a rubric is being used


---

## Creates a rubric using a CSV fileRubricsApiController#upload


### POST /api/v1/courses/:course_id/rubrics/upload


### POST /api/v1/accounts/:account_id/rubrics/upload


Returns the rubric import object that was created


---

## Templated file for importing a rubricRubricsApiController#upload_template


### GET /api/v1/rubrics/upload_template


Returns a CSV template file that can be used to import rubrics into Canvas.


---

## Get the status of a rubric importRubricsApiController#upload_status


### GET /api/v1/courses/:course_id/rubrics/upload/:id


### GET /api/v1/accounts/:account_id/rubrics/upload/:id


Can return the latest rubric import for an account or course, or a specific import by id
