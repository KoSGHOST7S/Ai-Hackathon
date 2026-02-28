# Originality Reports

> Canvas API — LTI & External Tools  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Create an Originality ReportLti::OriginalityReportsApiController#create


### POST /api/lti/assignments/:assignment_id/submissions/:submission_id/originality_report


Create a new OriginalityReport for the specified file


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| originality_report[file_id] |  | integer | The id of the file being given an originality score. Required if creating a report associated with a file. |
| originality_report[originality_score] | Required | number | A number between 0 and 100 representing the measure of the specified fileâs originality. |
| originality_report[originality_report_url] |  | string | The URL where the originality report for the specified file may be found. |
| originality_report[originality_report_file_id] |  | integer | The ID of the file within Canvas that contains the originality report for the submitted file provided in the request URL. |
| originality_report[tool_setting][resource_type_code] |  | string | The resource type code of the resource handler Canvas should use for the LTI launch for viewing originality reports. If set Canvas will launch to the message with type âbasic-lti-launch-requestâ in the specified resource handler rather than using the originality_report_url. |
| originality_report[tool_setting][resource_url] |  | string | The URL Canvas should launch to when showing an LTI originality report. Note that this value is inferred from the specified resource handlerâs message âpathâ value (See resource_type_code ) unless it is specified. If this parameter is used a resource_type_code must also be specified. |
| originality_report[workflow_state] |  | string | May be set to âpendingâ, âerrorâ, or âscoredâ. If an originality score is provided a workflow state of âscoredâ will be inferred. |
| originality_report[error_message] |  | string | A message describing the error. If set, the âworkflow_stateâ will be set to âerror.â |
| originality_report[attempt] |  | integer | If no file_id is given, and no file is required for the assignment (that is, the assignment allows an online text entry), this parameter may be given to clarify which attempt number the report is for (in the case of resubmissions). If this field is omitted and no file_id is given, the report will be created (or updated, if it exists) for the first submission attempt with no associated file. |


---

## Edit an Originality ReportLti::OriginalityReportsApiController#update


### PUT /api/lti/assignments/:assignment_id/submissions/:submission_id/originality_report/:id


### PUT /api/lti/assignments/:assignment_id/files/:file_id/originality_report


Modify an existing originality report. An alternative to this endpoint is to POST the same parameters listed below to the CREATE endpoint.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| originality_report[originality_score] |  | number | A number between 0 and 100 representing the measure of the specified fileâs originality. |
| originality_report[originality_report_url] |  | string | The URL where the originality report for the specified file may be found. |
| originality_report[originality_report_file_id] |  | integer | The ID of the file within Canvas that contains the originality report for the submitted file provided in the request URL. |
| originality_report[tool_setting][resource_type_code] |  | string | The resource type code of the resource handler Canvas should use for the LTI launch for viewing originality reports. If set Canvas will launch to the message with type âbasic-lti-launch-requestâ in the specified resource handler rather than using the originality_report_url. |
| originality_report[tool_setting][resource_url] |  | string | The URL Canvas should launch to when showing an LTI originality report. Note that this value is inferred from the specified resource handlerâs message âpathâ value (See resource_type_code ) unless it is specified. If this parameter is used a resource_type_code must also be specified. |
| originality_report[workflow_state] |  | string | May be set to âpendingâ, âerrorâ, or âscoredâ. If an originality score is provided a workflow state of âscoredâ will be inferred. |
| originality_report[error_message] |  | string | A message describing the error. If set, the âworkflow_stateâ will be set to âerror.â |


---

## Show an Originality ReportLti::OriginalityReportsApiController#show


### GET /api/lti/assignments/:assignment_id/submissions/:submission_id/originality_report/:id


### GET /api/lti/assignments/:assignment_id/files/:file_id/originality_report


Get a single originality report
