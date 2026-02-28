# Lti Registrations

> Canvas API — LTI & External Tools  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List LTI Registrations in an accountLti::RegistrationsController#list


### BETA: This API endpoint is not finalized, and there could be breaking changes before its final release.


### GET /api/v1/accounts/:account_id/lti_registrations


Returns all LTI registrations in the specified account. Includes registrations created in this account, those set to âallowâ from a parent root account (like Site Admin) and âonâ for this account, and those enabled âonâ at the parent root account level.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| per_page |  | integer | The number of registrations to return per page. Defaults to 15. |
| page |  | integer | The page number to return. Defaults to 1. |
| sort |  | string | The field to sort by. Choices are: name, nickname, lti_version, installed, installed_by, updated_by, updated, and on. Defaults to installed. |
| dir |  | string | The order to sort the given column by. Defaults to desc. Allowed values: asc , desc |
| include[] |  | string | Array of additional data to include. Always includes [account_binding]. âaccount_bindingâ the registrationâs binding to the given account âconfigurationâ the registrationâs Canvas-style tool configuration, without any overlays applied. âoverlaid_configurationâ the registrationâs Canvas-style tool configuration, with all overlays applied. âoverlayâ the registrationâs admin-defined configuration overlay |


#### Example Request:


```
This would return the specified LTI registration
curl -X GET 'https://<canvas>/api/v1/accounts/<account_id>/registrations' \
     -H "Authorization: Bearer <token>"
```


---

## Show an LTI RegistrationLti::RegistrationsController#show


### BETA: This API endpoint is not finalized, and there could be breaking changes before its final release.


### GET /api/v1/accounts/:account_id/lti_registrations/:id


Return details about the specified LTI registration, including the configuration and account binding.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| include[] |  | string | Array of additional data to include. Always includes [account_binding configuration]. âaccount_bindingâ the registrationâs binding to the given account âconfigurationâ the registrationâs Canvas-style tool configuration, without any overlays applied. âoverlaid_configurationâ the registrationâs Canvas-style tool configuration, with all overlays applied. âoverlaid_legacy_configurationâ the registrationâs legacy-style configuration, with all overlays applied. âoverlayâ the registrationâs admin-defined configuration overlay âoverlay_versionsâ the registrationâs overlayâs edit history |


#### Example Request:


```
This would return the specified LTI registration
curl -X GET 'https://<canvas>/api/v1/accounts/<account_id>/lti_registrations/<registration_id>' \
     -H "Authorization: Bearer <token>"
```


---

## Create an LTI RegistrationLti::RegistrationsController#create


### BETA: This API endpoint is not finalized, and there could be breaking changes before its final release.


### POST /api/v1/accounts/:account_id/lti_registrations


Create a new LTI Registration, as well as an associated Tool Configuration, Developer Key, and Registration Account binding. To install/create using Dynamic Registration, please use the Dynamic Registration API .


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| name |  | string | The name of the tool. If one isnât provided, it will be inferred from the configurationâs title. |
| admin_nickname |  | string | A friendly nickname set by admins to override the tool name |
| vendor |  | string | The vendor of the tool |
| description |  | string | A description of the tool. Cannot exceed 2048 bytes. |
| configuration |  | string | Required, Lti::ToolConfiguration | Lti::LegacyConfiguration The LTI 1.3 configuration for the tool |
| overlay |  | string | Lti::Overlay The overlay configuration for the tool. Overrides values in the base configuration. |
| unified_tool_id |  | string | The unique identifier for the tool, used for analytics. If not provided, one will be generated. |
| workflow_state |  | string | The desired state for this registration/account binding. âallowâ is only valid for Site Admin registrations. Defaults to âoffâ. Allowed values: on , off , allow |


#### Example Request:


```
This would create a new LTI Registration, as well as an associated Developer Key
and LTI Tool Configuration.

curl -X POST 'https://<canvas>/api/v1/accounts/<account_id>/lti_registrations' \
    -H "Authorization: Bearer <token>" \
    -H "Content-Type: application/json" \
    -d '{
          "vendor": "Example",
          "name": "An Example Tool",
          "admin_nickname": "A Great LTI Tool",
          "configuration": {
            "title": "Sample Tool",
            "description": "A sample LTI tool",
            "target_link_uri": "https://example.com/launch",
            "oidc_initiation_url": "https://example.com/oidc",
            "redirect_uris": ["https://example.com/redirect"],
            "scopes": ["https://purl.imsglobal.org/spec/lti-ags/scope/lineitem"],
            "placements": [
              {
                "placement": "course_navigation",
                "enabled": true
              }
            ],
            "launch_settings": {}
          }
        }'
```


---

## Show an LTI Registration (via the client_id)Lti::RegistrationsController#show_by_client_id


### BETA: This API endpoint is not finalized, and there could be breaking changes before its final release.


