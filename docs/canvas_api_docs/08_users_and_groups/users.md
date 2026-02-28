# Users

> Canvas API — Users & Groups  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List users in accountUsersController#api_index


### GET /api/v1/accounts/:account_id/users


A paginated list of users associated with this account.


```
@example_request
  curl https://<canvas>/api/v1/accounts/self/users?search_term=<search value> \
     -X GET \
     -H 'Authorization: Bearer <token>'

```


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| search_term |  | string | The partial name or full ID of the users to match and return in the results list. Must be at least 3 characters. Note that the API will prefer matching on canonical user ID if the ID has a numeric form. It will only search against other fields if non-numeric in form, or if the numeric value doesnât yield any matches. Queries by administrative users will search on SIS ID, Integration ID, login ID, name, or email address |
| enrollment_type |  | string | When set, only return users enrolled with the specified course-level base role. This can be a base role type of âstudentâ, âteacherâ, âtaâ, âobserverâ, or âdesignerâ. |
| sort |  | string | The column to sort results by. For efficiency, use id if you intend to retrieve many pages of results. In the future, other sort options may be rate-limited after 50 pages. Allowed values: username , email , sis_id , integration_id , last_login , id |
| order |  | string | The order to sort the given column by. Allowed values: asc , desc |
| include_deleted_users |  | boolean | When set to true and used with an account context, returns users who have deleted pseudonyms for the context |
| uuids |  | Array | When set, only return users with the specified UUIDs. UUIDs after the first 100 are ignored. |


---

## List the activity streamUsersController#activity_stream


### GET /api/v1/users/self/activity_stream


### GET /api/v1/users/activity_stream


Returns the current userâs global activity stream, paginated.


There are many types of objects that can be returned in the activity stream. All object types have the same basic set of shared attributes:


```
{
  'created_at': '2011-07-13T09:12:00Z',
  'updated_at': '2011-07-25T08:52:41Z',
  'id': 1234,
  'title': 'Stream Item Subject',
  'message': 'This is the body text of the activity stream item. It is plain-text, and can be multiple paragraphs.',
  'type': 'DiscussionTopic|Conversation|Message|Submission|Conference|Collaboration|AssessmentRequest...',
  'read_state': false,
  'context_type': 'course', // course|group
  'course_id': 1,
  'group_id': null,
  'html_url': "http://..." // URL to the Canvas web UI for this stream item
}

```


In addition, each item type has its own set of attributes available.


DiscussionTopic:


```
{
  'type': 'DiscussionTopic',
  'discussion_topic_id': 1234,
  'total_root_discussion_entries': 5,
  'require_initial_post': true,
  'user_has_posted': true,
  'root_discussion_entries': {
    ...
  }
}

```


For DiscussionTopic, the message is truncated at 4kb.


Announcement:


```
{
  'type': 'Announcement',
  'announcement_id': 1234,
  'total_root_discussion_entries': 5,
  'require_initial_post': true,
  'user_has_posted': null,
  'root_discussion_entries': {
    ...
  }
}

```


For Announcement, the message is truncated at 4kb.


Conversation:


```
{
  'type': 'Conversation',
  'conversation_id': 1234,
  'private': false,
  'participant_count': 3,
}

```


Message:


```
{
  'type': 'Message',
  'message_id': 1234,
  'notification_category': 'Assignment Graded'
}

```


Submission:


Returns an Submission with its Course and Assignment data.


Conference:


```
{
  'type': 'Conference',
  'web_conference_id': 1234
}

```


Collaboration:


```
{
  'type': 'Collaboration',
  'collaboration_id': 1234
}

```


AssessmentRequest:


```
{
  'type': 'AssessmentRequest',
  'assessment_request_id': 1234
}

```


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| only_active_courses |  | boolean | If true, will only return objects for courses the user is actively participating in |


---

## Activity stream summaryUsersController#activity_stream_summary


### GET /api/v1/users/self/activity_stream/summary


Returns a summary of the current userâs global activity stream.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| only_active_courses |  | boolean | If true, will only return objects for courses the user is actively participating in |


#### Example Response:


```
[
  {
    "type": "DiscussionTopic",
    "unread_count": 2,
    "count": 7
  },
  {
    "type": "Conversation",
    "unread_count": 0,
    "count": 3
  }
]
```


