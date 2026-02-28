# Calendar Events

> Canvas API — Calendar & Scheduling  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List calendar eventsCalendarEventsApiController#index


### GET /api/v1/calendar_events


Retrieve the paginated list of calendar events or assignments for the current user


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| type |  | string | Defaults to âeventâ Allowed values: event , assignment , sub_assignment |
| start_date |  | Date | Only return events since the start_date (inclusive). Defaults to today. The value should be formatted as: yyyy-mm-dd or ISO 8601 YYYY-MM-DDTHH:MM:SSZ. |
| end_date |  | Date | Only return events before the end_date (inclusive). Defaults to start_date. The value should be formatted as: yyyy-mm-dd or ISO 8601 YYYY-MM-DDTHH:MM:SSZ. If end_date is the same as start_date, then only events on that day are returned. |
| undated |  | boolean | Defaults to false (dated events only). If true, only return undated events and ignore start_date and end_date. |
| all_events |  | boolean | Defaults to false (uses start_date, end_date, and undated criteria). If true, all events are returned, ignoring start_date, end_date, and undated criteria. |
| context_codes[] |  | string | List of context codes of courses, groups, users, or accounts whose events you want to see. If not specified, defaults to the current user (i.e personal calendar, no course/group events). Limited to 10 context codes, additional ones are ignored. The format of this field is the context type, followed by an underscore, followed by the context id. For example: course_42 |
| excludes[] |  | Array | Array of attributes to exclude. Possible values are âdescriptionâ, âchild_eventsâ and âassignmentâ |
| includes[] |  | Array | Array of optional attributes to include. Possible values are âweb_conferenceâ and âseries_natural_languageâ |
| important_dates |  | boolean | Defaults to false. If true, only events with important dates set to true will be returned. |
| blackout_date |  | boolean | Defaults to false. If true, only events with blackout date set to true will be returned. |


---

## List calendar events for a userCalendarEventsApiController#user_index


### GET /api/v1/users/:user_id/calendar_events


Retrieve the paginated list of calendar events or assignments for the specified user. To view calendar events for a user other than yourself, you must either be an observer of that user or an administrator.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| type |  | string | Defaults to âeventâ Allowed values: event , assignment |
| start_date |  | Date | Only return events since the start_date (inclusive). Defaults to today. The value should be formatted as: yyyy-mm-dd or ISO 8601 YYYY-MM-DDTHH:MM:SSZ. |
| end_date |  | Date | Only return events before the end_date (inclusive). Defaults to start_date. The value should be formatted as: yyyy-mm-dd or ISO 8601 YYYY-MM-DDTHH:MM:SSZ. If end_date is the same as start_date, then only events on that day are returned. |
| undated |  | boolean | Defaults to false (dated events only). If true, only return undated events and ignore start_date and end_date. |
| all_events |  | boolean | Defaults to false (uses start_date, end_date, and undated criteria). If true, all events are returned, ignoring start_date, end_date, and undated criteria. |
| context_codes[] |  | string | List of context codes of courses, groups, users, or accounts whose events you want to see. If not specified, defaults to the current user (i.e personal calendar, no course/group events). Limited to 10 context codes, additional ones are ignored. The format of this field is the context type, followed by an underscore, followed by the context id. For example: course_42 |
| excludes[] |  | Array | Array of attributes to exclude. Possible values are âdescriptionâ, âchild_eventsâ and âassignmentâ |
| submission_types[] |  | Array | When type is âassignmentâ, specifies the allowable submission types for returned assignments. Ignored if type is not âassignmentâ or if exclude_submission_types is provided. |
| exclude_submission_types[] |  | Array | When type is âassignmentâ, specifies the submission types to be excluded from the returned assignments. Ignored if type is not âassignmentâ. |
| includes[] |  | Array | Array of optional attributes to include. Possible values are âweb_conferenceâ and âseries_natural_languageâ |
| important_dates |  | boolean | Defaults to false If true, only events with important dates set to true will be returned. |
| blackout_date |  | boolean | Defaults to false If true, only events with blackout date set to true will be returned. |


---

## Create a calendar eventCalendarEventsApiController#create


### POST /api/v1/calendar_events


