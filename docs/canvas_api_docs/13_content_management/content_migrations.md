# Content Migrations

> Canvas API — Content Management  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List content migrationsContentMigrationsController#index


### GET /api/v1/accounts/:account_id/content_migrations


### GET /api/v1/courses/:course_id/content_migrations


### GET /api/v1/groups/:group_id/content_migrations


### GET /api/v1/users/:user_id/content_migrations


Returns paginated content migrations


#### Example Request:


```
curl https://<canvas>/api/v1/courses/<course_id>/content_migrations \
    -H 'Authorization: Bearer <token>'
```


---

## Get a content migrationContentMigrationsController#show


### GET /api/v1/accounts/:account_id/content_migrations/:id


### GET /api/v1/courses/:course_id/content_migrations/:id


### GET /api/v1/groups/:group_id/content_migrations/:id


### GET /api/v1/users/:user_id/content_migrations/:id


Returns data on an individual content migration


#### Example Request:


```
curl https://<canvas>/api/v1/courses/<course_id>/content_migrations/<id> \
    -H 'Authorization: Bearer <token>'
```


---

## Create a content migrationContentMigrationsController#create


### POST /api/v1/accounts/:account_id/content_migrations


### POST /api/v1/courses/:course_id/content_migrations


### POST /api/v1/groups/:group_id/content_migrations


### POST /api/v1/users/:user_id/content_migrations


Create a content migration. If the migration requires a file to be uploaded the actual processing of the file will start once the file upload process is completed. File uploading works as described in the File Upload Documentation except that the values are set on a pre_attachment sub-hash.


For migrations that donât require a file to be uploaded, like course copy, the processing will begin as soon as the migration is created.


You can use the Progress API to track the progress of the migration. The migrationâs progress is linked to with the progress_url value.


The two general workflows are:


If no file upload is needed:

1. POST to create
2. Use the Progress specified in progress_url to monitor progress


For file uploading:

1. POST to create with file info in pre_attachment
2. Do file upload processing using the data in the pre_attachment data
3. GET the ContentMigration
4. Use the Progress specified in progress_url to monitor progress


```
(required if doing .zip file upload)

```


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| migration_type | Required | string | The type of the migration. Use the Migrator endpoint to see all available migrators. Default allowed values: canvas_cartridge_importer, common_cartridge_importer, course_copy_importer, zip_file_importer, qti_converter, moodle_converter |
| pre_attachment[name] |  | string | Required if uploading a file. This is the first step in uploading a file to the content migration. See the File Upload Documentation for details on the file upload workflow. |
| pre_attachment[*] |  | string | Other file upload properties, See File Upload Documentation |
| settings[file_url] |  | string | A URL to download the file from. Must not require authentication. |
| settings[content_export_id] |  | string | The id of a ContentExport to import. This allows you to import content previously exported from Canvas without needing to download and re-upload it. |
| settings[source_course_id] |  | string | The course to copy from for a course copy migration. (required if doing course copy) |
| settings[folder_id] |  | string | The folder to unzip the .zip file into for a zip_file_import. |
| settings[overwrite_quizzes] |  | boolean | Whether to overwrite quizzes with the same identifiers between content packages. |
| settings[question_bank_id] |  | integer | The existing question bank ID to import questions into if not specified in the content package. |
| settings[question_bank_name] |  | string | The question bank to import questions into if not specified in the content package, if both bank id and name are set, id will take precedence. |
| settings[insert_into_module_id] |  | integer | The id of a module in the target course. This will add all imported items (that can be added to a module) to the given module. |
| settings[insert_into_module_type] |  | string | If provided (and insert_into_module_id is supplied), only add objects of the specified type to the module. Allowed values: assignment , discussion_topic , file , page , quiz |
| settings[insert_into_module_position] |  | integer | The (1-based) position to insert the imported items into the course (if insert_into_module_id is supplied). If this parameter is omitted, items will be added to the end of the module. |
| settings[move_to_assignment_group_id] |  | integer | The id of an assignment group in the target course. If provided, all imported assignments will be moved to the given assignment group. |
| settings[importer_skips] |  | Array | Set of importers to skip, even if otherwise selected by migration settings. Allowed values: all_course_settings , visibility_settings |
| settings[import_blueprint_settings] |  | boolean | Import the âuse as blueprint courseâ setting as well as the list of locked items from the source course or package. The destination course must not be associated with an existing blueprint course and cannot have any student or observer enrollments. |
| date_shift_options[shift_dates] |  | boolean | Whether to shift dates in the copied course |
| date_shift_options[old_start_date] |  | Date | The original start date of the source content/course |
| date_shift_options[old_end_date] |  | Date | The original end date of the source content/course |
| date_shift_options[new_start_date] |  | Date | The new start date for the content/course |
| date_shift_options[new_end_date] |  | Date | The new end date for the source content/course |
| date_shift_options[day_substitutions][X] |  | integer | Move anything scheduled for day âXâ to the specified day. (0-Sunday, 1-Monday, 2-Tuesday, 3-Wednesday, 4-Thursday, 5-Friday, 6-Saturday) |
| date_shift_options[remove_dates] |  | boolean | Whether to remove dates in the copied course. Cannot be used in conjunction with shift_dates . |
| selective_import |  | boolean | If set, perform a selective import instead of importing all content. The migration will identify the contents of the package and then stop in the waiting_for_select workflow state. At this point, use the List items endpoint to enumerate the contents of the package, identifying the copy parameters for the desired content. Then call the Update endpoint and provide these copy parameters to start the import. |
| select |  | Hash | For course_copy_importer migrations, this parameter allows you to select the objects to copy without using the selective_import argument and waiting_for_select state as is required for uploaded imports (though that workflow is also supported for course copy migrations). The keys are object types like âfilesâ, âfoldersâ, âpagesâ, etc. The value for each key is a list of object ids. An id can be an integer or a string. Multiple object types can be selected in the same call. Allowed values: folders , files , attachments , quizzes , assignments , announcements , calendar_events , discussion_topics , modules , module_items , pages , rubrics |


