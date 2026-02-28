# Page Views

> Canvas API — Users & Groups  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List user page viewsPageViewsController#index


### GET /api/v1/users/:user_id/page_views


Return a paginated list of the userâs page view history in json format, similar to the available CSV download. Page views are returned in descending order, newest to oldest.


Disclaimer : The data is a best effort attempt, and is not guaranteed to be complete or wholly accurate. This data is meant to be used for rollups and analysis in the aggregate, not in isolation for auditing, or other high-stakes analysis involving examining single users or small samples. Page Views data is generated from the Canvas logs files, not a transactional database, there are many places along the way data can be lost and/or duplicated (though uncommon). Additionally, given the size of this data, our processes ensure that errors can be rectified at any point in time, with corrections integrated as soon as they are identified and processed.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| start_time |  | DateTime | The beginning of the time range from which you want page views. |
| end_time |  | DateTime | The end of the time range from which you want page views. |


---

## BETA - Initiate page views queryPageViewsController#query


### POST /api/v1/users/:user_id/page_views/query


Initiates an asynchronous query for user page views data within a specified date range. This method enqueues a background job to process the page views query and returns a polling URL that can be used to check the query status and retrieve results when ready.


As this is a beta endpoint, it is subject to change or removal at any time without the standard notice periods outlined in the API policy.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| start_date |  | string | The start date for the page views query in YYYY-MM-DD format. Must be the first day of a month. |
| end_date |  | string | The end date for the page views query in YYYY-MM-DD format. Must be the first day of a month and after start_date. |
| results_format |  | string | The desired format for the query results. Supported formats: âcsvâ, âjsonlâ |


#### Example Request:


```
curl https://<canvas>/api/v1/users/:user_id/page_views/query \
  -X POST \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "start_date": "2023-01-01",
    "end_date": "2023-02-01",
    "results_format": "csv"
  }'
```


#### Example Response:


```
201
{
  "poll_url": "/api/v1/users/123/page_views/query/550e8400-e29b-41d4-a716-446655440000"
}
```


```
400
{
  "error": "Page Views received an invalid or malformed request."
}
```


```
429
{
  "error": "Page Views rate limit exceeded. Please wait and try again."
}
```


---

## BETA - Poll query statusPageViewsController#poll_query


### GET /api/v1/users/:user_id/page_views/query/:query_id


Checks the status of a previously initiated page views query. Returns the current processing status and provides a result URL when the query is complete.


As this is a beta endpoint, it is subject to change or removal at any time without the standard notice periods outlined in the API policy.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| query_id |  | string | The UUID of the query to check status for |


#### Example Request:


```
curl https://<canvas>/api/v1/users/:user_id/page_views/query/:query_id \
  -H 'Authorization: Bearer <token>'
```


#### Example Response:


```
200
{
  "query_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "finished",
  "format": "csv",
  "results_url": "/api/v1/users/123/page_views/query/550e8400-e29b-41d4-a716-446655440000/results"
}
```


```
200
{
  "query_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "processing",
  "format": "csv",
  "results_url": null
}
```


```
200
{
   "query_id": "550e8400-e29b-41d4-a716-446655440000",
   "status": "failed",
   "format": "csv",
   "results_url": null,
   "error_code": "RESULT_SIZE_LIMIT_EXCEEDED"
 }
```


```
400
{
  "error": "Invalid query ID"
}
```


```
404
{
  "error": "The query was not found."
}
```


---

## BETA - Get query resultsPageViewsController#query_results


### GET /api/v1/users/:user_id/page_views/query/:query_id/results


Retrieves the results of a completed page views query. Returns the data in the format specified when the query was initiated (CSV or JSON). The response may be compressed with gzip encoding.


As this is a beta endpoint, it is subject to change or removal at any time without the standard notice periods outlined in the API policy.


Note: PageView payloads use two types of identifiers: globalId and localId. Global identifier is equal to (shardId*10000000000000)+localId. Please note our global identifiers might change if your Canvas instance goes through shard migration process, in this case your current shardId in the global identifier will change to a new shardId. Local identifiers do not change after shard migration and stay unique in the context of the Canvas account. The following fields in the PageView payload are global identifiers: links_user , links_context , links_asset , links_real_user , links_account , developer_key_id , asset_user_access_id .


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| query_id |  | string | The UUID of the completed query to retrieve results for |


#### Example Request:


