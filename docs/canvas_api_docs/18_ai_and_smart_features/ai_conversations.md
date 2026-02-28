# Ai Conversations

> Canvas API — AI & Smart Features  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Show conversationAiConversationsController#show


### GET /api/v1/courses/:course_id/ai_experiences/:ai_experience_id/conversations/:id


Get a specific conversation by ID (for teachers viewing student conversations)


---

## Get active conversationAiConversationsController#active_conversation


### GET /api/v1/courses/:course_id/ai_experiences/:ai_experience_id/conversations


Get the active conversation for the current user and AI experience


---

## Create AI conversationAiConversationsController#create


### POST /api/v1/courses/:course_id/ai_experiences/:ai_experience_id/conversations


Initialize a new conversation with the AI experience


---

## Post message to conversationAiConversationsController#post_message


### POST /api/v1/courses/:course_id/ai_experiences/:ai_experience_id/conversations/:id/messages


Send a message to an existing conversation and get the AI response


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| message | Required | string | The userâs message to send to the AI |


---

## Delete AI conversationAiConversationsController#destroy


### DELETE /api/v1/courses/:course_id/ai_experiences/:ai_experience_id/conversations/:id


Mark a conversation as completed/deleted


---

## Get conversation evaluationAiConversationsController#evaluation


### GET /api/v1/courses/:course_id/ai_experiences/:ai_experience_id/conversations/:id/evaluation


Fetch evaluation data for a conversation from the llm-conversation service
