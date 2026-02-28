# New Quizzes Reports

> Canvas API — Quizzes  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Create a quiz report


### POST /api/quiz/v1/courses/:course_id/quizzes/:assignment_id/reports


Generate a new report for this quiz. Returns a progress object that can be used to track the progress of the report generation.


Responses

- 400 Bad Request if the specified report type or format is invalid
- 409 Conflict if a quiz report of the specified type is already being generated


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| quiz_report[report_type] | Required | string | The type of report to be generated. Allowed values: student_analysis , item_analysis |
| quiz_report[format] | Required | string | The format of report to be generated. Allowed values: csv , json |
