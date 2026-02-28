# Sections

> Canvas API — Courses  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List course sectionsSectionsController#index


### GET /api/v1/courses/:course_id/sections


A paginated list of the list of sections for this course.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| include[] |  | string | âstudentsâ: Associations to include with the group. Note: this is only available if you have permission to view users or grades in the course âavatar_urlâ: Include the avatar URLs for students returned. âenrollmentsâ: If âstudentsâ is also included, return the section enrollment for each student âtotal_studentsâ: Returns the total amount of active and invited students for the course section âpassback_statusâ: Include the grade passback status. âpermissionsâ: Include whether section grants :manage_calendar permission to the caller Allowed values: students , avatar_url , enrollments , total_students , passback_status , permissions |
| search_term |  | string | When included, searches course sections for the term. Returns only matching results. Term must be at least 2 characters. |


---

## Create course sectionSectionsController#create


### POST /api/v1/courses/:course_id/sections


Creates a new section for this course.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| course_section[name] |  | string | The name of the section |
| course_section[sis_section_id] |  | string | The sis ID of the section. Must have manage_sis permission to set. This is ignored if caller does not have permission to set. |
| course_section[integration_id] |  | string | The integration_id of the section. Must have manage_sis permission to set. This is ignored if caller does not have permission to set. |
| course_section[start_at] |  | DateTime | Section start date in ISO8601 format, e.g. 2011-01-01T01:00Z |
| course_section[end_at] |  | DateTime | Section end date in ISO8601 format. e.g. 2011-01-01T01:00Z |
| course_section[restrict_enrollments_to_section_dates] |  | boolean | Set to true to restrict user enrollments to the start and end dates of the section. |
| enable_sis_reactivation |  | boolean | When true, will first try to re-activate a deleted section with matching sis_section_id if possible. |


---

## Cross-list a SectionSectionsController#crosslist


### POST /api/v1/sections/:id/crosslist/:new_course_id


Move the Section to another course.  The new course may be in a different account (department), but must belong to the same root account (institution).


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| override_sis_stickiness |  | boolean | Default is true. If false, any fields containing âstickyâ changes will not be updated. See SIS CSV Format documentation for information on which fields can have SIS stickiness |


---

## De-cross-list a SectionSectionsController#uncrosslist


### DELETE /api/v1/sections/:id/crosslist


Undo cross-listing of a Section, returning it to its original course.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| override_sis_stickiness |  | boolean | Default is true. If false, any fields containing âstickyâ changes will not be updated. See SIS CSV Format documentation for information on which fields can have SIS stickiness |


---

## Edit a sectionSectionsController#update


### PUT /api/v1/sections/:id


Modify an existing section.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| course_section[name] |  | string | The name of the section |
| course_section[sis_section_id] |  | string | The sis ID of the section. Must have manage_sis permission to set. |
| course_section[integration_id] |  | string | The integration_id of the section. Must have manage_sis permission to set. |
| course_section[start_at] |  | DateTime | Section start date in ISO8601 format, e.g. 2011-01-01T01:00Z |
| course_section[end_at] |  | DateTime | Section end date in ISO8601 format. e.g. 2011-01-01T01:00Z |
| course_section[restrict_enrollments_to_section_dates] |  | boolean | Set to true to restrict user enrollments to the start and end dates of the section. |
| override_sis_stickiness |  | boolean | Default is true. If false, any fields containing âstickyâ changes will not be updated. See SIS CSV Format documentation for information on which fields can have SIS stickiness |


---

## Get section informationSectionsController#show


### GET /api/v1/courses/:course_id/sections/:id


### GET /api/v1/sections/:id


Gets details about a specific section


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| include[] |  | string | âstudentsâ: Associations to include with the group. Note: this is only available if you have permission to view users or grades in the course âavatar_urlâ: Include the avatar URLs for students returned. âenrollmentsâ: If âstudentsâ is also included, return the section enrollment for each student âtotal_studentsâ: Returns the total amount of active and invited students for the course section âpassback_statusâ: Include the grade passback status. âpermissionsâ: Include whether section grants :manage_calendar permission to the caller Allowed values: students , avatar_url , enrollments , total_students , passback_status , permissions |


---

## Delete a sectionSectionsController#destroy


### DELETE /api/v1/sections/:id


Delete an existing section.  Returns the former Section.


---

## List section's usersSectionsController#users


### GET /api/v1/sections/:id/users


Returns a paginated list of users in the section.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| search_term |  | string | The partial name or full ID of the users to match and return in the results list. Must be at least 2 characters. |
| include[] |  | string | âavatar_urlâ: Include usersâ avatar_urls. Allowed values: avatar_url |
| exclude_inactive |  | boolean | Whether to filter out inactive users from the results. Defaults to false unless explicitly provided. |
| enrollment_type |  | string | When set, only return users with the specified enrollment type for the given section. Allowed values: teacher , student , ta , observer , designer |


#### Example Request:


```
curl https://<canvas>/api/v1/sections/1/users \
     -H 'Authorization: Bearer <token>'
```
