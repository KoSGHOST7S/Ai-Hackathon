# Account Notifications

> Canvas API — Accounts & Admin  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Index of active global notification for the userAccountNotificationsController#user_index


### GET /api/v1/accounts/:account_id/account_notifications


Returns a list of all global notifications in the account for the current user Any notifications that have been closed by the user will not be returned, unless a include_past parameter is passed in as true. Admins can request all global notifications for the account by passing in an include_all parameter.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| include_past |  | boolean | Include past and dismissed global announcements. |
| include_all |  | boolean | Include all global announcements, regardless of userâs role or availability date. Only available to account admins. |
| show_is_closed |  | boolean | Include a flag for each notification indicating whether it has been read by the user. |


#### Example Request:


```
curl -H 'Authorization: Bearer <token>' \
https://<canvas>/api/v1/accounts/2/users/self/account_notifications
```


---

## Show a global notificationAccountNotificationsController#show


### GET /api/v1/accounts/:account_id/account_notifications/:id


Returns a global notification for the current user A notification that has been closed by the user will not be returned


#### Example Request:


```
curl -H 'Authorization: Bearer <token>' \
https://<canvas>/api/v1/accounts/2/users/self/account_notifications/4
```


---

## Create a global notificationAccountNotificationsController#create


### POST /api/v1/accounts/:account_id/account_notifications


Create and return a new global notification for an account.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| account_notification[subject] | Required | string | The subject of the notification. |
| account_notification[message] | Required | string | The message body of the notification. |
| account_notification[start_at] | Required | DateTime | The start date and time of the notification in ISO8601 format. e.g. 2014-01-01T01:00Z |
| account_notification[end_at] | Required | DateTime | The end date and time of the notification in ISO8601 format. e.g. 2014-01-01T01:00Z |
| account_notification[icon] |  | string | The icon to display with the notification. Note: Defaults to warning. Allowed values: warning , information , question , error , calendar |
| account_notification_roles[] |  | string | The role(s) to send global notification to.  Note:  ommitting this field will send to everyone Example: account_notification_roles: ["StudentEnrollment", "TeacherEnrollment"] |


#### Example Request:


```
curl -X POST -H 'Authorization: Bearer <token>' \
https://<canvas>/api/v1/accounts/2/account_notifications \
-d 'account_notification[subject]=New notification' \
-d 'account_notification[start_at]=2014-01-01T00:00:00Z' \
-d 'account_notification[end_at]=2014-02-01T00:00:00Z' \
-d 'account_notification[message]=This is a global notification'
```


#### Example Response:


```
{
  "subject": "New notification",
  "start_at": "2014-01-01T00:00:00Z",
  "end_at": "2014-02-01T00:00:00Z",
  "message": "This is a global notification"
}
```


---

## Update a global notificationAccountNotificationsController#update


### PUT /api/v1/accounts/:account_id/account_notifications/:id


Update global notification for an account.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| account_notification[subject] |  | string | The subject of the notification. |
| account_notification[message] |  | string | The message body of the notification. |
| account_notification[start_at] |  | DateTime | The start date and time of the notification in ISO8601 format. e.g. 2014-01-01T01:00Z |
| account_notification[end_at] |  | DateTime | The end date and time of the notification in ISO8601 format. e.g. 2014-01-01T01:00Z |
| account_notification[icon] |  | string | The icon to display with the notification. Allowed values: warning , information , question , error , calendar |
| account_notification_roles[] |  | string | The role(s) to send global notification to.  Note:  ommitting this field will send to everyone Example: account_notification_roles: ["StudentEnrollment", "TeacherEnrollment"] |


#### Example Request:


```
curl -X PUT -H 'Authorization: Bearer <token>' \
https://<canvas>/api/v1/accounts/2/account_notifications/1 \
-d 'account_notification[subject]=New notification' \
-d 'account_notification[start_at]=2014-01-01T00:00:00Z' \
-d 'account_notification[end_at]=2014-02-01T00:00:00Z' \
-d 'account_notification[message]=This is a global notification'
```


#### Example Response:


```
{
  "subject": "New notification",
  "start_at": "2014-01-01T00:00:00Z",
  "end_at": "2014-02-01T00:00:00Z",
  "message": "This is a global notification"
}
```


---

## Close notification for user. Destroy notification for adminAccountNotificationsController#user_close_notification


### DELETE /api/v1/accounts/:account_id/account_notifications/:id


If the current user no longer wants to see this account notification, it can be closed with this call. This affects the current user only.


If the current user is an admin and they pass a remove parameter with a value of âtrueâ, the account notification will be destroyed. This affects all users.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| remove |  | boolean | Destroy the account notification. |


#### Example Request:


```
curl -X DELETE -H 'Authorization: Bearer <token>' \
https://<canvas>/api/v1/accounts/2/account_notifications/4
```