---

## List the TODO itemsUsersController#todo_items


### GET /api/v1/users/self/todo


A paginated list of the current userâs list of todo items.


There is a limit to the number of items returned.


The ignore and ignore_permanently URLs can be used to update the userâs preferences on what items will be displayed. Performing a DELETE request against the ignore URL will hide that item from future todo item requests, until the item changes. Performing a DELETE request against the ignore_permanently URL will hide that item forever.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| include[] |  | string | âungraded_quizzesâ Optionally include ungraded quizzes (such as practice quizzes and surveys) in the list. These will be returned under a quiz key instead of an assignment key in response elements. Allowed values: ungraded_quizzes |


#### Example Response:


```
[
  {
    'type': 'grading',        // an assignment that needs grading
    'assignment': { .. assignment object .. },
    'ignore': '.. url ..',
    'ignore_permanently': '.. url ..',
    'html_url': '.. url ..',
    'needs_grading_count': 3, // number of submissions that need grading
    'context_type': 'course', // course|group
    'course_id': 1,
    'group_id': null,
  },
  {
    'type' => 'submitting',   // an assignment that needs submitting soon
    'assignment' => { .. assignment object .. },
    'ignore' => '.. url ..',
    'ignore_permanently' => '.. url ..',
    'html_url': '.. url ..',
    'context_type': 'course',
    'course_id': 1,
  },
  {
    'type' => 'submitting',   // a quiz that needs submitting soon
    'quiz' => { .. quiz object .. },
    'ignore' => '.. url ..',
    'ignore_permanently' => '.. url ..',
    'html_url': '.. url ..',
    'context_type': 'course',
    'course_id': 1,
  },
]
```


---

## List counts for todo itemsUsersController#todo_item_count


### GET /api/v1/users/self/todo_item_count


Counts of different todo items such as the number of assignments needing grading as well as the number of assignments needing submitting.


There is a limit to the number of todo items this endpoint will count. It will only look at the first 100 todo items for the user. If the user has more than 100 todo items this count may not be reliable. The largest reliable number for both counts is 100.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| include[] |  | string | âungraded_quizzesâ Optionally include ungraded quizzes (such as practice quizzes and surveys) in the list. These will be returned under a quiz key instead of an assignment key in response elements. Allowed values: ungraded_quizzes |


#### Example Response:


```
{
  needs_grading_count: 32,
  assignments_needing_submitting: 10
}
```


---

## List upcoming assignments, calendar eventsUsersController#upcoming_events


### GET /api/v1/users/self/upcoming_events


A paginated list of the current userâs upcoming events.


#### Example Response:


```
[
  {
    "id"=>597,
    "title"=>"Upcoming Course Event",
    "description"=>"Attendance is correlated with passing!",
    "start_at"=>"2013-04-27T14:33:14Z",
    "end_at"=>"2013-04-27T14:33:14Z",
    "location_name"=>"Red brick house",
    "location_address"=>"110 Top of the Hill Dr.",
    "all_day"=>false,
    "all_day_date"=>nil,
    "created_at"=>"2013-04-26T14:33:14Z",
    "updated_at"=>"2013-04-26T14:33:14Z",
    "workflow_state"=>"active",
    "context_code"=>"course_12938",
    "child_events_count"=>0,
    "child_events"=>[],
    "parent_event_id"=>nil,
    "hidden"=>false,
    "url"=>"http://www.example.com/api/v1/calendar_events/597",
    "html_url"=>"http://www.example.com/calendar?event_id=597&include_contexts=course_12938"
  },
  {
    "id"=>"assignment_9729",
    "title"=>"Upcoming Assignment",
    "description"=>nil,
    "start_at"=>"2013-04-28T14:47:32Z",
    "end_at"=>"2013-04-28T14:47:32Z",
    "all_day"=>false,
    "all_day_date"=>"2013-04-28",
    "created_at"=>"2013-04-26T14:47:32Z",
    "updated_at"=>"2013-04-26T14:47:32Z",
    "workflow_state"=>"published",
    "context_code"=>"course_12942",
    "assignment"=>{
      "id"=>9729,
      "name"=>"Upcoming Assignment",
      "description"=>nil,
      "points_possible"=>10,
      "due_at"=>"2013-04-28T14:47:32Z",
      "assignment_group_id"=>2439,
      "automatic_peer_reviews"=>false,
      "grade_group_students_individually"=>nil,
      "grading_standard_id"=>nil,
      "grading_type"=>"points",
      "group_category_id"=>nil,
      "lock_at"=>nil,
      "peer_reviews"=>false,
      "position"=>1,
      "unlock_at"=>nil,
      "course_id"=>12942,
      "submission_types"=>["none"],
      "needs_grading_count"=>0,
      "html_url"=>"http://www.example.com/courses/12942/assignments/9729"
    },
    "url"=>"http://www.example.com/api/v1/calendar_events/assignment_9729",
    "html_url"=>"http://www.example.com/courses/12942/assignments/9729"
  }
]
```


