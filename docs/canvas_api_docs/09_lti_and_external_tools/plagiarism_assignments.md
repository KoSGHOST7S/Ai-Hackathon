# Plagiarism Assignments

> Canvas API — LTI & External Tools  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Get a single assignment (lti)Lti::PlagiarismAssignmentsApiController#show


### GET /api/lti/assignments/:assignment_id


Get a single Canvas assignment by Canvas id or LTI id. Tool providers may only access assignments that are associated with their tool.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| user_id |  | string | The id of the user. Can be a Canvas or LTI id for the user. |
