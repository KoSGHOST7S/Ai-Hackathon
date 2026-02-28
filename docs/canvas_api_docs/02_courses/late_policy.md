# Late Policy

> Canvas API — Courses  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Get a late policyLatePolicyController#show


### GET /api/v1/courses/:id/late_policy


Returns the late policy for a course.


#### Example Response:


```
{
  "late_policy": LatePolicy
}
```


---

## Create a late policyLatePolicyController#create


### POST /api/v1/courses/:id/late_policy


Create a late policy. If the course already has a late policy, a bad_request is returned since there can only be one late policy per course.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| late_policy[missing_submission_deduction_enabled] |  | boolean | Whether to enable the missing submission deduction late policy. |
| late_policy[missing_submission_deduction] |  | number | How many percentage points to deduct from a missing submission. |
| late_policy[late_submission_deduction_enabled] |  | boolean | Whether to enable the late submission deduction late policy. |
| late_policy[late_submission_deduction] |  | number | How many percentage points to deduct per the late submission interval. |
| late_policy[late_submission_interval] |  | string | The interval for late policies. |
| late_policy[late_submission_minimum_percent_enabled] |  | boolean | Whether to enable the late submission minimum percent for a late policy. |
| late_policy[late_submission_minimum_percent] |  | number | The minimum grade a submissions can have in percentage points. |


#### Example Response:


```
{
  "late_policy": LatePolicy
}
```


---

## Patch a late policyLatePolicyController#update


### PATCH /api/v1/courses/:id/late_policy


Patch a late policy. No body is returned upon success.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| late_policy[missing_submission_deduction_enabled] |  | boolean | Whether to enable the missing submission deduction late policy. |
| late_policy[missing_submission_deduction] |  | number | How many percentage points to deduct from a missing submission. |
| late_policy[late_submission_deduction_enabled] |  | boolean | Whether to enable the late submission deduction late policy. |
| late_policy[late_submission_deduction] |  | number | How many percentage points to deduct per the late submission interval. |
| late_policy[late_submission_interval] |  | string | The interval for late policies. |
| late_policy[late_submission_minimum_percent_enabled] |  | boolean | Whether to enable the late submission minimum percent for a late policy. |
| late_policy[late_submission_minimum_percent] |  | number | The minimum grade a submissions can have in percentage points. |
