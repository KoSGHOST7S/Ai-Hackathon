# Lti Apps

> Canvas API — LTI & External Tools  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List LTI Launch DefinitionsLti::LtiAppsController#launch_definitions


### GET /api/v1/courses/:course_id/lti_apps/launch_definitions


### GET /api/v1/accounts/:account_id/lti_apps/launch_definitions


List all tools available in this context for the given placements, in the form of Launch Definitions. Used primarily by the Canvas frontend. API users should consider using the External Tools API instead. This endpoint is cached for 10 minutes!


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| placements[Array] |  | string | The placements to return launch definitions for. If not provided, an empty list will be returned. |
| only_visible[Boolean] |  | string | If true, only return launch definitions that are visible to the current user. Defaults to true. |
| include_context_name[Boolean] |  | string | If true, includes the deployment context name (account or course) of the tool definition in the response. This helps distinguish between tools with identical names deployed at different levels of the context hierarchy. Defaults to false. |
