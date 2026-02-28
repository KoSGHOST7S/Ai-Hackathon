# Grading Period Sets

> Canvas API — Courses  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List grading period setsGradingPeriodSetsController#index


### GET /api/v1/accounts/:account_id/grading_period_sets


Returns the paginated list of grading period sets


#### Example Response:


```
{
  "grading_period_set": [GradingPeriodGroup]
}
```


---

## Create a grading period setGradingPeriodSetsController#create


### POST /api/v1/accounts/:account_id/grading_period_sets


Create and return a new grading period set


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| enrollment_term_ids[] |  | Array | A list of associated term ids for the grading period set |
| grading_period_set[title] | Required | string | The title of the grading period set |
| grading_period_set[weighted] |  | boolean | A boolean to determine whether the grading periods in the set are weighted |
| grading_period_set[display_totals_for_all_grading_periods] |  | boolean | A boolean to determine whether the totals for all grading periods in the set are displayed |


#### Example Response:


```
{
  "grading_period_set": [GradingPeriodGroup]
}
```


---

## Update a grading period setGradingPeriodSetsController#update


### PATCH /api/v1/accounts/:account_id/grading_period_sets/:id


Update an existing grading period set


204 No Content response code is returned if the update was successful.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| enrollment_term_ids[] |  | Array | A list of associated term ids for the grading period set |
| grading_period_set[][title] | Required | string | The title of the grading period set |
| grading_period_set[][weighted] |  | boolean | A boolean to determine whether the grading periods in the set are weighted |
| grading_period_set[][display_totals_for_all_grading_periods] |  | boolean | A boolean to determine whether the totals for all grading periods in the set are displayed |


---

## Delete a grading period setGradingPeriodSetsController#destroy


### DELETE /api/v1/accounts/:account_id/grading_period_sets/:id


204 No Content response code is returned if the deletion was successful.
