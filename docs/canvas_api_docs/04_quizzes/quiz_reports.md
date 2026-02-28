# Quiz Reports

> Canvas API — Quizzes  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Retrieve all quiz reportsQuizzes::QuizReportsController#index


### GET /api/v1/courses/:course_id/quizzes/:quiz_id/reports


Returns a list of all available reports.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| includes_all_versions |  | boolean | Whether to retrieve reports that consider all the submissions or only the most recent. Defaults to false, ignored for item_analysis reports. |


---

## Create a quiz reportQuizzes::QuizReportsController#create


### POST /api/v1/courses/:course_id/quizzes/:quiz_id/reports


Create and return a new report for this quiz. If a previously generated report matches the arguments and is still current (i.e. there have been no new submissions), it will be returned.


Responses

- 400 Bad Request if the specified report type is invalid
- 409 Conflict if a quiz report of the specified type is already being generated


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| quiz_report[report_type] | Required | string | The type of report to be generated. Allowed values: student_analysis , item_analysis |
| quiz_report[includes_all_versions] |  | boolean | Whether the report should consider all submissions or only the most recent. Defaults to false, ignored for item_analysis. |
| include |  | String[] | Whether the output should include documents for the file and/or progress objects associated with this report. (Note: JSON-API only) Allowed values: file , progress |


---

## Get a quiz reportQuizzes::QuizReportsController#show


### GET /api/v1/courses/:course_id/quizzes/:quiz_id/reports/:id


Returns the data for a single quiz report.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| include |  | String[] | Whether the output should include documents for the file and/or progress objects associated with this report. (Note: JSON-API only) Allowed values: file , progress |


---

## Abort the generation of a report, or remove a previously generated oneQuizzes::QuizReportsController#abort


### DELETE /api/v1/courses/:course_id/quizzes/:quiz_id/reports/:id


This API allows you to cancel a previous request you issued for a report to be generated. Or in the case of an already generated report, youâd like to remove it, perhaps to generate it another time with an updated version that provides new features.


You must check the reportâs generation status before attempting to use this interface. See the âworkflow_stateâ property of the QuizReportâs Progress object for more information. Only when the progress reports itself in a âqueuedâ state can the generation be aborted.


Responses

- 204 No Content if your request was accepted
- 422 Unprocessable Entity if the report is not being generated or can not be aborted at this stage