---

## List Missing SubmissionsUsersController#missing_submissions


### GET /api/v1/users/:user_id/missing_submissions


A paginated list of past-due assignments for which the student does not have a submission. The user sending the request must either be the student, an admin or a parent observer using the parent app


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| user_id |  | string | the studentâs ID |
| observed_user_id |  | string | Return missing submissions for the given observed user. Must be accompanied by course_ids[]. The user making the request must be observing the observed user in all the courses specified by course_ids[]. |
| include[] |  | string | âplanner_overridesâ Optionally include the assignmentâs associated planner override, if it exists, for the current user. These will be returned under a planner_override key âcourseâ Optionally include the assignmentsâ courses Allowed values: planner_overrides , course |
| filter[] |  | string | âsubmittableâ Only return assignments that the current user can submit (i.e. filter out locked assignments) âcurrent_grading_periodâ Only return missing assignments that are in the current grading period Allowed values: submittable , current_grading_period |
| course_ids[] |  | string | Optionally restricts the list of past-due assignments to only those associated with the specified course IDs. Required if observed_user_id is passed. |


---

## Hide a stream itemUsersController#ignore_stream_item


### DELETE /api/v1/users/self/activity_stream/:id


Hide the given stream item.


#### Example Request:


```
curl https://<canvas>/api/v1/users/self/activity_stream/<stream_item_id> \
   -X DELETE \
   -H 'Authorization: Bearer <token>'
```


#### Example Response:


```
{
  "hidden": true
}
```


---

## Hide all stream itemsUsersController#ignore_all_stream_items


### DELETE /api/v1/users/self/activity_stream


Hide all stream items for the user


#### Example Request:


```
curl https://<canvas>/api/v1/users/self/activity_stream \
   -X DELETE \
   -H 'Authorization: Bearer <token>'
```


#### Example Response:


```
{
  "hidden": true
}
```


---

## Upload a fileUsersController#create_file


### POST /api/v1/users/:user_id/files


Upload a file to the userâs personal files section.


This API endpoint is the first step in uploading a file to a userâs files. See the File Upload Documentation for details on the file upload workflow.


Note that typically users will only be able to upload files to their own files section. Passing a user_id of self is an easy shortcut to specify the current user.


---

## Show user detailsUsersController#api_show


### GET /api/v1/users/:id


Shows details for user.


Also includes an attribute âpermissionsâ, a non-comprehensive list of permissions for the user. Example:


```
"permissions": {
 "can_update_name": true, // Whether the user can update their name.
 "can_update_avatar": false, // Whether the user can update their avatar.
 "limit_parent_app_web_access": false // Whether the user can interact with Canvas web from the Canvas Parent app.
}

```


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| include[] |  | string | Array of additional information to include on the user record. âlocaleâ, âavatar_urlâ, âpermissionsâ, âemailâ, and âeffective_localeâ will always be returned Allowed values: uuid , last_login |


#### Example Request:


```
curl https://<canvas>/api/v1/users/self \
    -X GET \
    -H 'Authorization: Bearer <token>'
```


---

## Create a userUsersController#create


### POST /api/v1/accounts/:account_id/users


Create and return a new user and pseudonym for an account.


If you donât have the âModify


