# Polls

> Canvas API — Polls  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List pollsPolling::PollsController#index


### GET /api/v1/polls


Returns the paginated list of polls for the current user.


#### Example Response:


```
{
  "polls": [Poll]
}
```


---

## Get a single pollPolling::PollsController#show


### GET /api/v1/polls/:id


Returns the poll with the given id


#### Example Response:


```
{
  "polls": [Poll]
}
```


---

## Create a single pollPolling::PollsController#create


### POST /api/v1/polls


Create a new poll for the current user


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| polls[][question] | Required | string | The title of the poll. |
| polls[][description] |  | string | A brief description or instructions for the poll. |


#### Example Response:


```
{
  "polls": [Poll]
}
```


---

## Update a single pollPolling::PollsController#update


### PUT /api/v1/polls/:id


Update an existing poll belonging to the current user


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| polls[][question] | Required | string | The title of the poll. |
| polls[][description] |  | string | A brief description or instructions for the poll. |


#### Example Response:


```
{
  "polls": [Poll]
}
```


---

## Delete a pollPolling::PollsController#destroy


### DELETE /api/v1/polls/:id


204 No Content response code is returned if the deletion was successful.
