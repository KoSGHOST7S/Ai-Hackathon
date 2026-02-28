# Outcome Results

> Canvas API — Outcomes & Competencies  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Get outcome resultsOutcomeResultsController#index


### GET /api/v1/courses/:course_id/outcome_results


Gets the outcome results for users and outcomes in the specified context.


used in sLMGB


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| user_ids[] |  | integer | If specified, only the users whose ids are given will be included in the results. SIS ids can be used, prefixed by âsis_user_id:â. It is an error to specify an id for a user who is not a student in the context. |
| outcome_ids[] |  | integer | If specified, only the outcomes whose ids are given will be included in the results. it is an error to specify an id for an outcome which is not linked to the context. |
| include[] |  | string | String, âalignmentsâ|âoutcomesâ|âoutcomes.alignmentsâ|âoutcome_groupsâ|âoutcome_linksâ|âoutcome_pathsâ|âusersâ Specify additional collections to be side loaded with the result. âalignmentsâ includes only the alignments referenced by the returned results. âoutcomes.alignmentsâ includes all alignments referenced by outcomes in the context. |
| include_hidden |  | boolean | If true, results that are hidden from the learning mastery gradebook and student rollup scores will be included |


#### Example Response:


```
{
  outcome_results: [OutcomeResult]
}
```


---

## Set outcome ordering for LMGBOutcomeResultsController#outcome_order


### POST /api/v1/courses/:course_id/assign_outcome_order


Saves the ordering of outcomes in LMGB for a user


---

## Get outcome result rollupsOutcomeResultsController#rollups


### GET /api/v1/courses/:course_id/outcome_rollups


Gets the outcome rollups for the users and outcomes in the specified context.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| aggregate |  | string | If specified, instead of returning one rollup for each user, all the user rollups will be combined into one rollup for the course that will contain the average (or median, see below) rollup score for each outcome. Allowed values: course |
| aggregate_stat |  | string | If aggregate rollups requested, then this value determines what statistic is used for the aggregate. Defaults to âmeanâ if this value is not specified. Allowed values: mean , median |
| user_ids[] |  | integer | If specified, only the users whose ids are given will be included in the results or used in an aggregate result. it is an error to specify an id for a user who is not a student in the context |
| outcome_ids[] |  | integer | If specified, only the outcomes whose ids are given will be included in the results. it is an error to specify an id for an outcome which is not linked to the context. |
| include[] |  | string | String, âcoursesâ|âoutcomesâ|âoutcomes.alignmentsâ|âoutcome_groupsâ|âoutcome_linksâ|âoutcome_pathsâ|âusersâ Specify additional collections to be side loaded with the result. |
| exclude[] |  | string | Specify additional values to exclude. âmissing_user_rollupsâ excludes rollups for users without results. âmissing_outcome_resultsâ excludes outcomes without results. Allowed values: missing_user_rollups , missing_outcome_results , |
| sort_by |  | string | If specified, sorts outcome result rollups. âstudentâ sorting will sort by a userâs sortable name. âoutcomeâ sorting will sort by the given outcomeâs rollup score. The latter requires specifying the âsort_outcome_idâ parameter. By default, the sort order is ascending. Allowed values: student , outcome |
| sort_outcome_id |  | integer | If outcome sorting requested, then this determines which outcome to use for rollup score sorting. |
| sort_order |  | string | If sorting requested, then this allows changing the default sort order of ascending to descending. Allowed values: asc , desc |
| add_defaults |  | boolean | If defaults are requested, then color and mastery level defaults will be added to outcome ratings in the rollup. This will only take effect if the Account Level Mastery Scales FF is DISABLED |
| contributing_scores |  | boolean | DEPRECATED : This parameter is deprecated. Use the separate GET /api/v1/courses/:course_id/outcomes/:outcome_id/contributing_scores endpoint instead to fetch contributing scores for a specific outcome. If contributing scores are requested, then each individual outcome score will also include all graded artifacts that contributed to the outcome score |


#### Example Response:


