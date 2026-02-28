# Ai Experiences

> Canvas API — AI & Smart Features  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List AI experiencesAiExperiencesController#index


### GET /api/v1/courses/:course_id/ai_experiences


Retrieve the paginated list of AI experiences for a course


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| workflow_state |  | string | Only return experiences with the specified workflow state. Allowed values: published, unpublished, deleted |


---

## Show an AI experienceAiExperiencesController#show


### GET /api/v1/courses/:course_id/ai_experiences/:id


Retrieve an AI experience by ID


---

## Show new AI experience formAiExperiencesController#new


### GET /api/v1/courses/:course_id/ai_experiences/new


Display the form for creating a new AI experience


---

## Show edit AI experience formAiExperiencesController#edit


### GET /api/v1/courses/:course_id/ai_experiences/:id/edit


Display the form for editing an existing AI experience


---

## Create an AI experienceAiExperiencesController#create


### POST /api/v1/courses/:course_id/ai_experiences


Create a new AI experience for the specified course


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| title | Required | string | The title of the AI experience. |
| description |  | string | The description of the AI experience. |
| facts |  | string | The AI facts for the experience. |
| learning_objective | Required | string | The learning objectives for this experience. |
| pedagogical_guidance | Required | string | The pedagogical guidance for the experience. |
| workflow_state |  | string | The initial state of the experience. Defaults to âunpublishedâ. Allowed values: published, unpublished |


---

## Update an AI experienceAiExperiencesController#update


### PUT /api/v1/courses/:course_id/ai_experiences/:id


Update an existing AI experience


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| title |  | string | The title of the AI experience. |
| description |  | string | The description of the AI experience. |
| facts |  | string | The AI facts for the experience. |
| learning_objective | Required | string | The learning objectives for this experience. |
| pedagogical_guidance | Required | string | The pedagogical guidance for the experience. |
| workflow_state |  | string | The state of the experience. Allowed values: published, unpublished |


---

## Delete an AI experienceAiExperiencesController#destroy


### DELETE /api/v1/courses/:course_id/ai_experiences/:id


Delete an AI experience (soft delete - marks as deleted)


---

## List student AI conversationsAiExperiencesController#ai_conversations_index


### GET /api/v1/courses/:course_id/ai_experiences/:id/ai_conversations


Retrieve the latest AI conversation for each student in the course for this AI experience. Only available to teachers and course managers.


---

## Show student AI conversationAiExperiencesController#ai_conversation_show


### GET /api/v1/courses/:course_id/ai_experiences/:id/ai_conversations/:conversation_id


Retrieve a specific studentâs AI conversation with full message history. Only available to teachers and course managers.
