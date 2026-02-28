# Account Reports

> Canvas API — Accounts & Admin  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List Available ReportsAccountReportsController#available_reports


### GET /api/v1/accounts/:account_id/reports


Returns a paginated list of reports for the current context.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| include[] |  | string | Array of additional information to include. âdescription_htmlâ an HTML description of the report, with example output âparameters_htmlâ an HTML form for the report parameters Allowed values: description_html , params_html |


#### API response field:

- name The name of the report.
- parameters The parameters will vary for each report
- last_run Report The last run of the report. This will be null if the report has never been run.


#### Example Request:


```
curl -H 'Authorization: Bearer <token>' \
     https://<canvas>/api/v1/accounts/<account_id>/reports/
```


#### Example Response:


```
[
  {
    "report":"student_assignment_outcome_map_csv",
    "title":"Student Competency",
    "parameters":null,
    "last_run": {
      "id": 1,
      "report": "student_assignment_outcome_map_csv",
      "file_url": "https://example.com/some/path",
      "status": "complete",
      "created_at": "2013-12-01T23:59:00-06:00",
      "started_at": "2013-12-02T00:03:21-06:00",
      "ended_at": "2013-12-02T00:03:21-06:00"
  },
  {
    "report":"grade_export_csv",
    "title":"Grade Export",
    "parameters":{
      "term":{
        "description":"The canvas id of the term to get grades from",
        "required":true
      }
    },
    "last_run": null
  }
]
```


---

## Start a ReportAccountReportsController#create


### POST /api/v1/accounts/:account_id/reports/:report


Generates a report instance for the account. Note that âreportâ in the request must match one of the available report names. To fetch a list of available report names and parameters for each report (including whether or not those parameters are required), see List Available Reports .


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| parameters[] |  | Hash | The parameters will vary for each report. To fetch a list of available parameters for each report, see List Available Reports . A few example parameters have been provided below. Note that the example parameters provided below may not be valid for every report. |
| parameters[skip_message] |  | boolean | If true, no message will be sent to the user upon completion of the report. |
| parameters[course_id] |  | integer | The id of the course to report on. Note: this parameter has been listed to serve as an example and may not be valid for every report. |
| parameters[users] |  | boolean | If true, user data will be included. If false, user data will be omitted. Note: this parameter has been listed to serve as an example and may not be valid for every report. |


#### Example Request:


```
curl -X POST \
     https://<canvas>/api/v1/accounts/1/reports/provisioning_csv \
     -H 'Authorization: Bearer <token>' \
     -H 'Content-Type: multipart/form-data' \
     -F 'parameters[users]=true' \
     -F 'parameters[courses]=true' \
     -F 'parameters[enrollments]=true'
```


---

## Index of ReportsAccountReportsController#index


### GET /api/v1/accounts/:account_id/reports/:report


Shows all reports that have been run for the account of a specific type.


#### Example Request:


```
curl -H 'Authorization: Bearer <token>' \
     https://<canvas>/api/v1/accounts/<account_id>/reports/<report_type>
```


---

## Status of a ReportAccountReportsController#show


### GET /api/v1/accounts/:account_id/reports/:report/:id


Returns the status of a report.


#### Example Request:


```
curl -H 'Authorization: Bearer <token>' \
     https://<canvas>/api/v1/accounts/<account_id>/reports/<report_type>/<report_id>
```


---

## Delete a ReportAccountReportsController#destroy


### DELETE /api/v1/accounts/:account_id/reports/:report/:id


Deletes a generated report instance.


#### Example Request:


```
curl -H 'Authorization: Bearer <token>' \
     -X DELETE \
     https://<canvas>/api/v1/accounts/<account_id>/reports/<report_type>/<id>
```


---

## Abort a ReportAccountReportsController#abort


### PUT /api/v1/accounts/:account_id/reports/:report/:id/abort


Abort a report in progress


#### Example Request:


```
curl -H 'Authorization: Bearer <token>' \
     -X PUT \
     https://<canvas>/api/v1/accounts/<account_id>/reports/<report_type>/<id>/abort
```