login details for usersâ permission, but self-registration is enabled on the account, you can still use this endpoint to register new users. Certain fields will be required, and others will be ignored (see below).


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| user[name] |  | string | The full name of the user. This name will be used by teacher for grading. Required if this is a self-registration. |
| user[short_name] |  | string | Userâs name as it will be displayed in discussions, messages, and comments. |
| user[sortable_name] |  | string | Userâs name as used to sort alphabetically in lists. |
| user[time_zone] |  | string | The time zone for the user. Allowed time zones are IANA time zones or friendlier Ruby on Rails time zones . |
| user[locale] |  | string | The userâs preferred language, from the list of languages Canvas supports. This is in RFC-5646 format. |
| user[terms_of_use] |  | boolean | Whether the user accepts the terms of use. Required if this is a self-registration and this canvas instance requires users to accept the terms (on by default). If this is true, it will mark the user as having accepted the terms of use. |
| user[skip_registration] |  | boolean | Automatically mark the user as registered. If this is true, it is recommended to set "pseudonym[send_confirmation]" to true as well. Otherwise, the user will not receive any messages about their account creation. The users communication channel confirmation can be skipped by setting "communication_channel[skip_confirmation]" to true as well. |
| pseudonym[unique_id] | Required | string | Userâs login ID. If this is a self-registration, it must be a valid email address. |
| pseudonym[password] |  | string | Userâs password. Cannot be set during self-registration. |
| pseudonym[sis_user_id] |  | string | SIS ID for the userâs account. To set this parameter, the caller must be able to manage SIS permissions. |
| pseudonym[integration_id] |  | string | Integration ID for the login. To set this parameter, the caller must be able to manage SIS permissions. The Integration ID is a secondary identifier useful for more complex SIS integrations. |
| pseudonym[send_confirmation] |  | boolean | Send user notification of account creation if true. Automatically set to true during self-registration. |
| pseudonym[force_self_registration] |  | boolean | Send user a self-registration style email if true. Setting it means the users will get a notification asking them to âcomplete the registration processâ by clicking it, setting a password, and letting them in.  Will only be executed on if the user does not need admin approval. Defaults to false unless explicitly provided. |
| pseudonym[authentication_provider_id] |  | string | The authentication provider this login is associated with. Logins associated with a specific provider can only be used with that provider. Legacy providers (LDAP, CAS, SAML) will search for logins associated with them, or unassociated logins. New providers will only search for logins explicitly associated with them. This can be the integer ID of the provider, or the type of the provider (in which case, it will find the first matching provider). |
| communication_channel[type] |  | string | The communication channel type, e.g. âemailâ or âsmsâ. |
| communication_channel[address] |  | string | The communication channel address, e.g. the userâs email address. |
| communication_channel[confirmation_url] |  | boolean | Only valid for account admins. If true, returns the new user account confirmation URL in the response. |
| communication_channel[skip_confirmation] |  | boolean | Only valid for site admins and account admins making requests; If true, the channel is automatically validated and no confirmation email or SMS is sent. Otherwise, the user must respond to a confirmation message to confirm the channel. If this is true, it is recommended to set "pseudonym[send_confirmation]" to true as well. Otherwise, the user will not receive any messages about their account creation. |
| force_validations |  | boolean | If true, validations are performed on the newly created user (and their associated pseudonym) even if the request is made by a privileged user like an admin. When set to false, or not included in the request parameters, any newly created users are subject to validations unless the request is made by a user with a âmanage_user_loginsâ right. In which case, certain validations such as ârequire_acceptance_of_termsâ and ârequire_presence_of_nameâ are not enforced. Use this parameter to return helpful json errors while building users with an admin request. |
| enable_sis_reactivation |  | boolean | When true, will first try to re-activate a deleted user with matching sis_user_id if possible. This is commonly done with user[skip_registration] and communication_channel[skip_confirmation] so that the default communication_channel is also restored. |
| destination |  | URL | If youâre setting the password for the newly created user, you can provide this param with a valid URL pointing into this Canvas installation, and the response will include a destination field thatâs a URL that you can redirect a browser to and have the newly created user automatically logged in. The URL is only valid for a short time, and must match the domain this request is directed to, and be for a well-formed path that Canvas can recognize. |
| initial_enrollment_type |  | string | observer if doing a self-registration with a pairing code. This allows setting the password during user creation. |
| pairing_code[code] |  | string | If provided and valid, will link the new user as an observer to the studentâs whose pairing code is given. |


