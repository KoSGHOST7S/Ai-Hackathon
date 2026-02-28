# Blueprint Courses

> Canvas API — Content Management  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Get blueprint informationMasterCourses::MasterTemplatesController#show


### GET /api/v1/courses/:course_id/blueprint_templates/:template_id


Using âdefaultâ as the template_id should suffice for the current implmentation (as there should be only one template per course). However, using specific template ids may become necessary in the future


#### Example Request:


```
curl https://<canvas>/api/v1/courses/1/blueprint_templates/default \
  -H 'Authorization: Bearer <ACCESS_TOKEN>'
```


---

## Get associated course informationMasterCourses::MasterTemplatesController#associated_courses


### GET /api/v1/courses/:course_id/blueprint_templates/:template_id/associated_courses


Returns a list of courses that are configured to receive updates from this blueprint


#### Example Request:


```
curl https://<canvas>/api/v1/courses/1/blueprint_templates/default/associated_courses \
  -H 'Authorization: Bearer <ACCESS_TOKEN>'
```


---

## Update associated coursesMasterCourses::MasterTemplatesController#update_associations


### PUT /api/v1/courses/:course_id/blueprint_templates/:template_id/update_associations


Send a list of course ids to add or remove new associations for the template. Cannot add courses that do not belong to the blueprint courseâs account. Also cannot add other blueprint courses or courses that already have an association with another blueprint course.


After associating new courses, start a sync to populate their contents from the blueprint.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| course_ids_to_add |  | Array | Courses to add as associated courses |
| course_ids_to_remove |  | Array | Courses to remove as associated courses |


#### Example Request:


```
curl https://<canvas>/api/v1/courses/1/blueprint_templates/default/update_associations \
-X PUT \
-H 'Authorization: Bearer <token>' \
-d 'course_ids_to_add[]=1' \
-d 'course_ids_to_remove[]=2' \
```


---

## Begin a migration to push to associated coursesMasterCourses::MasterTemplatesController#queue_migration


### POST /api/v1/courses/:course_id/blueprint_templates/:template_id/migrations


Begins a migration to push recently updated content to all associated courses. Only one migration can be running at a time.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| comment |  | string | An optional comment to be included in the sync history. |
| send_notification |  | boolean | Send a notification to the calling user when the sync completes. |
| copy_settings |  | boolean | Whether course settings should be copied over to associated courses. Defaults to true for newly associated courses. |
| send_item_notifications |  | boolean | By default, new-item notifications are suppressed in blueprint syncs. If this option is set, teachers and students may receive notifications for items such as announcements and assignments that are created in associated courses (subject to the usual notification settings). This option requires the Blueprint Item Notifications feature to be enabled. |
| publish_after_initial_sync |  | boolean | If set, newly associated courses will be automatically published after the sync completes |


#### Example Request:


```
curl https://<canvas>/api/v1/courses/1/blueprint_templates/default/migrations \
-X POST \
-F 'comment=Fixed spelling in question 3 of midterm exam' \
-F 'send_notification=true' \
-H 'Authorization: Bearer <token>'
```


---

## Set or remove restrictions on a blueprint course objectMasterCourses::MasterTemplatesController#restrict_item


### PUT /api/v1/courses/:course_id/blueprint_templates/:template_id/restrict_item


If a blueprint course object is restricted, editing will be limited for copies in associated courses.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| content_type |  | string | String, âassignmentâ|âattachmentâ|âdiscussion_topicâ|âexternal_toolâ|âlti-quizâ|âquizâ|âwiki_pageâ The type of the object. |
| content_id |  | integer | The ID of the object. |
| restricted |  | boolean | Whether to apply restrictions. |
| restrictions |  | BlueprintRestriction | (Optional) If the object is restricted, this specifies a set of restrictions. If not specified, the course-level restrictions will be used. See Course API update documentation |


#### Example Request:


```
curl https://<canvas>/api/v1/courses/1/blueprint_templates/default/restrict_item \
-X PUT \
-H 'Authorization: Bearer <token>' \
-d 'content_type=assignment' \
-d 'content_id=2' \
-d 'restricted=true'
```


---

## Get unsynced changesMasterCourses::MasterTemplatesController#unsynced_changes


### GET /api/v1/courses/:course_id/blueprint_templates/:template_id/unsynced_changes


Retrieve a list of learning objects that have changed since the last blueprint sync operation. If no syncs have been completed, a ChangeRecord with a change_type of initial_sync is returned.


---

## List blueprint migrationsMasterCourses::MasterTemplatesController#migrations_index


### GET /api/v1/courses/:course_id/blueprint_templates/:template_id/migrations


Shows a paginated list of migrations for the template, starting with the most recent. This endpoint can be called on a blueprint course. See also the associated course side .


#### Example Request:


```
curl https://<canvas>/api/v1/courses/1/blueprint_templates/default/migrations \
-H 'Authorization: Bearer <token>'
```


---

## Show a blueprint migrationMasterCourses::MasterTemplatesController#migrations_show


### GET /api/v1/courses/:course_id/blueprint_templates/:template_id/migrations/:id


Shows the status of a migration. This endpoint can be called on a blueprint course. See also the associated course side .


#### Example Request:


```
curl https://<canvas>/api/v1/courses/1/blueprint_templates/default/migrations/:id \
-H 'Authorization: Bearer <token>'
```


---

## Get migration detailsMasterCourses::MasterTemplatesController#migration_details


### GET /api/v1/courses/:course_id/blueprint_templates/:template_id/migrations/:id/details


Show the changes that were propagated in a blueprint migration. This endpoint can be called on a blueprint course. See also the associated course side .


#### Example Request:


```
curl https://<canvas>/api/v1/courses/1/blueprint_templates/default/migrations/2/details \
-H 'Authorization: Bearer <token>'
```


---

## List blueprint subscriptionsMasterCourses::MasterTemplatesController#subscriptions_index


### GET /api/v1/courses/:course_id/blueprint_subscriptions


Returns a list of blueprint subscriptions for the given course. (Currently a course may have no more than one.)


#### Example Request:


```
curl https://<canvas>/api/v1/courses/2/blueprint_subscriptions \
-H 'Authorization: Bearer <token>'
```


---

## List blueprint importsMasterCourses::MasterTemplatesController#imports_index


### GET /api/v1/courses/:course_id/blueprint_subscriptions/:subscription_id/migrations


Shows a paginated list of migrations imported into a course associated with a blueprint, starting with the most recent. See also the blueprint course side .


Use âdefaultâ as the subscription_id to use the currently active blueprint subscription.


#### Example Request:


```
curl https://<canvas>/api/v1/courses/2/blueprint_subscriptions/default/migrations \
-H 'Authorization: Bearer <token>'
```


---

## Show a blueprint importMasterCourses::MasterTemplatesController#imports_show


### GET /api/v1/courses/:course_id/blueprint_subscriptions/:subscription_id/migrations/:id


Shows the status of an import into a course associated with a blueprint. See also the blueprint course side .


#### Example Request:


```
curl https://<canvas>/api/v1/courses/2/blueprint_subscriptions/default/migrations/:id \
-H 'Authorization: Bearer <token>'
```


---

## Get import detailsMasterCourses::MasterTemplatesController#import_details


### GET /api/v1/courses/:course_id/blueprint_subscriptions/:subscription_id/migrations/:id/details


Show the changes that were propagated to a course associated with a blueprint.  See also the blueprint course side .


#### Example Request:


```
curl https://<canvas>/api/v1/courses/2/blueprint_subscriptions/default/7/details \
-H 'Authorization: Bearer <token>'
```
