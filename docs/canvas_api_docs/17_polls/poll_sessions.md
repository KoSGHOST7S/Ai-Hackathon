# Poll Sessions

> Canvas API — Polls  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List poll sessions for a pollPolling::PollSessionsController#index


### GET /api/v1/polls/:poll_id/poll_sessions


Returns the paginated list of PollSessions in this poll.


#### Example Response:


```
{
  "poll_sessions": [PollSession]
}
```


---

## Get the results for a single poll sessionPolling::PollSessionsController#show


### GET /api/v1/polls/:poll_id/poll_sessions/:id


Returns the poll session with the given id


#### Example Response:


```
{
  "poll_sessions": [PollSession]
}
```


---

## Create a single poll sessionPolling::PollSessionsController#create


### POST /api/v1/polls/:poll_id/poll_sessions


Create a new poll session for this poll


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| poll_sessions[][course_id] | Required | integer | The id of the course this session is associated with. |
| poll_sessions[][course_section_id] |  | integer | The id of the course section this session is associated with. |
| poll_sessions[][has_public_results] |  | boolean | Whether or not results are viewable by students. |


#### Example Response:


```
{
  "poll_sessions": [PollSession]
}
```


---

## Update a single poll sessionPolling::PollSessionsController#update


### PUT /api/v1/polls/:poll_id/poll_sessions/:id


Update an existing poll session for this poll


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| poll_sessions[][course_id] |  | integer | The id of the course this session is associated with. |
| poll_sessions[][course_section_id] |  | integer | The id of the course section this session is associated with. |
| poll_sessions[][has_public_results] |  | boolean | Whether or not results are viewable by students. |


#### Example Response:


```
{
  "poll_sessions": [PollSession]
}
```


---

## Delete a poll sessionPolling::PollSessionsController#destroy


### DELETE /api/v1/polls/:poll_id/poll_sessions/:id


204 No Content response code is returned if the deletion was successful.


---

## Open a poll sessionPolling::PollSessionsController#open


### GET /api/v1/polls/:poll_id/poll_sessions/:id/open


---

## Close an opened poll sessionPolling::PollSessionsController#close


### GET /api/v1/polls/:poll_id/poll_sessions/:id/close


---

## List opened poll sessionsPolling::PollSessionsController#opened


### GET /api/v1/poll_sessions/opened


A paginated list of all opened poll sessions available to the current user.


#### Example Response:


```
{
  "poll_sessions": [PollSession]
}
```


---

## List closed poll sessionsPolling::PollSessionsController#closed


### GET /api/v1/poll_sessions/closed


A paginated list of all closed poll sessions available to the current user.


#### Example Response:


```
{
  "poll_sessions": [PollSession]
}
```