---

## [DEPRECATED] Self register a userUsersController#create_self_registered_user


### POST /api/v1/accounts/:account_id/self_registration


Self register and return a new user and pseudonym for an account.


If self-registration is enabled on the account, you can use this endpoint to self register new users.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| user[name] | Required | string | The full name of the user. This name will be used by teacher for grading. |
| user[short_name] |  | string | Userâs name as it will be displayed in discussions, messages, and comments. |
| user[sortable_name] |  | string | Userâs name as used to sort alphabetically in lists. |
| user[time_zone] |  | string | The time zone for the user. Allowed time zones are IANA time zones or friendlier Ruby on Rails time zones . |
| user[locale] |  | string | The userâs preferred language, from the list of languages Canvas supports. This is in RFC-5646 format. |
| user[terms_of_use] | Required | boolean | Whether the user accepts the terms of use. |
| pseudonym[unique_id] | Required | string | Userâs login ID. Must be a valid email address. |
| communication_channel[type] |  | string | The communication channel type, e.g. âemailâ or âsmsâ. |
| communication_channel[address] |  | string | The communication channel address, e.g. the userâs email address. |


---

## Update user settings.UsersController#settings


### GET /api/v1/users/:id/settings


### PUT /api/v1/users/:id/settings


Update an existing userâs settings.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| manual_mark_as_read |  | boolean | If true, require user to manually mark discussion posts as read (donât auto-mark as read). |
| release_notes_badge_disabled |  | boolean | If true, hide the badge for new release notes. |
| collapse_global_nav |  | boolean | If true, the userâs page loads with the global navigation collapsed |
| collapse_course_nav |  | boolean | If true, the userâs course pages will load with the course navigation collapsed. |
| hide_dashcard_color_overlays |  | boolean | If true, images on course cards will be presented without being tinted to match the course color. |
| comment_library_suggestions_enabled |  | boolean | If true, suggestions within the comment library will be shown. |
| elementary_dashboard_disabled |  | boolean | If true, will display the userâs preferred class Canvas dashboard view instead of the canvas for elementary view. |
| widget_dashboard_user_preference |  | boolean | If true, enables the widget dashboard for the user. Only applies when the widget_dashboard feature is enabled at the account level. Defaults to true when the feature becomes available. |


#### Example Request:


```
curl 'https://<canvas>/api/v1/users/<user_id>/settings \
  -X PUT \
  -F 'manual_mark_as_read=true'
  -H 'Authorization: Bearer <token>'
```


---

## Get custom colorsUsersController#get_custom_colors


### GET /api/v1/users/:id/colors


Returns all custom colors that have been saved for a user.


#### Example Request:


```
curl 'https://<canvas>/api/v1/users/<user_id>/colors/ \
  -X GET \
  -H 'Authorization: Bearer <token>'
```


#### Example Response:


```
{
  "custom_colors": {
    "course_42": "#abc123",
    "course_88": "#123abc"
  }
}
```


---

## Get custom colorUsersController#get_custom_color


### GET /api/v1/users/:id/colors/:asset_string


Returns the custom colors that have been saved for a user for a given context.


The asset_string parameter should be in the format âcontext_idâ, for example âcourse_42â.


#### Example Request:


```
curl 'https://<canvas>/api/v1/users/<user_id>/colors/<asset_string> \
  -X GET \
  -H 'Authorization: Bearer <token>'
```


#### Example Response:


```
{
  "hexcode": "#abc123"
}
```


---

## Update custom colorUsersController#set_custom_color


### PUT /api/v1/users/:id/colors/:asset_string


Updates a custom color for a user for a given context.  This allows colors for the calendar and elsewhere to be customized on a user basis.


The asset string parameter should be in the format âcontext_idâ, for example âcourse_42â


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| hexcode |  | string | The hexcode of the color to set for the context, if you choose to pass the hexcode as a query parameter rather than in the request body you should NOT include the â#â unless you escape it first. |


#### Example Request:


```
curl 'https://<canvas>/api/v1/users/<user_id>/colors/<asset_string> \
  -X PUT \
  -F 'hexcode=fffeee'
  -H 'Authorization: Bearer <token>'
```


#### Example Response:


```
{
  "hexcode": "#abc123"
}
```


---

