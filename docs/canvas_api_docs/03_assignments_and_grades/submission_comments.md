# Submission Comments

> Canvas API — Assignments & Grades  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Edit a submission commentSubmissionCommentsApiController#update


### PUT /api/v1/courses/:course_id/assignments/:assignment_id/submissions/:user_id/comments/:id


Edit the given submission comment.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| comment |  | string | If this argument is present, edit the text of a comment. |


---

## Delete a submission commentSubmissionCommentsApiController#destroy


### DELETE /api/v1/courses/:course_id/assignments/:assignment_id/submissions/:user_id/comments/:id


Delete the given submission comment.


#### Example Request:


```
curl https://<canvas>/api/v1/courses/<course_id>/assignments/<assignment_id>/submissions/<user_id>/comments/<id> \
     -X DELETE \
     -H 'Authorization: Bearer <token>'
```


---

## Upload a fileSubmissionCommentsApiController#create_file


### POST /api/v1/courses/:course_id/assignments/:assignment_id/submissions/:user_id/comments/files


Upload a file to attach to a submission comment


See the File Upload Documentation for details on the file upload workflow.


The final step of the file upload workflow will return the attachment data, including the new file id. The caller can then PUT the file_id to the submission API to attach it to a comment