```
curl https://<canvas>/api/v1/users/:user_id/page_views/query/:query_id/results \
  -H 'Authorization: Bearer <token>'
```


#### Example Response:


```
200
# Returns file download with appropriate Content-Type header
# Content-Type: text/csv (for CSV format)
# Content-Type: application/jsonl (for JSON lines format)
# Content-Encoding: gzip (if compressed)
# Content-Disposition: attachment; filename="550e8400-e29b-41d4-a716-446655440000.csv"
```


```
204
# No Content - Query completed but produced no results
```


```
400
{
  "error": "Query results are not in a valid state for download"
}
```


```
404
{
  "error": "The result for query was not found."
}
```


```
500
{
  "error": "An unexpected error occurred."
}
```


---

## BETA - Initiate batch page views queryPageViewsController#batch_query


### POST /api/v1/users/page_views/query


Initiates an asynchronous query for page views data across multiple users. This method enqueues a background job to process the batch page views query and returns a polling URL that can be used to check the query status and retrieve results when ready.


As this is a beta endpoint, it is subject to change or removal at any time without the standard notice periods outlined in the API policy.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| user_ids |  | Array | Array of user IDs to query page views for. Must contain at least one user ID. Duplicate user IDs are not allowed. |
| start_date |  | string | The start date for the page views query in YYYY-MM-DD format. Must be the first day of a month. |
| end_date |  | string | The end date for the page views query in YYYY-MM-DD format. Must be the first day of a month and after start_date. |
| results_format |  | string | The desired format for the query results. Supported formats: âcsvâ, âjsonlâ |


#### Example Request:


```
curl https://<canvas>/api/v1/users/page_views/query \
  -X POST \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "user_ids": [123, 456, 789],
    "start_date": "2023-01-01",
    "end_date": "2023-02-01",
    "results_format": "csv"
  }'
```


#### Example Response:


```
201
{
  "poll_url": "/api/v1/users/page_views/query/550e8400-e29b-41d4-a716-446655440000"
}
```


```
400
{
  "error": "Page Views received an invalid or malformed request."
}
```


```
429
{
  "error": "Page Views rate limit exceeded. Please wait and try again."
}
```


---

## BETA - Poll batch query statusPageViewsController#poll_batch_query


### GET /api/v1/users/page_views/query/:query_id


Checks the status of a previously initiated batch page views query. Returns the current processing status and provides a result URL when the query is complete.


As this is a beta endpoint, it is subject to change or removal at any time without the standard notice periods outlined in the API policy.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| query_id |  | string | The UUID of the query to check status for |


#### Example Request:


```
curl https://<canvas>/api/v1/users/page_views/query/:query_id \
  -H 'Authorization: Bearer <token>'
```


#### Example Response:


```
200
{
  "query_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "finished",
  "format": "csv",
  "results_url": "/api/v1/users/page_views/query/550e8400-e29b-41d4-a716-446655440000/results"
}
```


```
200
{
  "query_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "finished",
  "format": "csv",
  "results_url": "/api/v1/users/page_views/query/550e8400-e29b-41d4-a716-446655440000/results",
  "warnings": [
    {
      "code": "USER_FILTERED",
      "message": "Filtered out 1 user from batch query: 10000000000002"
    }
  ]
}
```


```
400
{
  "error": "Invalid query ID"
}
```


```
404
{
  "error": "The query was not found."
}
```


---

## BETA - Get batch query resultsPageViewsController#batch_query_results


### GET /api/v1/users/page_views/query/:query_id/results


Retrieves the results of a completed batch page views query. Returns the data in the format specified when the query was initiated (CSV or JSON). The response may be compressed with gzip encoding.


As this is a beta endpoint, it is subject to change or removal at any time without the standard notice periods outlined in the API policy.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| query_id |  | string | The UUID of the completed query to retrieve results for |


#### Example Request:


```
curl https://<canvas>/api/v1/users/page_views/query/:query_id/results \
  -H 'Authorization: Bearer <token>'
```


#### Example Response:


```
200
# Returns file download with appropriate Content-Type header
# Content-Type: text/csv (for CSV format)
# Content-Disposition: attachment; filename="550e8400-e29b-41d4-a716-446655440000.csv"
```


```
204
# No Content - Query completed but produced no results
```


```
400
{
  "error": "Query results are not in a valid state for download"
}
```


```
404
{
  "error": "The result for query was not found."
}
```


```
500
{
  "error": "An unexpected error occurred."
}
```