## Update text editor preferenceUsersController#set_text_editor_preference


### PUT /api/v1/users/:id/text_editor_preference


Updates a userâs default choice for text editor.  This allows the Choose an Editor propmts to preload the userâs preference.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| text_editor_preference |  | string | The identifier for the editor. Allowed values: block_editor , rce , |


#### Example Request:


```
curl 'https://<canvas>/api/v1/users/<user_id>/prefered_editor \
  -X PUT \
  -F 'text_editor_preference=rce'
  -H 'Authorization: Bearer <token>'
```


#### Example Response:


```
{
  "text_editor_preference": "rce"
}
```


---

## Update files UI version preferenceUsersController#set_files_ui_version_preference


### PUT /api/v1/users/:id/files_ui_version_preference


Updates a userâs default choice for files UI version. This allows the files UI to preload the userâs preference.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| files_ui_version |  | string | The identifier for the files UI version. Allowed values: v1 , v2 |


#### Example Request:


```
curl 'https://<canvas>/api/v1/users/<user_id>/files_ui_version_preference \
  -X PUT \
  -F 'files_ui_version=v2'
  -H 'Authorization: Bearer <token>'
```


#### Example Response:


```
{
  "files_ui_version": "v2"
}
```


---

## Get dashboard positionsUsersController#get_dashboard_positions


### GET /api/v1/users/:id/dashboard_positions


Returns all dashboard positions that have been saved for a user.


#### Example Request:


```
curl 'https://<canvas>/api/v1/users/<user_id>/dashboard_positions/ \
  -X GET \
  -H 'Authorization: Bearer <token>'
```


#### Example Response:


```
{
  "dashboard_positions": {
    "course_42": 2,
    "course_88": 1
  }
}
```


---

## Update dashboard positionsUsersController#set_dashboard_positions


### PUT /api/v1/users/:id/dashboard_positions


Updates the dashboard positions for a user for a given context.  This allows positions for the dashboard cards and elsewhere to be customized on a per user basis.


The asset string parameter should be in the format âcontext_idâ, for example âcourse_42â


#### Example Request:


```
curl 'https://<canvas>/api/v1/users/<user_id>/dashboard_positions/ \
  -X PUT \
  -F 'dashboard_positions[course_42]=1' \
  -F 'dashboard_positions[course_53]=2' \
  -F 'dashboard_positions[course_10]=3' \
  -H 'Authorization: Bearer <token>'
```


#### Example Response:


```
{
  "dashboard_positions": {
    "course_10": 3,
    "course_42": 1,
    "course_53": 2
  }
}
```


---

## Edit a userUsersController#update


### PUT /api/v1/users/:id


Modify an existing user. To modify a userâs login, see the documentation for logins.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| user[name] |  | string | The full name of the user. This name will be used by teacher for grading. |
| user[short_name] |  | string | Userâs name as it will be displayed in discussions, messages, and comments. |
| user[sortable_name] |  | string | Userâs name as used to sort alphabetically in lists. |
| user[time_zone] |  | string | The time zone for the user. Allowed time zones are IANA time zones or friendlier Ruby on Rails time zones . |
| user[email] |  | string | The default email address of the user. |
| user[locale] |  | string | The userâs preferred language, from the list of languages Canvas supports. This is in RFC-5646 format. |
| user[avatar][token] |  | string | A unique representation of the avatar record to assign as the userâs current avatar. This token can be obtained from the user avatars endpoint. This supersedes the user[avatar][url] argument, and if both are included the url will be ignored. Note: this is an internal representation and is subject to change without notice. It should be consumed with this api endpoint and used in the user update endpoint, and should not be constructed by the client. |
| user[avatar][url] |  | string | To set the userâs avatar to point to an external url, do not include a token and instead pass the url here. Warning: For maximum compatibility, please use 128 px square images. |
| user[avatar][state] |  | string | To set the state of userâs avatar. Only valid for account administrator. Allowed values: none , submitted , approved , locked , reported , re_reported |
| user[title] |  | string | Sets a title on the user profile. (See Get user profile .) Profiles must be enabled on the root account. |
| user[bio] |  | string | Sets a bio on the user profile. (See Get user profile .) Profiles must be enabled on the root account. |
| user[pronunciation] |  | string | Sets name pronunciation on the user profile. (See Get user profile .) Profiles and name pronunciation must be enabled on the root account. |
| user[pronouns] |  | string | Sets pronouns on the user profile. Passing an empty string will empty the userâs pronouns Only Available Pronouns set on the root account are allowed Adding and changing pronouns must be enabled on the root account. |
| user[event] |  | string | Suspends or unsuspends all logins for this user that the calling user has permission to Allowed values: suspend , unsuspend |
| override_sis_stickiness |  | boolean | Default is true. If false, any fields containing âstickyâ changes will not be updated. See SIS CSV Format documentation for information on which fields can have SIS stickiness |


