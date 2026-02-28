# Appointment Groups

> Canvas API — Calendar & Scheduling  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List appointment groupsAppointmentGroupsController#index


### GET /api/v1/appointment_groups


Retrieve the paginated list of appointment groups that can be reserved or managed by the current user.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| scope |  | string | Defaults to âreservableâ Allowed values: reservable , manageable |
| context_codes[] |  | string | Array of context codes used to limit returned results. |
| include_past_appointments |  | boolean | Defaults to false. If true, includes past appointment groups |
| include[] |  | string | Array of additional information to include. âappointmentsâ calendar event time slots for this appointment group âchild_eventsâ reservations of those time slots âparticipant_countâ number of reservations âreserved_timesâ the event id, start time and end time of reservations the current user has made) âall_context_codesâ all context codes associated with this appointment group Allowed values: appointments , child_events , participant_count , reserved_times , all_context_codes |


---

## Create an appointment groupAppointmentGroupsController#create


### POST /api/v1/appointment_groups


Create and return a new appointment group. If new_appointments are specified, the response will return a new_appointments array (same format as appointments array, see âList appointment groupsâ action)


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| appointment_group[context_codes][] | Required | string | Array of context codes (courses, e.g. course_1) this group should be linked to (1 or more). Users in the course(s) with appropriate permissions will be able to sign up for this appointment group. |
| appointment_group[sub_context_codes][] |  | string | Array of sub context codes (course sections or a single group category) this group should be linked to. Used to limit the appointment group to particular sections. If a group category is specified, students will sign up in groups and the participant_type will be âGroupâ instead of âUserâ. |
| appointment_group[title] | Required | string | Short title for the appointment group. |
| appointment_group[description] |  | string | Longer text description of the appointment group. |
| appointment_group[location_name] |  | string | Location name of the appointment group. |
| appointment_group[location_address] |  | string | Location address. |
| appointment_group[publish] |  | boolean | Indicates whether this appointment group should be published (i.e. made available for signup). Once published, an appointment group cannot be unpublished. Defaults to false. |
| appointment_group[participants_per_appointment] |  | integer | Maximum number of participants that may register for each time slot. Defaults to null (no limit). |
| appointment_group[min_appointments_per_participant] |  | integer | Minimum number of time slots a user must register for. If not set, users do not need to sign up for any time slots. |
| appointment_group[max_appointments_per_participant] |  | integer | Maximum number of time slots a user may register for. |
| appointment_group[new_appointments][X][] |  | string | Nested array of start time/end time pairs indicating time slots for this appointment group. Refer to the example request. |
| appointment_group[participant_visibility] |  | string | âprivateâ participants cannot see who has signed up for a particular time slot âprotectedâ participants can see who has signed up.  Defaults to âprivateâ. Allowed values: private , protected |
| appointment_group[allow_observer_signup] |  | boolean | Whether observer users can sign-up for an appointment. Defaults to false. |


#### Example Request:


```
curl 'https://<canvas>/api/v1/appointment_groups.json' \
     -X POST \
     -F 'appointment_group[context_codes][]=course_123' \
     -F 'appointment_group[sub_context_codes][]=course_section_234' \
     -F 'appointment_group[title]=Final Presentation' \
     -F 'appointment_group[participants_per_appointment]=1' \
     -F 'appointment_group[min_appointments_per_participant]=1' \
     -F 'appointment_group[max_appointments_per_participant]=1' \
     -F 'appointment_group[new_appointments][0][]=2012-07-19T21:00:00Z' \
     -F 'appointment_group[new_appointments][0][]=2012-07-19T22:00:00Z' \
     -F 'appointment_group[new_appointments][1][]=2012-07-19T22:00:00Z' \
     -F 'appointment_group[new_appointments][1][]=2012-07-19T23:00:00Z' \
     -H "Authorization: Bearer <token>"
```


---

## Get a single appointment groupAppointmentGroupsController#show


### GET /api/v1/appointment_groups/:id