Create and return a new calendar event


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| calendar_event[context_code] | Required | string | Context code of the course, group, user, or account whose calendar this event should be added to. |
| calendar_event[title] |  | string | Short title for the calendar event. |
| calendar_event[description] |  | string | Longer HTML description of the event. |
| calendar_event[start_at] |  | DateTime | Start date/time of the event. |
| calendar_event[end_at] |  | DateTime | End date/time of the event. |
| calendar_event[location_name] |  | string | Location name of the event. |
| calendar_event[location_address] |  | string | Location address |
| calendar_event[time_zone_edited] |  | string | Time zone of the user editing the event. Allowed time zones are IANA time zones or friendlier Ruby on Rails time zones . |
| calendar_event[all_day] |  | boolean | When true event is considered to span the whole day and times are ignored. |
| calendar_event[child_event_data][X][start_at] |  | DateTime | Section-level start time(s) if this is a course event. X can be any identifier, provided that it is consistent across the start_at, end_at and context_code |
| calendar_event[child_event_data][X][end_at] |  | DateTime | Section-level end time(s) if this is a course event. |
| calendar_event[child_event_data][X][context_code] |  | string | Context code(s) corresponding to the section-level start and end time(s). |
| calendar_event[duplicate][count] |  | number | Number of times to copy/duplicate the event.  Count cannot exceed 200. |
| calendar_event[duplicate][interval] |  | number | Defaults to 1 if duplicate count is set.  The interval between the duplicated events. |
| calendar_event[duplicate][frequency] |  | string | Defaults to âweeklyâ.  The frequency at which to duplicate the event Allowed values: daily , weekly , monthly |
| calendar_event[duplicate][append_iterator] |  | boolean | Defaults to false.  If set to true , an increasing counter number will be appended to the event title when the event is duplicated.  (e.g. Event 1, Event 2, Event 3, etc) |
| calendar_event[rrule] |  | string | The recurrence rule to create a series of recurring events. Its value is the iCalendar RRULE defining how the event repeats. Unending series not supported. |
| calendar_event[blackout_date] |  | boolean | If the blackout_date is true, this event represents a holiday or some other special day that does not count in course pacing. |


#### Example Request:


```
curl 'https://<canvas>/api/v1/calendar_events.json' \
     -X POST \
     -F 'calendar_event[context_code]=course_123' \
     -F 'calendar_event[title]=Paintball Fight!' \
     -F 'calendar_event[start_at]=2012-07-19T21:00:00Z' \
     -F 'calendar_event[end_at]=2012-07-19T22:00:00Z' \
     -H "Authorization: Bearer <token>"
```


---

## Get a single calendar event or assignmentCalendarEventsApiController#show


### GET /api/v1/calendar_events/:id


Returns detailed information about a specific calendar event or assignment.


---

## Reserve a time slotCalendarEventsApiController#reserve


### POST /api/v1/calendar_events/:id/reservations


### POST /api/v1/calendar_events/:id/reservations/:participant_id


Reserves a particular time slot and return the new reservation


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| participant_id |  | string | User or group id for whom you are making the reservation (depends on the participant type). Defaults to the current user (or userâs candidate group). |
| comments |  | string | Comments to associate with this reservation |
| cancel_existing |  | boolean | Defaults to false. If true, cancel any previous reservation(s) for this participant and appointment group. |


#### Example Request:


```
curl 'https://<canvas>/api/v1/calendar_events/345/reservations.json' \
     -X POST \
     -F 'cancel_existing=true' \
     -H "Authorization: Bearer <token>"
```


---

## Update a calendar eventCalendarEventsApiController#update


### PUT /api/v1/calendar_events/:id


Update and return a calendar event


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| calendar_event[context_code] |  | string | Context code of the course, group, user, or account to move this event to. Scheduler appointments and events with section-specific times cannot be moved between calendars. |
| calendar_event[title] |  | string | Short title for the calendar event. |
| calendar_event[description] |  | string | Longer HTML description of the event. |
| calendar_event[start_at] |  | DateTime | Start date/time of the event. |
| calendar_event[end_at] |  | DateTime | End date/time of the event. |
| calendar_event[location_name] |  | string | Location name of the event. |
| calendar_event[location_address] |  | string | Location address |
| calendar_event[time_zone_edited] |  | string | Time zone of the user editing the event. Allowed time zones are IANA time zones or friendlier Ruby on Rails time zones . |
| calendar_event[all_day] |  | boolean | When true event is considered to span the whole day and times are ignored. |
| calendar_event[child_event_data][X][start_at] |  | DateTime | Section-level start time(s) if this is a course event. X can be any identifier, provided that it is consistent across the start_at, end_at and context_code |
| calendar_event[child_event_data][X][end_at] |  | DateTime | Section-level end time(s) if this is a course event. |
| calendar_event[child_event_data][X][context_code] |  | string | Context code(s) corresponding to the section-level start and end time(s). |
| calendar_event[rrule] |  | string | Valid if the event whose ID is in the URL is part of a series. This defines the shape of the recurring event series after itâs updated. Its value is the iCalendar RRULE. Unending series are not supported. |
| which |  | string | Valid if the event whose ID is in the URL is part of a series. Update just the event whose ID is in in the URL, all events in the series, or the given event and all those following. Some updates may create a new series. For example, changing the start time of this and all following events from the middle of a series. Allowed values: one , all , following |
| calendar_event[blackout_date] |  | boolean | If the blackout_date is true, this event represents a holiday or some other special day that does not count in course pacing. |


