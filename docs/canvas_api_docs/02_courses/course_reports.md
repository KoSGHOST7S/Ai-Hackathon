# Course Reports

> Canvas API — Courses  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Status of a ReportCourseReportsController#show


### GET /api/v1/courses/:course_id/reports/:report_type/:id


Returns the status of a report.


#### Example Request:


```
curl -H 'Authorization: Bearer <token>' \
     https://<canvas>/api/v1/courses/<course_id>/reports/<report_type>/<report_id>
```


---

## Start a ReportCourseReportsController#create


### POST /api/v1/courses/:course_id/reports/:report_type


Generates a report instance for the account. Note that âreportâ in the request must match one of the available report names.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| course_id |  | integer | The id of the course to report on. |
| report_type |  | string | The type of report to generate. |
| parameters[] |  | Hash | The parameters will vary for each report. A few example parameters have been provided below. Note: the example parameters provided below may not be valid for every report. |
| parameters[section_ids[]] |  | integer | The sections of the course to report on. Note: this parameter has been listed to serve as an example and may not be valid for every report. |


---

## Status of last ReportCourseReportsController#last


### GET /api/v1/courses/:course_id/reports/:report_type


Returns the status of the last report initiated by the current user.


#### Example Request:


```
curl -H 'Authorization: Bearer <token>' \
     https://<canvas>/api/v1/courses/<course_id>/reports/<report_type>
```