```
{
  "rollups": [OutcomeRollup],
  "linked": {
    // (Optional) Included if include[] has outcomes
    "outcomes": [Outcome],

    // (Optional) Included if aggregate is not set and include[] has users
    "users": [User],

    // (Optional) Included if aggregate is 'course' and include[] has courses
    "courses": [Course]

    // (Optional) Included if include[] has outcome_groups
    "outcome_groups": [OutcomeGroup],

    // (Optional) Included if include[] has outcome_links
    "outcome_links": [OutcomeLink]

    // (Optional) Included if include[] has outcome_paths
    "outcome_paths": [OutcomePath]

    // (Optional) Included if include[] has outcomes.alignments
    "outcomes.alignments": [OutcomeAlignment]
  }
}
```


---

## Get contributing scoresOutcomeResultsController#contributing_scores


### GET /api/v1/courses/:course_id/outcomes/:outcome_id/contributing_scores


Gets the contributing scores for a specific outcome and set of users. Contributing scores are the individual assignment/quiz scores that contributed to the outcome score for each user.


Returns all alignments for the outcome in the course context.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| user_ids[] |  | integer | If specified, only the users whose ids are given will be included in the results. It is an error to specify an id for a user who is not a student in the context. |
| only_assignment_alignments |  | boolean | If specified, only assignment alignments will be included in the results. |
| show_unpublished_assignments |  | boolean | If true, unpublished assignments will be included in the results. Defaults to false. |


#### Example Response:


```
{
  "outcome": {
    "id": "1",
    "title": "Outcome 1"
  },
  "alignments": [
    {
      "alignment_id": "123",
      "associated_asset_id": "456",
      "associated_asset_name": "Assignment 1",
      "associated_asset_type": "Assignment"
    }
  ],
  "scores": [
    {
      "user_id": "1",
      "alignment_id": "123",
      "score": 3.5
    }
  ]
}
```


---

## Get mastery distributionOutcomeResultsController#mastery_distribution


### GET /api/v1/courses/:course_id/outcome_mastery_distribution


Returns the distribution of student scores across mastery levels for all outcomes. This endpoint fetches data for ALL students (not paginated) to provide accurate distribution statistics for charts and analytics.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| exclude[] |  | string | Optionally restrict which results are included: âmissing_user_rollupsâ: exclude students without any scores âmissing_outcome_resultsâ: exclude outcomes without any results |
| outcome_ids[] |  | string | Optionally restrict to specific outcome IDs |
| student_ids[] |  | string | Optionally restrict to specific student IDs. If not provided, all students will be included. |
| include[] |  | string | Optionally include additional data: âalignment_distributionsâ: include contributing score distributions for alignments |
| only_assignment_alignments |  | boolean | If true and alignment_distributions is included, only include assignment alignments. Default: false. |
| show_unpublished_assignments |  | boolean | If true, include unpublished assignments in alignment distributions. Default: false. |
| add_defaults |  | boolean | If defaults are requested, then color and mastery level defaults will be added to outcome ratings in the result. This will only take effect if the Account Level Mastery Scales FF is DISABLED |


#### Example Response:


```
{
  "outcome_distributions": {
    "1": {
      "outcome_id": "1",
      "ratings": [
        {
          "description": "Exceeds Mastery",
          "points": 4.0,
          "color": "#127A1B",
          "count": 5,
          "student_ids": ["1", "3", "7", "12", "15"]
        },
        {
          "description": "Mastery",
          "points": 3.0,
          "color": "#0B874B",
          "count": 12,
          "student_ids": ["2", "4", "5", ...]
        }
      ],
      "total_students": 28,
      "alignment_distributions": {
        "content_tag_123": {
          "alignment_id": "content_tag_123",
          "ratings": [
            {
              "description": "Exceeds Mastery",
              "points": 4.0,
              "color": "#127A1B",
              "count": 3,
              "student_ids": ["1", "7", "12"]
            }
          ],
          "total_students": 28
        }
      }
    }
  },
  "students": [
    {
      "id": "1",
      "name": "Student Name",
      "sortable_name": "Name, Student"
    }
  ]
}
```


---

## Enqueue a delayed Outcome Rollup Calculation JobOutcomeResultsController#enqueue_outcome_rollup_calculation


### POST /api/v1/enqueue_outcome_rollup_calculation
