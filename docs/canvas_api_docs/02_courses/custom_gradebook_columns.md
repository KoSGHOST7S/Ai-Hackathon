# Custom Gradebook Columns

> Canvas API — Courses  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List custom gradebook columnsCustomGradebookColumnsApiController#index


### GET /api/v1/courses/:course_id/custom_gradebook_columns


A paginated list of all custom gradebook columns for a course


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| include_hidden |  | boolean | Include hidden parameters (defaults to false) |


---

## Create a custom gradebook columnCustomGradebookColumnsApiController#create


### POST /api/v1/courses/:course_id/custom_gradebook_columns


Create a custom gradebook column


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| column[title] | Required | string | no description |
| column[position] |  | integer | The position of the column relative to other custom columns |
| column[hidden] |  | boolean | Hidden columns are not displayed in the gradebook |
| column[teacher_notes] |  | boolean | Set this if the column is created by a teacher.  The gradebook only supports one teacher_notes column. |
| column[read_only] |  | boolean | Set this to prevent the column from being editable in the gradebook ui |


---

## Update a custom gradebook columnCustomGradebookColumnsApiController#update


### PUT /api/v1/courses/:course_id/custom_gradebook_columns/:id


Accepts the same parameters as custom gradebook column creation


---

## Delete a custom gradebook columnCustomGradebookColumnsApiController#destroy


### DELETE /api/v1/courses/:course_id/custom_gradebook_columns/:id


Permanently deletes a custom column and its associated data


---

## Reorder custom columnsCustomGradebookColumnsApiController#reorder


### POST /api/v1/courses/:course_id/custom_gradebook_columns/reorder


Puts the given columns in the specified order


200 OK is returned if successful


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| order[] | Required | integer | no description |