### GET /api/v1/accounts/:account_id/lti_registration_by_client_id/:client_id


Returns details about the specified LTI registration, including the configuration and account binding.


#### Example Request:


```
This would return the specified LTI registration
curl -X GET 'https://<canvas>/api/v1/accounts/<account_id>/lti_registration_by_client_id/<client_id>' \
     -H "Authorization: Bearer <token>"
```


---

## Update an LTI RegistrationLti::RegistrationsController#update


### BETA: This API endpoint is not finalized, and there could be breaking changes before its final release.


### PUT /api/v1/accounts/:account_id/lti_registrations/:id


Update the specified LTI registration with the provided parameters. Note that updating the base tool configuration of a registration that is associated with a Dynamic Registration will return a 422. All other fields can be updated freely.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| name |  | string | The name of the tool |
| admin_nickname |  | string | The admin-configured friendly display name for the registration |
| description |  | string | A description of the tool. Cannot exceed 2048 bytes. |
| configuration |  | string | Lti::ToolConfiguration | Lti::LegacyConfiguration The LTI 1.3 configuration for the tool. Note that updating the base tool configuration of a registration associated with a Dynamic Registration is not allowed. |
| overlay |  | string | Lti::Overlay The overlay configuration for the tool. Overrides values in the base configuration. Note that updating the overlay of a registration associated with a Dynamic Registration IS allowed. |
| workflow_state |  | string | The desired state for this registration/account binding. âallowâ is only valid for Site Admin registrations. Allowed values: on , off , allow |
| comment |  | string | A comment explaining why this change was made. Cannot exceed 2000 characters. |


#### Example Request:


```
This would update the specified LTI Registration, as well as its associated Developer Key
and LTI Tool Configuration.

curl -X PUT 'https://<canvas>/api/v1/accounts/<account_id>/lti_registrations/<registration_id>' \
    -H "Authorization: Bearer <token>" \
    -H "Content-Type: application/json" \
    -d '{
          "vendor": "Example",
          "name": "An Example Tool",
          "admin_nickname": "A Great LTI Tool",
          "configuration": {
            "title": "Sample Tool",
            "description": "A sample LTI tool",
            "target_link_uri": "https://example.com/launch",
            "oidc_initiation_url": "https://example.com/oidc",
            "redirect_uris": ["https://example.com/redirect"],
            "scopes": ["https://purl.imsglobal.org/spec/lti-ags/scope/lineitem"],
            "placements": [
              {
                "placement": "course_navigation",
                "enabled": true
              }
            ],
            "launch_settings": {}
          }
        }'
```


---

## Reset an LTI Registration to DefaultsLti::RegistrationsController#reset


### BETA: This API endpoint is not finalized, and there could be breaking changes before its final release.


### PUT /api/v1/accounts/:account_id/lti_registrations/:id/reset


Reset the specified LTI registration to its default settings in this context. This removes all customizations that were present in the overlay associated with this context.


#### Example Request:


```
This would reset the specified LTI registration to its default settings
curl -X PUT 'https://<canvas>/api/v1/accounts/<account_id>/lti_registrations/<registration_id>/reset' \
     -H "Authorization: Bearer <token>"
```


---

## Delete an LTI RegistrationLti::RegistrationsController#destroy


### BETA: This API endpoint is not finalized, and there could be breaking changes before its final release.


### DELETE /api/v1/accounts/:account_id/lti_registrations/:id


Remove the specified LTI registration


#### Example Request:


```
This would delete the specified LTI registration
curl -X DELETE 'https://<canvas>/api/v1/accounts/<account_id>/lti_registrations/<registration_id>' \
     -H "Authorization: Bearer <token>"
```


---

## Bind an LTI Registration to an AccountLti::RegistrationsController#bind


### BETA: This API endpoint is not finalized, and there could be breaking changes before its final release.


### POST /api/v1/accounts/:account_id/lti_registrations/:id/bind


Enable or disable the specified LTI registration for the specified account. To enable an inherited registration (eg from Site Admin), pass the registrationâs global ID.


Only allowed for root accounts.


Specifics for Site Admin: âonâ enables and locks the registration on for all root accounts. âoffâ disables and hides the registration for all root accounts. âallowâ makes the registration visible to all root accounts, but accounts must bind it to use it.


Specifics for centrally-managed/federated consortia: Child root accounts may only bind registrations created in the same account. For parent root account, binding also applies to all child root accounts.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| workflow_state | Required | string | The desired state for this registration/account binding. âallowâ is only valid for Site Admin registrations. Allowed values: on , off , allow |


#### Example Request:


```
This would enable the specified LTI registration for the specified account
curl -X POST 'https://<canvas>/api/v1/accounts/<account_id>/lti_registrations/<registration_id>/bind' \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"workflow_state": "on"}'
```


---

