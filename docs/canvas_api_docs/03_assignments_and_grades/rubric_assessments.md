# Rubric Assessments

> Canvas API — Assignments & Grades  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Create a single rubric assessmentRubricAssessmentsController#create


### POST /api/v1/courses/:course_id/rubric_associations/:rubric_association_id/rubric_assessments


Returns the rubric assessment with the given id. The returned object also provides the information of


```
:ratings, :assessor_name, :related_group_submissions_and_assessments, :artifact

```


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| course_id |  | integer | The id of the course |
| rubric_association_id |  | integer | The id of the object with which this rubric assessment is associated |
| provisional |  | string | (optional) Indicates whether this assessment is provisional, defaults to false. |
| final |  | string | (optional) Indicates a provisional grade will be marked as final. It only takes effect if the provisional param is passed as true. Defaults to false. |
| graded_anonymously |  | boolean | (optional) Defaults to false |
| rubric_assessment |  | Hash | A Hash of data to complement the rubric assessment: The user id that refers to the person being assessed rubric_assessment [ user_id ] Assessment type. There are only three valid types:  âgradingâ, âpeer_reviewâ, or âprovisional_gradeâ rubric_assessment [ assessment_type ] The points awarded for this row. rubric_assessment [ criterion_id ] [ points ] Comments to add for this row. rubric_assessment [ criterion_id ] [ comments ] For each criterion_id, change the id by the criterion number, ex: criterion_123 If the criterion_id is not specified it defaults to false, and nothing is updated. |


---

## Update a single rubric assessmentRubricAssessmentsController#update


### PUT /api/v1/courses/:course_id/rubric_associations/:rubric_association_id/rubric_assessments/:id


Returns the rubric assessment with the given id. The returned object also provides the information of


```
:ratings, :assessor_name, :related_group_submissions_and_assessments, :artifact

```


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| id |  | integer | The id of the rubric assessment |
| course_id |  | integer | The id of the course |
| rubric_association_id |  | integer | The id of the object with which this rubric assessment is associated |
| provisional |  | string | (optional) Indicates whether this assessment is provisional, defaults to false. |
| final |  | string | (optional) Indicates a provisional grade will be marked as final. It only takes effect if the provisional param is passed as true. Defaults to false. |
| graded_anonymously |  | boolean | (optional) Defaults to false |
| rubric_assessment |  | Hash | A Hash of data to complement the rubric assessment: The user id that refers to the person being assessed rubric_assessment [ user_id ] Assessment type. There are only three valid types:  âgradingâ, âpeer_reviewâ, or âprovisional_gradeâ rubric_assessment [ assessment_type ] The points awarded for this row. rubric_assessment [ criterion_id ] [ points ] Comments to add for this row. rubric_assessment [ criterion_id ] [ comments ] For each criterion_id, change the id by the criterion number, ex: criterion_123 If the criterion_id is not specified it defaults to false, and nothing is updated. |


---

## Delete a single rubric assessmentRubricAssessmentsController#destroy


### DELETE /api/v1/courses/:course_id/rubric_associations/:rubric_association_id/rubric_assessments/:id


Deletes a rubric assessment
