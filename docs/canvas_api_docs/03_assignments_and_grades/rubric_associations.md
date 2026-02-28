# Rubric Associations

> Canvas API — Assignments & Grades  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Create a RubricAssociationRubricAssociationsController#create


### POST /api/v1/courses/:course_id/rubric_associations


Returns the rubric with the given id.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| rubric_association[rubric_id] |  | integer | The id of the Rubric |
| rubric_association[association_id] |  | integer | The id of the object with which this rubric is associated |
| rubric_association[association_type] |  | string | The type of object this rubric is associated with Allowed values: Assignment , Course , Account |
| rubric_association[title] |  | string | The name of the object this rubric is associated with |
| rubric_association[use_for_grading] |  | boolean | Whether or not the associated rubric is used for grade calculation |
| rubric_association[hide_score_total] |  | boolean | Whether or not the score total is displayed within the rubric. This option is only available if the rubric is not used for grading. |
| rubric_association[purpose] |  | string | Whether or not the association is for grading (and thus linked to an assignment) or if itâs to indicate the rubric should appear in its context Allowed values: grading , bookmark |
| rubric_association[bookmarked] |  | boolean | Whether or not the associated rubric appears in its context |


---

## Update a RubricAssociationRubricAssociationsController#update


### PUT /api/v1/courses/:course_id/rubric_associations/:id


Returns the rubric with the given id.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| id |  | integer | The id of the RubricAssociation to update |
| rubric_association[rubric_id] |  | integer | The id of the Rubric |
| rubric_association[association_id] |  | integer | The id of the object with which this rubric is associated |
| rubric_association[association_type] |  | string | The type of object this rubric is associated with Allowed values: Assignment , Course , Account |
| rubric_association[title] |  | string | The name of the object this rubric is associated with |
| rubric_association[use_for_grading] |  | boolean | Whether or not the associated rubric is used for grade calculation |
| rubric_association[hide_score_total] |  | boolean | Whether or not the score total is displayed within the rubric. This option is only available if the rubric is not used for grading. |
| rubric_association[purpose] |  | string | Whether or not the association is for grading (and thus linked to an assignment) or if itâs to indicate the rubric should appear in its context Allowed values: grading , bookmark |
| rubric_association[bookmarked] |  | boolean | Whether or not the associated rubric appears in its context |


---

## Delete a RubricAssociationRubricAssociationsController#destroy


### DELETE /api/v1/courses/:course_id/rubric_associations/:id


Delete the RubricAssociation with the given ID