#### Example Request:


```
curl 'https://<canvas>/api/v1/calendar_events/234' \
     -X PUT \
     -F 'calendar_event[title]=Epic Paintball Fight!' \
     -H "Authorization: Bearer <token>"
```


---

## Delete a calendar eventCalendarEventsApiController#destroy


### DELETE /api/v1/calendar_events/:id


Delete an event from the calendar and return the deleted event


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| cancel_reason |  | string | Reason for deleting/canceling the event. |
| which |  | string | Valid if the event whose ID is in the URL is part of a series. Delete just the event whose ID is in in the URL, all events in the series, or the given event and all those following. Allowed values: one , all , following |


#### Example Request:


```
curl 'https://<canvas>/api/v1/calendar_events/234' \
     -X DELETE \
     -F 'cancel_reason=Greendale layed off the janitorial staff :(' \
     -F 'which=following'
     -H "Authorization: Bearer <token>"
```


---

## Save enabled account calendarsCalendarEventsApiController#save_enabled_account_calendars


### POST /api/v1/calendar_events/save_enabled_account_calendars


Creates and updates the enabled_account_calendars and mark_feature_as_seen user preferences


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| mark_feature_as_seen |  | boolean | Flag to mark account calendars feature as seen |
| enabled_account_calendars[] |  | Array | An array of account Ids to remember in the calendars list of the user |


#### Example Request:


```
curl 'https://<canvas>/api/v1/calendar_events/save_enabled_account_calendars' \
     -X POST \
     -F 'mark_feature_as_seen=true' \
     -F 'enabled_account_calendars[]=1' \
     -F 'enabled_account_calendars[]=2' \
     -H "Authorization: Bearer <token>"
```


---

## Set a course timetableCalendarEventsApiController#set_course_timetable


### POST /api/v1/courses/:course_id/calendar_events/timetable


Creates and updates âtimetableâ events for a course. Can automaticaly generate a series of calendar events based on simple schedules (e.g. âMonday and Wednesday at 2:00pmâ )


Existing timetable events for the course and course sections will be updated if they still are part of the timetable. Otherwise, they will be deleted.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| timetables[course_section_id][] |  | Array | An array of timetable objects for the course section specified by course_section_id. If course_section_id is set to âallâ, events will be created for the entire course. |
| timetables[course_section_id][][weekdays] |  | string | A comma-separated list of abbreviated weekdays (Mon-Monday, Tue-Tuesday, Wed-Wednesday, Thu-Thursday, Fri-Friday, Sat-Saturday, Sun-Sunday) |
| timetables[course_section_id][][start_time] |  | string | Time to start each event at (e.g. â9:00 amâ) |
| timetables[course_section_id][][end_time] |  | string | Time to end each event at (e.g. â9:00 amâ) |
| timetables[course_section_id][][location_name] |  | string | A location name to set for each event |


#### Example Request:


```
curl 'https://<canvas>/api/v1/calendar_events/timetable' \
     -X POST \
     -F 'timetables[all][][weekdays]=Mon,Wed,Fri' \
     -F 'timetables[all][][start_time]=11:00 am' \
     -F 'timetables[all][][end_time]=11:50 am' \
     -F 'timetables[all][][location_name]=Room 237' \
     -H "Authorization: Bearer <token>"
```


---

## Get course timetableCalendarEventsApiController#get_course_timetable


### GET /api/v1/courses/:course_id/calendar_events/timetable


Returns the last timetable set by the Set a course timetable endpoint


---

## Create or update events directly for a course timetableCalendarEventsApiController#set_course_timetable_events


### POST /api/v1/courses/:course_id/calendar_events/timetable_events


Creates and updates âtimetableâ events for a course or course section. Similar to setting a course timetable , but instead of generating a list of events based on a timetable schedule, this endpoint expects a complete list of events.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| course_section_id |  | string | Events will be created for the course section specified by course_section_id. If not present, events will be created for the entire course. |
| events[] |  | Array | An array of event objects to use. |
| events[][start_at] |  | DateTime | Start time for the event |
| events[][end_at] |  | DateTime | End time for the event |
| events[][location_name] |  | string | Location name for the event |
| events[][code] |  | string | A unique identifier that can be used to update the event at a later time If one is not specified, an identifier will be generated based on the start and end times |
| events[][title] |  | string | Title for the meeting. If not present, will default to the associated courseâs name |
