# Sandboxes

> Canvas API — Accounts & Admin  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Download UUID Mapping for this Sandbox


### GET /api/lti/uuid_map


This endpoint returns a CSV file with the UUID mapping for the sandbox. The CSV has three columns:


```
* `type` - The object type
* `original_uuid` - The UUID of an object from the template
* `new_uuid` - The UUID of the corresponding object in the sandbox

```
