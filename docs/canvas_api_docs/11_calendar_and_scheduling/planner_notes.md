# Planner Notes

> Canvas API — Calendar & Scheduling  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List planner notesPlannerNotesController#index


### GET /api/v1/planner_notes


Retrieve the paginated list of planner notes


Retrieve planner note for a user


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| start_date |  | DateTime | Only return notes with todo dates since the start_date (inclusive). No default. The value should be formatted as: yyyy-mm-dd or ISO 8601 YYYY-MM-DDTHH:MM:SSZ. |
| end_date |  | DateTime | Only return notes with todo dates before the end_date (inclusive). No default. The value should be formatted as: yyyy-mm-dd or ISO 8601 YYYY-MM-DDTHH:MM:SSZ. If end_date and start_date are both specified and equivalent, then only notes with todo dates on that day are returned. |
| context_codes[] |  | string | List of context codes of courses whose notes you want to see. If not specified, defaults to all contexts that the user belongs to. The format of this field is the context type, followed by an underscore, followed by the context id. For example: course_42 Including a code matching the userâs own context code (e.g. user_1) will include notes that are not associated with any particular course. |


#### Example Response:


```
[
  {
    'id': 4,
    'title': 'Bring bio book',
    'description': 'bring bio book for friend tomorrow',
    'user_id': 1238,
    'course_id': 4567,  // If the user assigns a note to a course
    'todo_date': "2017-05-09T10:12:00Z",
    'workflow_state': "active",
  },
  {
    'id': 5,
    'title': 'Bring english book',
    'description': 'bring english book to class tomorrow',
    'user_id': 1234,
    'todo_date': "2017-05-09T10:12:00Z",
    'workflow_state': "active",
  },
]
```


---

## Show a planner notePlannerNotesController#show


### GET /api/v1/planner_notes/:id


Retrieve a planner note for the current user


---

## Update a planner notePlannerNotesController#update


### PUT /api/v1/planner_notes/:id


Update a planner note for the current user


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| title |  | string | The title of the planner note. |
| details |  | string | Text of the planner note. |
| todo_date |  | Date | The date where this planner note should appear in the planner. The value should be formatted as: yyyy-mm-dd. |
| course_id |  | integer | The ID of the course to associate with the planner note. The caller must be able to view the course in order to associate it with a planner note. Use a null or empty value to remove a planner note from a course. Note that if the planner note is linked to a learning object, its course_id cannot be changed. |


---

## Create a planner notePlannerNotesController#create


### POST /api/v1/planner_notes


Create a planner note for the current user


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| title |  | string | The title of the planner note. |
| details |  | string | Text of the planner note. |
| todo_date |  | Date | The date where this planner note should appear in the planner. The value should be formatted as: yyyy-mm-dd. |
| course_id |  | integer | The ID of the course to associate with the planner note. The caller must be able to view the course in order to associate it with a planner note. |
| linked_object_type |  | string | The type of a learning object to link to this planner note. Must be used in conjunction wtih linked_object_id and course_id. Valid linked_object_type values are: âannouncementâ, âassignmentâ, âdiscussion_topicâ, âwiki_pageâ, âquizâ |
| linked_object_id |  | integer | The id of a learning object to link to this planner note. Must be used in conjunction with linked_object_type and course_id. The object must be in the same course as specified by course_id. If the title argument is not provided, the planner note will use the learning objectâs title as its title. Only one planner note may be linked to a specific learning object. |


---

## Delete a planner notePlannerNotesController#destroy


### DELETE /api/v1/planner_notes/:id


Delete a planner note for the current user
