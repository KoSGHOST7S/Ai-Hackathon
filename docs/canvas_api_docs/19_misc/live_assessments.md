# Live Assessments

> Canvas API — Miscellaneous  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Create or find a live assessmentLiveAssessments::AssessmentsController#create


### POST /api/v1/courses/:course_id/live_assessments


Creates or finds an existing live assessment with the given key and aligns it with the linked outcome


#### Example Request:


```
{
  "assessments": [{
    "key": "2014-05-27-Outcome-52",
    "title": "Tuesday's LiveAssessment",
    "links": {
      "outcome": "1"
    }
  }]
}
```


#### Example Response:


```
{
  "links": {
    "assessments.results": "http://example.com/courses/1/live_assessments/5/results"
  },
  "assessments": [Assessment]
}
```


---

## List live assessmentsLiveAssessments::AssessmentsController#index


### GET /api/v1/courses/:course_id/live_assessments


Returns a paginated list of live assessments.


#### Example Response:


```
{
  "links": {
    "assessments.results": "http://example.com/courses/1/live_assessments/{assessments.id}/results"
  },
  "assessments": [Assessment]
}
```
