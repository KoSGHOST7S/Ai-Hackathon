# Live Assessment Results

> Canvas API — Miscellaneous  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Create live assessment resultsLiveAssessments::ResultsController#create


### POST /api/v1/courses/:course_id/live_assessments/:assessment_id/results


Creates live assessment results and adds them to a live assessment


#### Example Request:


```
{
  "results": [{
    "passed": false,
    "assessed_at": "2014-05-26T14:57:23-07:00",
    "links": {
      "user": "15"
    }
  },{
    "passed": true,
    "assessed_at": "2014-05-26T13:05:40-07:00",
    "links": {
      "user": "16"
    }
  }]
}
```


#### Example Response:


```
{
  "results": [Result]
}
```


---

## List live assessment resultsLiveAssessments::ResultsController#index


### GET /api/v1/courses/:course_id/live_assessments/:assessment_id/results


Returns a paginated list of live assessment results


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| user_id |  | integer | If set, restrict results to those for this user |


#### Example Response:


```
{
  "results": [Result]
}
```