## Install an LTI Registration from a TemplateLti::RegistrationsController#install_from_template


### BETA: This API endpoint is not finalized, and there could be breaking changes before its final release.


### POST /api/v1/accounts/:account_id/lti_registrations/:id/install_from_template


This endpoint installs a local copy of a âtemplateâ LTI registration from Site Admin into the specified account. The local copy can then be customized for the account without affecting the template registration.


Only allowed for root accounts and for registrations from Site Admin marked as templates.


#### Example Request:


```
This would install the specified template LTI registration into the specified account
curl -X POST 'https://<canvas>/api/v1/accounts/<account_id>/lti_registrations/<registration_id>/install_from_template' \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json"
```


---

## Search for Accounts and CoursesLti::RegistrationsController#context_search


### BETA: This API endpoint is not finalized, and there could be breaking changes before its final release.


### GET /api/v1/accounts/:account_id/lti_registrations/:registration_id/deployments/:deployment_id/context_search


This is a utility endpoint used by the Canvas Apps UI and may not serve general use cases.


Search for accounts and courses that match the search term on name, SIS id, or course code. Returns all matching accounts and courses, including those nested in sub-accounts. Returns bare-bones data about each account and course, and only up to 20 of each. Used to populate the search dropdowns when managing LTI registration availability.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| only_children_of |  | string | Account ID. If provided, only searches within this account and only returns direct children of this account. |
| search_term |  | string | String to search for in account names, SIS ids, or course codes. |


#### Example Request:


```
This would search for accounts and courses matching the search term "example"
curl -X GET 'https://<canvas>/api/v1/accounts/<account_id>/lti_registrations/<registration_id>/deployments/<deployment_id>/context_search?search_term=example' \
     -H "Authorization: Bearer <token>"
```


---

## Get LTI Registration Overlay HistoryLti::RegistrationsController#overlay_history


### BETA: This API endpoint is not finalized, and there could be breaking changes before its final release.


### GET /api/v1/accounts/:account_id/lti_registrations/:id/overlay_history


Returns the overlay history items for the specified LTI registration.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| limit |  | integer | The maximum number of history items to return. Defaults to 10. Maximum allowed is 100. |


#### Example Request:


```
This would return the overlay history for the specified LTI registration
curl -X GET 'https://<canvas>/api/v1/accounts/<account_id>/lti_registrations/<registration_id>/overlay_history?limit=50' \
     -H "Authorization: Bearer <token>"
```


---

## Get LTI Registration HistoryLti::RegistrationsController#history


### BETA: This API endpoint is not finalized, and there could be breaking changes before its final release.


### GET /api/v1/accounts/:account_id/lti_registrations/:id/history


Returns the history entries for the specified LTI registration. This endpoint provides comprehensive change tracking for all fields associated with the registration, including registration fields, developer key changes, internal configuration changes, and overlay changes. Supports pagination using the page and per_page parameters. The default page size is 10.


#### Example Request:


```
This would return the history for the specified LTI registration
curl -X GET 'https://<canvas>/api/v1/accounts/<account_id>/lti_registrations/<registration_id>/history' \
     -H "Authorization: Bearer <token>"
```


---

## Get LTI Registration Update RequestLti::RegistrationsController#show_registration_update_request


### BETA: This API endpoint is not finalized, and there could be breaking changes before its final release.


### GET /api/v1/accounts/:account_id/lti_registrations/:id/update_requests/:update_request_id


Retrieves details about a specific registration update request.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| id |  | integer | The id of the registration. |
| update_request_id |  | integer | The id of the registration update request to retrieve. |


#### Example Request:


```
curl 'https://<canvas>/api/v1/accounts/<account_id>/lti_registrations/<id>/update_requests/<update_request_id>' \
     -H "Authorization: Bearer <token>"
```


---

## Apply LTI Registration Update RequstLti::RegistrationsController#apply_registration_update_request


### BETA: This API endpoint is not finalized, and there could be breaking changes before its final release.


### PUT /api/v1/accounts/:account_id/lti_registrations/:id/update_requests/:update_request_id/apply


Applies a registration update request to an existing registration, replacing the existing configuration and overlay with the new values. If the request is rejected, marks it as rejected without applying changes.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| id |  | integer | The id of the registration to update. |
| update_request_id |  | integer | The id of the registration update request to apply. |
| accepted | Required | boolean | Whether to accept (true) or reject (false) the registration update request. |
| overlay |  | LtiConfigurationOverlay | Optional overlay data to apply on top of the new configuration. |
| comment |  | string | Optional comment explaining the reason for applying this update. |


#### Example Request:


```
curl -X POST 'https://<canvas>/api/v1/accounts/<account_id>/lti_registrations/:id/update_requests/:update_request_id/apply' \
     -d '{"overlay": <LtiConfigurationOverlay>, "accepted": boolean}' \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <token>"
```