Returns information for a single appointment group


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| include[] |  | string | Array of additional information to include. See include[] argument of âList appointment groupsâ action. âchild_eventsâ reservations of time slots time slots âappointmentsâ will always be returned âall_context_codesâ all context codes associated with this appointment group Allowed values: child_events , appointments , all_context_codes |


---

## Update an appointment groupAppointmentGroupsController#update


### PUT /api/v1/appointment_groups/:id


Update and return an appointment group. If new_appointments are specified, the response will return a new_appointments array (same format as appointments array, see âList appointment groupsâ action).


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| appointment_group[context_codes][] | Required | string | Array of context codes (courses, e.g. course_1) this group should be linked to (1 or more). Users in the course(s) with appropriate permissions will be able to sign up for this appointment group. |
| appointment_group[sub_context_codes][] |  | string | Array of sub context codes (course sections or a single group category) this group should be linked to. Used to limit the appointment group to particular sections. If a group category is specified, students will sign up in groups and the participant_type will be âGroupâ instead of âUserâ. |
| appointment_group[title] |  | string | Short title for the appointment group. |
| appointment_group[description] |  | string | Longer text description of the appointment group. |
| appointment_group[location_name] |  | string | Location name of the appointment group. |
| appointment_group[location_address] |  | string | Location address. |
| appointment_group[publish] |  | boolean | Indicates whether this appointment group should be published (i.e. made available for signup). Once published, an appointment group cannot be unpublished. Defaults to false. |
| appointment_group[participants_per_appointment] |  | integer | Maximum number of participants that may register for each time slot. Defaults to null (no limit). |
| appointment_group[min_appointments_per_participant] |  | integer | Minimum number of time slots a user must register for. If not set, users do not need to sign up for any time slots. |
| appointment_group[max_appointments_per_participant] |  | integer | Maximum number of time slots a user may register for. |
| appointment_group[new_appointments][X][] |  | string | Nested array of start time/end time pairs indicating time slots for this appointment group. Refer to the example request. |
| appointment_group[participant_visibility] |  | string | âprivateâ participants cannot see who has signed up for a particular time slot âprotectedâ participants can see who has signed up. Defaults to âprivateâ. Allowed values: private , protected |
| appointment_group[allow_observer_signup] |  | boolean | Whether observer users can sign-up for an appointment. |


#### Example Request:


```
curl 'https://<canvas>/api/v1/appointment_groups/543.json' \
     -X PUT \
     -F 'appointment_group[publish]=1' \
     -H "Authorization: Bearer <token>"
```


---

## Delete an appointment groupAppointmentGroupsController#destroy


### DELETE /api/v1/appointment_groups/:id


Delete an appointment group (and associated time slots and reservations) and return the deleted group


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| cancel_reason |  | string | Reason for deleting/canceling the appointment group. |


#### Example Request:


```
curl 'https://<canvas>/api/v1/appointment_groups/543.json' \
     -X DELETE \
     -F 'cancel_reason=El Tigre Chino got fired' \
     -H "Authorization: Bearer <token>"
```


---

## List user participantsAppointmentGroupsController#users


### GET /api/v1/appointment_groups/:id/users


A paginated list of users that are (or may be) participating in this appointment group.  Refer to the Users API for the response fields. Returns no results for appointment groups with the âGroupâ participant_type.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| registration_status |  | string | Limits results to the a given participation status, defaults to âallâ Allowed values: all , registered , registered |


---

## List student group participantsAppointmentGroupsController#groups


### GET /api/v1/appointment_groups/:id/groups


A paginated list of student groups that are (or may be) participating in this appointment group. Refer to the Groups API for the response fields. Returns no results for appointment groups with the âUserâ participant_type.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| registration_status |  | string | Limits results to the a given participation status, defaults to âallâ Allowed values: all , registered , registered |


---

## Get next appointmentAppointmentGroupsController#next_appointment


### GET /api/v1/appointment_groups/next_appointment


Return the next appointment available to sign up for. The appointment is returned in a one-element array. If no future appointments are available, an empty array is returned.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| appointment_group_ids[] |  | string | List of ids of appointment groups to search. |
