# Comm Messages

> Canvas API — Users & Groups  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List of CommMessages for a userCommMessagesApiController#index


### GET /api/v1/comm_messages


Retrieve a paginated list of messages sent to a user.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| user_id | Required | string | The user id for whom you want to retrieve CommMessages |
| start_time |  | DateTime | The beginning of the time range you want to retrieve message from. Up to a year prior to the current date is available. |
| end_time |  | DateTime | The end of the time range you want to retrieve messages for. Up to a year prior to the current date is available. |
