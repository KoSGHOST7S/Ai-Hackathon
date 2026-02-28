# Poll Choices

> Canvas API — Polls  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List poll choices in a pollPolling::PollChoicesController#index


### GET /api/v1/polls/:poll_id/poll_choices


Returns the paginated list of PollChoices in this poll.


#### Example Response:


```
{
  "poll_choices": [PollChoice]
}
```


---

## Get a single poll choicePolling::PollChoicesController#show


### GET /api/v1/polls/:poll_id/poll_choices/:id


Returns the poll choice with the given id


#### Example Response:


```
{
  "poll_choices": [PollChoice]
}
```


---

## Create a single poll choicePolling::PollChoicesController#create


### POST /api/v1/polls/:poll_id/poll_choices


Create a new poll choice for this poll


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| poll_choices[][text] | Required | string | The descriptive text of the poll choice. |
| poll_choices[][is_correct] |  | boolean | Whether this poll choice is considered correct or not. Defaults to false. |
| poll_choices[][position] |  | integer | The order this poll choice should be returned in the context itâs sibling poll choices. |


#### Example Response:


```
{
  "poll_choices": [PollChoice]
}
```


---

## Update a single poll choicePolling::PollChoicesController#update


### PUT /api/v1/polls/:poll_id/poll_choices/:id


Update an existing poll choice for this poll


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| poll_choices[][text] | Required | string | The descriptive text of the poll choice. |
| poll_choices[][is_correct] |  | boolean | Whether this poll choice is considered correct or not.  Defaults to false. |
| poll_choices[][position] |  | integer | The order this poll choice should be returned in the context itâs sibling poll choices. |


#### Example Response:


```
{
  "poll_choices": [PollChoice]
}
```


---

## Delete a poll choicePolling::PollChoicesController#destroy


### DELETE /api/v1/polls/:poll_id/poll_choices/:id


204 No Content response code is returned if the deletion was successful.
