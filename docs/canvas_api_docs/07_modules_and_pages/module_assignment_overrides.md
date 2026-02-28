# Module Assignment Overrides

> Canvas API — Modules & Pages  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List a module's overridesModuleAssignmentOverridesController#index


### GET /api/v1/courses/:course_id/modules/:context_module_id/assignment_overrides


Returns a paginated list of AssignmentOverrides that apply to the ContextModule.


#### Example Request:


```
curl https://<canvas>/api/v1/courses/:course_id/modules/:context_module_id/assignment_overrides \
  -H 'Authorization: Bearer <token>'
```


---

## Update a module's overridesModuleAssignmentOverridesController#bulk_update


### PUT /api/v1/courses/:course_id/modules/:context_module_id/assignment_overrides


Accepts a list of overrides and applies them to the ContextModule. Returns 204 No Content response code if successful.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| overrides[] | Required | Array | List of overrides to apply to the module. Overrides that already exist should include an ID and will be updated if needed. New overrides will be created for overrides in the list without an ID. Overrides not included in the list will be deleted. Providing an empty list will delete all of the moduleâs overrides. Keys for each override object can include: âidâ, âtitleâ, âstudent_idsâ, and âcourse_section_idâ. âgroup_idâ is accepted if the Differentiation Tags account setting is enabled. |


#### Example Request:


```
curl https://<canvas>/api/v1/courses/:course_id/modules/:context_module_id/assignment_overrides \
  -X PUT \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
        "overrides": [
          {
            "id": 212,
            "course_section_id": 3564
          },
          {
            "id": 56,
            "group_id": 7809
          },
          {
            "title": "an assignment override",
            "student_ids": [1, 2, 3]
          }
        ]
      }'
```