#### Example Request:


```
curl 'https://<canvas>/api/v1/courses/<course_id>/content_migrations' \
     -F 'migration_type=common_cartridge_importer' \
     -F 'settings[question_bank_name]=importquestions' \
     -F 'date_shift_options[old_start_date]=1999-01-01' \
     -F 'date_shift_options[new_start_date]=2013-09-01' \
     -F 'date_shift_options[old_end_date]=1999-04-15' \
     -F 'date_shift_options[new_end_date]=2013-12-15' \
     -F 'date_shift_options[day_substitutions][1]=2' \
     -F 'date_shift_options[day_substitutions][2]=3' \
     -F 'date_shift_options[shift_dates]=true' \
     -F 'pre_attachment[name]=mycourse.imscc' \
     -F 'pre_attachment[size]=12345' \
     -H 'Authorization: Bearer <token>'
```


---

## Update a content migrationContentMigrationsController#update


### PUT /api/v1/accounts/:account_id/content_migrations/:id


### PUT /api/v1/courses/:course_id/content_migrations/:id


### PUT /api/v1/groups/:group_id/content_migrations/:id


### PUT /api/v1/users/:user_id/content_migrations/:id


Update a content migration. Takes same arguments as create except that you canât change the migration type. However, changing most settings after the migration process has started will not do anything. Generally updating the content migration will be used when there is a file upload problem, or when importing content selectively. If the first upload has a problem you can supply new pre_attachment values to start the process again.


---

## List Migration SystemsContentMigrationsController#available_migrators


### GET /api/v1/accounts/:account_id/content_migrations/migrators


### GET /api/v1/courses/:course_id/content_migrations/migrators


### GET /api/v1/groups/:group_id/content_migrations/migrators


### GET /api/v1/users/:user_id/content_migrations/migrators


Lists the currently available migration types. These values may change.


---

## List items for selective importContentMigrationsController#content_list


### GET /api/v1/accounts/:account_id/content_migrations/:id/selective_data


### GET /api/v1/courses/:course_id/content_migrations/:id/selective_data


### GET /api/v1/groups/:group_id/content_migrations/:id/selective_data


### GET /api/v1/users/:user_id/content_migrations/:id/selective_data


Enumerates the content available for selective import in a tree structure. Each node provides a property copy argument that can be supplied to the Update endpoint to selectively copy the content associated with that tree node and its children. Each node may also provide a sub_items_url or an array of sub_items which you can use to obtain copy parameters for a subset of the resources in a given node.


If no type is sent you will get a list of the top-level sections in the content. It will look something like this:


```
[{
  "type": "course_settings",
  "property": "copy[all_course_settings]",
  "title": "Course Settings"
},
{
  "type": "context_modules",
  "property": "copy[all_context_modules]",
  "title": "Modules",
  "count": 5,
  "sub_items_url": "http://example.com/api/v1/courses/22/content_migrations/77/selective_data?type=context_modules"
},
{
  "type": "assignments",
  "property": "copy[all_assignments]",
  "title": "Assignments",
  "count": 2,
  "sub_items_url": "http://localhost:3000/api/v1/courses/22/content_migrations/77/selective_data?type=assignments"
}]

```


When a type is provided, nodes may be further divided via sub_items . For example, using type=assignments results in a node for each assignment group and a sub_item for each assignment, like this:


```
[{
  "type": "assignment_groups",
  "title": "An Assignment Group",
  "property": "copy[assignment_groups][id_i855cf145e5acc7435e1bf1c6e2126e5f]",
  "sub_items": [{
      "type": "assignments",
      "title": "Assignment 1",
      "property": "copy[assignments][id_i2102a7fa93b29226774949298626719d]"
  }, {
      "type": "assignments",
      "title": "Assignment 2",
      "property": "copy[assignments][id_i310cba275dc3f4aa8a3306bbbe380979]"
  }]
}]

```


To import the items corresponding to a particular tree node, use the property as a parameter to the Update endpoint and assign a value of 1, for example:


```
copy[assignments][id_i310cba275dc3f4aa8a3306bbbe380979]=1

```


You can include multiple copy parameters to selectively import multiple items or groups of items.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| type |  | string | The type of content to enumerate. Allowed values: context_modules , assignments , quizzes , assessment_question_banks , discussion_topics , wiki_pages , context_external_tools , tool_profiles , announcements , calendar_events , rubrics , groups , learning_outcomes , attachments |


---

## Get asset id mappingContentMigrationsController#asset_id_mapping


### GET /api/v1/courses/:course_id/content_migrations/:id/asset_id_mapping


Given a complete course copy or blueprint import content migration, return a mapping of asset ids from the source course to the destination course that were copied in this migration or an earlier one with the same course pair and migration_type (course copy or blueprint).


The returned objectâs keys are asset types as they appear in API URLs ( announcements , assignments , discussion_topics , files , module_items , modules , pages , and quizzes ). The values are a mapping from id in source course to id in destination course for objects of this type.


#### Example Request:


```
curl https://<canvas>/api/v1/courses/<course_id>/content_migrations/<id>/asset_id_mapping \
    -H 'Authorization: Bearer <token>'
```


#### Example Response:


```
{
  "assignments": {"13": "740", "14": "741"},
  "discussion_topics": {"15": "743", "16": "744"}
}
```
