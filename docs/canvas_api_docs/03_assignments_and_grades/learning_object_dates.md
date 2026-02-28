# Learning Object Dates

> Canvas API — Assignments & Grades  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Get a learning object's date informationLearningObjectDatesController#show


### GET /api/v1/courses/:course_id/modules/:context_module_id/date_details


### GET /api/v1/courses/:course_id/assignments/:assignment_id/date_details


### GET /api/v1/courses/:course_id/quizzes/:quiz_id/date_details


### GET /api/v1/courses/:course_id/discussion_topics/:discussion_topic_id/date_details


### GET /api/v1/courses/:course_id/pages/:url_or_id/date_details


### GET /api/v1/courses/:course_id/files/:attachment_id/date_details


Get a learning objectâs date-related information, including due date, availability dates, override status, and a paginated list of all assignment overrides for the item.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| include[] |  | Array | Array of strings indicating what additional data to include in the response. Valid values: âpeer_reviewâ: includes peer review sub assignment information and overrides in the response. Requires the peer_review_allocation_and_grading feature flag to be enabled. âchild_peer_review_override_datesâ: each assignment override will include a peer_review_dates field containing the matched peer review override data (id, due_at, unlock_at, lock_at) for that override. The field will be present as null if no matching peer review override exists. |
| exclude[] |  | Array | Array of strings indicating what data to exclude from the response. Valid values: âpeer_review_overridesâ: when include[]=peer_review is also specified, the peer_review_sub_assignment object will not include the overrides array, reducing the response payload size. This is useful when using include[]=child_peer_review_override_dates since the peer review override data is already embedded in the parent assignment overrides. âchild_override_due_datesâ: prevents the sub_assignment_due_dates field from being included in assignment override responses, even when discussion checkpoints are enabled. This reduces response payload size when checkpoint due date information is not needed. |


---

## Update a learning object's date informationLearningObjectDatesController#update


### PUT /api/v1/courses/:course_id/assignments/:assignment_id/date_details


### PUT /api/v1/courses/:course_id/quizzes/:quiz_id/date_details


### PUT /api/v1/courses/:course_id/discussion_topics/:discussion_topic_id/date_details


### PUT /api/v1/courses/:course_id/pages/:url_or_id/date_details


### PUT /api/v1/courses/:course_id/files/:attachment_id/date_details


Updates date-related information for learning objects, including due date, availability dates, override status, and assignment overrides.


Returns 204 No Content response code if successful.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| due_at |  | DateTime | The learning objectâs due date. Not applicable for ungraded discussions, pages, and files. |
| unlock_at |  | DateTime | The learning objectâs unlock date. Must be before the due date if there is one. |
| lock_at |  | DateTime | The learning objectâs lock date. Must be after the due date if there is one. |
| only_visible_to_overrides |  | boolean | Whether the learning object is only assigned to students who are targeted by an override. |
| assignment_overrides[] |  | Array | List of overrides to apply to the learning object. Overrides that already exist should include an ID and will be updated if needed. New overrides will be created for overrides in the list without an ID. Overrides not included in the list will be deleted. Providing an empty list will delete all of the objectâs overrides. Keys for each override object can include: âidâ, âtitleâ, âdue_atâ, âunlock_atâ, âlock_atâ, âstudent_idsâ, and âcourse_section_idâ, âcourse_idâ, ânoop_idâ, and âunassign_itemâ. |
| peer_review |  | Hash | Optional peer review configuration for assignments with peer reviews enabled. Requires the peer_review_allocation_and_grading feature flag. Keys can include: âdue_atâ, âunlock_atâ, âlock_atâ, âpeer_review_overridesâ |
| peer_review[due_at] |  | DateTime | The peer review due date |
| peer_review[unlock_at] |  | DateTime | The peer review unlock date (when peer reviews become available) |
| peer_review[lock_at] |  | DateTime | The peer review lock date (when peer reviews are no longer available) |
| peer_review[peer_review_overrides][] |  | Array | List of peer review overrides. Each override can include: âidâ, âdue_atâ, âunlock_atâ, âlock_atâ, âstudent_idsâ, âcourse_section_idâ, âcourse_idâ, âgroup_idâ, âunassign_itemâ |


#### Example Request:


```
curl https://<canvas>/api/v1/courses/:course_id/assignments/:assignment_id/date_details \
  -X PUT \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
        "due_at": "2012-07-01T23:59:00-06:00",
        "unlock_at": "2012-06-01T00:00:00-06:00",
        "lock_at": "2012-08-01T00:00:00-06:00",
        "only_visible_to_overrides": true,
        "assignment_overrides": [
          {
            "id": 212,
            "course_section_id": 3564
          },
          {
            "title": "an assignment override",
            "student_ids": [1, 2, 3]
          }
        ],
        "peer_review": {
          "due_at": "2012-07-05T23:59:00-06:00",
          "unlock_at": "2012-07-02T23:59:00-06:00",
          "lock_at": "2012-07-10T23:59:00-06:00",
          "peer_review_overrides": [
            {
              "id": 312,
              "course_section_id": 3564,
              "due_at": "2012-07-06T23:59:00-06:00"
            }
          ]
        }
      }'
```
