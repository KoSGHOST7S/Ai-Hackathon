# Poll Submissions

> Canvas API — Polls  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Get a single poll submissionPolling::PollSubmissionsController#show


### GET /api/v1/polls/:poll_id/poll_sessions/:poll_session_id/poll_submissions/:id


Returns the poll submission with the given id


#### Example Response:


```
{
  "poll_submissions": [PollSubmission]
}
```


---

## Create a single poll submissionPolling::PollSubmissionsController#create


### POST /api/v1/polls/:poll_id/poll_sessions/:poll_session_id/poll_submissions


Create a new poll submission for this poll session


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| poll_submissions[][poll_choice_id] | Required | integer | The chosen poll choice for this submission. |


#### Example Response:


```
{
  "poll_submissions": [PollSubmission]
}
```