#### Example Request:


```
curl 'https://<canvas>/api/v1/users/133' \
     -X PUT \
     -F 'user[name]=Sheldon Cooper' \
     -F 'user[short_name]=Shelly' \
     -F 'user[time_zone]=Pacific Time (US & Canada)' \
     -F 'user[avatar][token]=<opaque_token>' \
     -H "Authorization: Bearer <token>"
```


---

## Terminate all user sessionsUsersController#terminate_sessions


### DELETE /api/v1/users/:id/sessions


Terminates all sessions for a user. This includes all browser-based sessions and all access tokens, including manually generated ones. The user can immediately re-authenticate to access Canvas again if they have the current credentials. All integrations will need to be re-authorized.


---

## Log users out of all mobile appsUsersController#expire_mobile_sessions


### DELETE /api/v1/users/mobile_sessions


### DELETE /api/v1/users/:id/mobile_sessions


Permanently expires any active mobile sessions, forcing them to re-authorize.


The route that takes a user id will expire mobile sessions for that user. The route that doesnât take a user id will expire mobile sessions for all users in the institution (except for account administrators if skip_admins is given).


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| skip_admins |  | boolean | If true, will not expire mobile sessions for account administrators. |


---

## Merge user into another userUsersController#merge_into


### PUT /api/v1/users/:id/merge_into/:destination_user_id


### PUT /api/v1/users/:id/merge_into/accounts/:destination_account_id/users/:destination_user_id


Merge a user into another user. To merge users, the caller must have permissions to manage both users. This should be considered irreversible. This will delete the user and move all the data into the destination user.


User merge details and caveats: The from_user is the user that was deleted in the user_merge process. The destination_user is the user that remains, that is being split.


Avatars: When both users have avatars, only the destination_users avatar will remain. When one user has an avatar, it will end up on the destination_user.


Terms of Use: If either user has accepted terms of use, it will be be left as accepted.


Communication Channels: All unique communication channels moved to the destination_user. All notification preferences are moved to the destination_user.


Enrollments: All unique enrollments are moved to the destination_user. When there is an enrollment that would end up making it so that a user would be observing themselves, the enrollment is not moved over. Everything that is tied to the from_user at the course level relating to the enrollment is also moved to the destination_user.


Submissions: All submissions are moved to the destination_user. If there are enrollments for both users in the same course, we prefer submissions that have grades then submissions that have work in them, and if there are no grades or no work, they are not moved.


Other notes: Access Tokens are moved on merge. Conversations are moved on merge. Favorites are moved on merge. Courses will commonly use LTI tools. LTI tools reference the user with IDs that are stored on a user object. Merging users deletes one user and moves all records from the deleted user to the destination_user. These IDs are kept for all enrollments, group_membership, and account_users for the from_user at the time of the merge. When the destination_user launches an LTI tool from a course that used to be the from_userâs, it doesnât appear as a new user to the tool provider. Instead it will send the stored ids. The destination_userâs LTI IDs remain as they were for the courses that they originally had. Future enrollments for the destination_user will use the IDs that are on the destination_user object. LTI IDs that are kept and tracked per context include lti_context_id, lti_id and uuid. APIs that return the LTI ids will return the one for the context that it is called for, except for the user uuid. The user UUID will display the destination_users uuid, and when getting the uuid from an api that is in a context that was recorded from a merge event, an additional attribute is added as past_uuid.


When finding users by SIS ids in different accounts the destination_account_id is required.


The account can also be identified by passing the domain in destination_account_id.


#### Example Request:


