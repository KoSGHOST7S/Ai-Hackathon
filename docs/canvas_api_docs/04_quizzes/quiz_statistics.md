# Quiz Statistics

> Canvas API — Quizzes  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Fetching the latest quiz statisticsQuizzes::QuizStatisticsController#index


### GET /api/v1/courses/:course_id/quizzes/:quiz_id/statistics


This endpoint provides statistics for all quiz versions, or for a specific quiz version, in which case the output is guaranteed to represent the latest and most current version of the quiz.


200 OK response code is returned if the request was successful.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| all_versions |  | boolean | Whether the statistics report should include all submissions attempts. |


#### Example Response:


```
{
  "quiz_statistics": [ QuizStatistics ]
}
```
