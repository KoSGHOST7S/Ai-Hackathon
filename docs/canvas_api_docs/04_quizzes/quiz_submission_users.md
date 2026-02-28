# Quiz Submission Users

> Canvas API — Quizzes  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Send a message to unsubmitted or submitted users for the quizQuizzes::QuizSubmissionUsersController#message


### POST /api/v1/courses/:course_id/quizzes/:id/submission_users/message


{


```
"body": {
  "type": "string",
  "description": "message body of the conversation to be created",
  "example": "Please take the quiz."
},
"recipients": {
  "type": "string",
  "description": "Who to send the message to. May be either 'submitted' or 'unsubmitted'",
  "example": "submitted"
},
"subject": {
  "type": "string",
  "description": "Subject of the new Conversation created",
  "example": "ATTN: Quiz 101 Students"
}

```


}


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| conversations |  | QuizUserConversation | Body and recipients to send the message to. |
