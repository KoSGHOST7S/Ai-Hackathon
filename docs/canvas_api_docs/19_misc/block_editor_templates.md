# Block Editor Templates

> Canvas API — Miscellaneous  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List block templatesBlockEditorTemplatesApiController#index


### GET /api/v1/courses/:course_id/block_editor_templates


A list of the block templates available to the current user.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| sort |  | string | Sort results by this field. Allowed values: name , created_at , updated_at |
| order |  | string | The sorting order. Defaults to âascâ. Allowed values: asc , desc |
| drafts |  | boolean | If true, include draft templates. If false or omitted only published templates will be returned. |
| type[] |  | string | What type of templates should be returned. Allowed values: page , section , block |
| include[] |  | string | no description Allowed values: node_tree , thumbnail |


#### Example Request:


```
curl -H 'Authorization: Bearer <token>' \
     https://<canvas>/api/v1/courses/123/block_editor_templates?sort=name&order=asc&drafts=true
```
