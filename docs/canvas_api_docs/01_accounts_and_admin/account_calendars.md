# Account Calendars

> Canvas API — Accounts & Admin  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List available account calendarsAccountCalendarsApiController#index


### GET /api/v1/account_calendars


Returns a paginated list of account calendars available to the current user. Includes visible account calendars where the user has an account association.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| search_term |  | string | When included, searches available account calendars for the term. Returns matching results. Term must be at least 2 characters. |


#### Example Request:


```
curl https://<canvas>/api/v1/account_calendars \
  -H 'Authorization: Bearer <token>'
```


---

## Get a single account calendarAccountCalendarsApiController#show


### GET /api/v1/account_calendars/:account_id


Get details about a specific account calendar.


#### Example Request:


```
curl https://<canvas>/api/v1/account_calendars/204 \
  -H 'Authorization: Bearer <token>'
```


---

## Update a calendarAccountCalendarsApiController#update


### PUT /api/v1/account_calendars/:account_id


Set an account calendarâs visibility and auto_subscribe values. Requires the manage_account_calendar_visibility permission on the account.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| visible |  | boolean | Allow administrators with manage_account_calendar_events permission to create events on this calendar, and allow users to view this calendar and its events. |
| auto_subscribe |  | boolean | When true, users will automatically see events from this account in their calendar, even if they havenât manually added that calendar. |


#### Example Request:


```
curl https://<canvas>/api/v1/account_calendars/204 \
  -X PUT \
  -H 'Authorization: Bearer <token>' \
  -d 'visible=false' \
  -d 'auto_subscribe=false'
```


---

## Update several calendarsAccountCalendarsApiController#bulk_update


### PUT /api/v1/accounts/:account_id/account_calendars


Set visibility and/or auto_subscribe on many calendars simultaneously. Requires the manage_account_calendar_visibility permission on the account.


Accepts a JSON array of objects containing 2-3 keys each: id (the accountâs id, required), visible (a boolean indicating whether the account calendar is visible), and auto_subscribe (a boolean indicating whether users should see these events in their calendar without manually subscribing).


Returns the count of updated accounts.


#### Example Request:


```
curl https://<canvas>/api/v1/accounts/1/account_calendars \
  -X PUT \
  -H 'Authorization: Bearer <token>' \
  --data '[{"id": 1, "visible": true, "auto_subscribe": false}, {"id": 13, "visible": false, "auto_subscribe": true}]'
```


---

## List all account calendarsAccountCalendarsApiController#all_calendars


### GET /api/v1/accounts/:account_id/account_calendars


Returns a paginated list of account calendars for the provided account and its first level of sub-accounts. Includes hidden calendars in the response. Requires the manage_account_calendar_visibility permission.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| search_term |  | string | When included, searches all descendent accounts of provided account for the term. Returns matching results. Term must be at least 2 characters. Can be combined with a filter value. |
| filter |  | string | When included, only returns calendars that are either visible or hidden. Can be combined with a search term. Allowed values: visible , hidden |


#### Example Request:


```
curl https://<canvas>/api/v1/accounts/1/account_calendars \
  -H 'Authorization: Bearer <token>'
```


---

## Count of all visible account calendarsAccountCalendarsApiController#visible_calendars_count


### GET /api/v1/accounts/:account_id/visible_calendars_count


Returns the number of visible account calendars.


#### Example Request:


```
curl https://<canvas>/api/v1/accounts/1/visible_calendars_count \
  -H 'Authorization: Bearer <token>'
```
