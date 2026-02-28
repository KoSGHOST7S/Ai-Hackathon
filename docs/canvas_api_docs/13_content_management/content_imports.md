# Content Imports

> Canvas API — Content Management  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Get course copy statusContentImportsController#copy_course_status


### GET /api/v1/courses/:course_id/course_copy/:id


DEPRECATED: Please use the Content Migrations API


Retrieve the status of a course copy


#### API response field:

- id The unique identifier for the course copy.
- created_at The time that the copy was initiated.
- progress The progress of the copy as an integer. It is null before the copying starts, and 100 when finished.
- workflow_state The current status of the course copy. Possible values: âcreatedâ, âstartedâ, âcompletedâ, âfailedâ
- status_url The url for the course copy status API endpoint.


#### Example Response:


```
{'progress':100, 'workflow_state':'completed', 'id':257, 'created_at':'2011-11-17T16:50:06Z', 'status_url':'/api/v1/courses/9457/course_copy/257'}
```


---

## Copy course contentContentImportsController#copy_course_content


### POST /api/v1/courses/:course_id/course_copy


DEPRECATED: Please use the Content Migrations API


Copies content from one course into another. The default is to copy all course content. You can control specific types to copy by using either the âexceptâ option or the âonlyâ option.


The response is the same as the course copy status endpoint


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| source_course |  | string | ID or SIS-ID of the course to copy the content from |
| except[] |  | string | A list of the course content types to exclude, all areas not listed will be copied. Allowed values: course_settings , assignments , external_tools , files , topics , calendar_events , quizzes , wiki_pages , modules , outcomes |
| only[] |  | string | A list of the course content types to copy, all areas not listed will not be copied. Allowed values: course_settings , assignments , external_tools , files , topics , calendar_events , quizzes , wiki_pages , modules , outcomes |
