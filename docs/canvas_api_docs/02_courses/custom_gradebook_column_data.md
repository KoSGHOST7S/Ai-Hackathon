# Custom Gradebook Column Data

> Canvas API — Courses  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List entries for a columnCustomGradebookColumnDataApiController#index


### GET /api/v1/courses/:course_id/custom_gradebook_columns/:id/data


This does not list entries for students without associated data.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| include_hidden |  | boolean | If true, hidden columns will be included in the result. If false or absent, only visible columns will be returned. |


---

## Update column dataCustomGradebookColumnDataApiController#update


### PUT /api/v1/courses/:course_id/custom_gradebook_columns/:id/data/:user_id


Set the content of a custom column


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| column_data[content] | Required | string | Column content.  Setting this to blank will delete the datum object. |


---

## Bulk update column dataCustomGradebookColumnDataApiController#bulk_update


### PUT /api/v1/courses/:course_id/custom_gradebook_column_data


Set the content of custom columns


{


```
"column_data": [
  {
    "column_id": example_column_id,
    "user_id": example_student_id,
    "content": example_content
    },
    {
    "column_id": example_column_id,
    "user_id": example_student_id,
    "content: example_content
  }
]

```


}


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| column_data[] | Required | Array | Column content. Setting this to an empty string will delete the data object. |


#### Example Request:


```

```
