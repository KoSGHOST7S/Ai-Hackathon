# Quiz Ip Filters

> Canvas API — Quizzes  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Get available quiz IP filters.Quizzes::QuizIpFiltersController#index


### GET /api/v1/courses/:course_id/quizzes/:quiz_id/ip_filters


Get a list of available IP filters for this Quiz.


200 OK response code is returned if the request was successful.


#### Example Response:


```
{
  "quiz_ip_filters": [QuizIPFilter]
}
```