```
curl https://<canvas>/api/v1/users/<user_id>/merge_into/<destination_user_id> \
     -X PUT \
     -H 'Authorization: Bearer <token>'
```


```
curl https://<canvas>/api/v1/users/<user_id>/merge_into/accounts/<destination_account_id>/users/<destination_user_id> \
     -X PUT \
     -H 'Authorization: Bearer <token>'
```


---

## Split merged users into separate usersUsersController#split


### POST /api/v1/users/:id/split


Merged users cannot be fully restored to their previous state, but this will attempt to split as much as possible to the previous state. To split a merged user, the caller must have permissions to manage all of the users logins. If there are multiple users that have been merged into one user it will split each merge into a separate user. A split can only happen within 180 days of a user merge. A user merge deletes the previous user and may be permanently deleted. In this scenario we create a new user object and proceed to move as much as possible to the new user. The user object will not have preserved the name or settings from the previous user. Some items may have been deleted during a user_merge that cannot be restored, and/or the data has become stale because of other changes to the objects since the time of the user_merge.


Split users details and caveats:


The from_user is the user that was deleted in the user_merge process. The destination_user is the user that remains, that is being split.


Avatars: When both users had avatars, both will be remain. When from_user had an avatar and destination_user did not have an avatar, the destination_userâs avatar will be deleted if it still matches what was there are the time of the merge. If the destination_userâs avatar was changed at anytime after the merge, it will remain on the destination user. If the from_user had an avatar it will be there after split.


Terms of Use: If from_user had not accepted terms of use, they will be prompted again to accept terms of use after the split. If the destination_user had not accepted terms of use, hey will be prompted again to accept terms of use after the split. If neither user had accepted the terms of use, but since the time of the merge had accepted, both will be prompted to accept terms of use. If both had accepted terms of use, this will remain.


Communication Channels: All communication channels are restored to what they were prior to the merge. If a communication channel was added after the merge, it will remain on the destination_user. Notification preferences remain with the communication channels.


Enrollments: All enrollments from the time of the merge will be moved back to where they were. Enrollments created since the time of the merge that were created by sis_import will go to the user that owns that sis_id used for the import. Other new enrollments will remain on the destination_user. Everything that is tied to the destination_user at the course level relating to an enrollment is moved to the from_user. When both users are in the same course prior to merge this can cause some unexpected items to move.


Submissions: Unlike other items tied to a course, submissions are explicitly recorded to avoid problems with grades. All submissions were moved are restored to the spot prior to merge. All submission that were created in a course that was moved in enrollments are moved over to the from_user.


Other notes: Access Tokens are moved back on split. Conversations are moved back on split. Favorites that existing at the time of merge are moved back on split. LTI ids are restored to how they were prior to merge.


#### Example Request:


```
curl https://<canvas>/api/v1/users/<user_id>/split \
     -X POST \
     -H 'Authorization: Bearer <token>'
```


---

## Get a Pandata Events jwt token and its expiration dateUsersController#pandata_events_token


### POST /api/v1/users/self/pandata_events_token


Returns a jwt auth and props token that can be used to send events to Pandata.


NOTE: This is currently only available to the mobile developer keys.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| app_key |  | string | The pandata events appKey for this mobile app |


#### Example Request:


```
curl https://<canvas>/api/v1/users/self/pandata_events_token \
     -X POST \
     -H 'Authorization: Bearer <token>'
     -F 'app_key=MOBILE_APPS_KEY' \
```


#### Example Response:


```
{
  "url": "https://example.com/pandata/events"
  "auth_token": "wek23klsdnsoieioeoi3of9deeo8r8eo8fdn",
  "props_token": "paowinefopwienpfiownepfiownepfownef",
  "expires_at": 1521667783000,
}
```


---

## Get a users most recently graded submissionsUsersController#user_graded_submissions


### GET /api/v1/users/:id/graded_submissions


Returns a list of the userâs most recently graded submissions.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| include[] |  | string | Associations to include with the group Allowed values: assignment |
| only_current_enrollments |  | boolean | Returns submissions for only currently active enrollments |
| only_published_assignments |  | boolean | Returns submissions for only published assignments |


#### Example Request:


```
curl https://<canvas>/api/v1/users/<user_id>/graded_submissions \
     -X POST \
     -H 'Authorization: Bearer <token>'
```
