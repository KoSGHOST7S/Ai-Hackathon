# Peer Reviews

> Canvas API — Assignments & Grades  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Get all Peer ReviewsPeerReviewsApiController#index


### GET /api/v1/courses/:course_id/assignments/:assignment_id/peer_reviews


### GET /api/v1/sections/:section_id/assignments/:assignment_id/peer_reviews


### GET /api/v1/courses/:course_id/assignments/:assignment_id/submissions/:submission_id/peer_reviews


### GET /api/v1/sections/:section_id/assignments/:assignment_id/submissions/:submission_id/peer_reviews


Get a list of all Peer Reviews for this assignment


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| include[] |  | string | Associations to include with the peer review. Allowed values: submission_comments , user |


---

## Create Peer ReviewPeerReviewsApiController#create


### POST /api/v1/courses/:course_id/assignments/:assignment_id/submissions/:submission_id/peer_reviews


### POST /api/v1/sections/:section_id/assignments/:assignment_id/submissions/:submission_id/peer_reviews


Create a peer review for the assignment


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| user_id | Required | integer | user_id to assign as reviewer on this assignment |


---

## Delete Peer ReviewPeerReviewsApiController#destroy


### DELETE /api/v1/courses/:course_id/assignments/:assignment_id/submissions/:submission_id/peer_reviews


### DELETE /api/v1/sections/:section_id/assignments/:assignment_id/submissions/:submission_id/peer_reviews


Delete a peer review for the assignment


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| user_id | Required | integer | user_id to delete as reviewer on this assignment |


---

## Allocate Peer ReviewPeerReviewsApiController#allocate


### POST /api/v1/courses/:course_id/assignments/:assignment_id/allocate


Allocates a submission for the current user to peer review
