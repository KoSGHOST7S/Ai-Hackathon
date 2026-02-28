# External Tools

> Canvas API — LTI & External Tools  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List external toolsExternalToolsController#index


### GET /api/v1/courses/:course_id/external_tools


### GET /api/v1/accounts/:account_id/external_tools


### GET /api/v1/groups/:group_id/external_tools


Returns the paginated list of external tools for the current context. See the get request docs for a single tool for a list of properties on an external tool.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| search_term |  | string | The partial name of the tools to match and return. |
| selectable |  | boolean | If true, then only tools that are meant to be selectable are returned. |
| include_parents |  | boolean | If true, then include tools installed in all accounts above the current context |
| placement |  | string | The placement type to filter by. Return all tools at the current context as well as all tools from the parent, and filter the tools list to only those with a placement of âeditor_buttonâ |


#### Example Request:


```
curl 'https://<canvas>/api/v1/courses/<course_id>/external_tools?include_parents=true&placement=editor_button' \
     -H "Authorization: Bearer <token>"
```


---

## Get a sessionless launch url for an external tool.ExternalToolsController#generate_sessionless_launch


### GET /api/v1/courses/:course_id/external_tools/sessionless_launch


### GET /api/v1/accounts/:account_id/external_tools/sessionless_launch


Returns a sessionless launch url for an external tool. Prefers the resource_link_lookup_uuid, but defaults to the other passed


```
parameters id, url, and launch_type

```


NOTE: Either the resource_link_lookup_uuid, id, or url must be provided unless launch_type is assessment or module_item.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| id |  | string | The external id of the tool to launch. |
| url |  | string | The LTI launch url for the external tool. |
| assignment_id |  | string | The assignment id for an assignment launch. Required if launch_type is set to âassessmentâ. |
| module_item_id |  | string | The assignment id for a module item launch. Required if launch_type is set to âmodule_itemâ. |
| launch_type |  | string | The type of launch to perform on the external tool. Placement names (eg. âcourse_navigationâ) can also be specified to use the custom launch url for that placement; if done, the tool id must be provided. Allowed values: assessment , module_item |
| resource_link_lookup_uuid |  | string | The identifier to lookup a resource link. |


#### API response field:

- id The id for the external tool to be launched.
- name The name of the external tool to be launched.
- url The url to load to launch the external tool for the user.


#### Example Request:


```
Finds the tool by id and returns a sessionless launch url
curl 'https://<canvas>/api/v1/courses/<course_id>/external_tools/sessionless_launch' \
     -H "Authorization: Bearer <token>" \
     -F 'id=<external_tool_id>'
```


```
Finds the tool by launch url and returns a sessionless launch url
curl 'https://<canvas>/api/v1/courses/<course_id>/external_tools/sessionless_launch' \
     -H "Authorization: Bearer <token>" \
     -F 'url=<lti launch url>'
```


```
Finds the tool associated with a specific assignment and returns a sessionless launch url
curl 'https://<canvas>/api/v1/courses/<course_id>/external_tools/sessionless_launch' \
     -H "Authorization: Bearer <token>" \
     -F 'launch_type=assessment' \
     -F 'assignment_id=<assignment_id>'
```


```
Finds the tool associated with a specific module item and returns a sessionless launch url
curl 'https://<canvas>/api/v1/courses/<course_id>/external_tools/sessionless_launch' \
     -H "Authorization: Bearer <token>" \
     -F 'launch_type=module_item' \
     -F 'module_item_id=<module_item_id>'
```


```
Finds the tool by id and returns a sessionless launch url for a specific placement
curl 'https://<canvas>/api/v1/courses/<course_id>/external_tools/sessionless_launch' \
     -H "Authorization: Bearer <token>" \
     -F 'id=<external_tool_id>' \
     -F 'launch_type=<placement_name>'
```


---

## Get a single external toolExternalToolsController#show


### GET /api/v1/courses/:course_id/external_tools/:external_tool_id


### GET /api/v1/accounts/:account_id/external_tools/:external_tool_id


Returns the specified external tool.


---

## Create an external toolExternalToolsController#create


### POST /api/v1/courses/:course_id/external_tools


### POST /api/v1/accounts/:account_id/external_tools


Create an external tool in the specified course/account. The created tool will be returned, see the âshowâ endpoint for an example. If a client ID is supplied canvas will attempt to create a context external tool using the LTI 1.3 standard.


See the <a href=âfile.lti_dev_key_config.html#placements-paramsâ>Placements Documentation</a> for more information on what placements are available, the possible fields, and their accepted values.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| client_id | Required | string | The client id is attached to the developer key. If supplied all other parameters are unnecessary and will be ignored |
| name | Required | string | The name of the tool |
| privacy_level | Required | string | How much user information to send to the external tool. Allowed values: anonymous , name_only , email_only , public |
| consumer_key | Required | string | The consumer key for the external tool |
| shared_secret | Required | string | The shared secret with the external tool |
| description |  | string | A description of the tool |
| url |  | string | The url to match links against. Either âurlâ or âdomainâ should be set, not both. |
| domain |  | string | The domain to match links against. Either âurlâ or âdomainâ should be set, not both. |
| icon_url |  | string | The url of the icon to show for this tool |
| text |  | string | The default text to show for this tool |
| custom_fields[field_name] |  | string | Custom fields that will be sent to the tool consumer; can be used multiple times |
| is_rce_favorite |  | boolean | (Deprecated in favor of Mark tool to RCE Favorites and Unmark tool from RCE Favorites ) Whether this tool should appear in a preferred location in the RCE. This only applies to tools in root account contexts that have an editor button placement. |
| <placement_name>[<placement_configuration_key>] |  | variable | Set the <placement_configuration_key> value for a specific placement. |
| config_type |  | string | Configuration can be passed in as Common Cartridge XML instead of using query parameters. If this value is âby_urlâ or âby_xmlâ then an XML configuration will be expected in either the âconfig_xmlâ or âconfig_urlâ parameter. Note that the name parameter overrides the tool name provided in the XML. Allowed values: by_url , by_xml |
| config_xml |  | string | XML tool configuration, as specified in the Common Cartridge XML specification. This is required if âconfig_typeâ is set to âby_xmlâ |
| config_url |  | string | URL where the server can retrieve an XML tool configuration, as specified in the Common Cartridge XML specification. This is required if âconfig_typeâ is set to âby_urlâ |
| not_selectable |  | boolean | Default: false. If set to true, and if resource_selection is set to false, the tool wonât show up in the external tool selection UI in modules and assignments |
| oauth_compliant |  | boolean | Default: false, if set to true LTI query params will not be copied to the post body. |
| unified_tool_id |  | string | The unique identifier for the tool in LearnPlatform |


#### Example Request:


```
This would create a tool on this course with two custom fields and a course navigation tab
curl -X POST 'https://<canvas>/api/v1/courses/<course_id>/external_tools' \
     -H "Authorization: Bearer <token>" \
     -F 'name=LTI Example' \
     -F 'consumer_key=asdfg' \
     -F 'shared_secret=lkjh' \
     -F 'url=https://example.com/ims/lti' \
     -F 'privacy_level=name_only' \
     -F 'custom_fields[key1]=value1' \
     -F 'custom_fields[key2]=value2' \
     -F 'course_navigation[text]=Course Materials' \
     -F 'course_navigation[enabled]=true'
```


```
This would create a tool on the account with navigation for the user profile page
curl -X POST 'https://<canvas>/api/v1/accounts/<account_id>/external_tools' \
     -H "Authorization: Bearer <token>" \
     -F 'name=LTI Example' \
     -F 'consumer_key=asdfg' \
     -F 'shared_secret=lkjh' \
     -F 'url=https://example.com/ims/lti' \
     -F 'privacy_level=name_only' \
     -F 'user_navigation[url]=https://example.com/ims/lti/user_endpoint' \
     -F 'user_navigation[text]=Something Cool'
     -F 'user_navigation[enabled]=true'
```


```
This would create a tool on the account with configuration pulled from an external URL
curl -X POST 'https://<canvas>/api/v1/accounts/<account_id>/external_tools' \
     -H "Authorization: Bearer <token>" \
     -F 'name=LTI Example' \
     -F 'consumer_key=asdfg' \
     -F 'shared_secret=lkjh' \
     -F 'config_type=by_url' \
     -F 'config_url=https://example.com/ims/lti/tool_config.xml'
```


---

## Edit an external toolExternalToolsController#update


### PUT /api/v1/courses/:course_id/external_tools/:external_tool_id


### PUT /api/v1/accounts/:account_id/external_tools/:external_tool_id


Update the specified external tool. Uses same parameters as create. Returns the updated tool.


NOTE: Any updates made to LTI 1.3 tools with this API will be overridden if any changes are made to the toolâs associated LTI Registration/Developer Key configuration. In almost all cases, changes should be made to the toolâs associated LTI Registration configuration, not individual tools.


#### Example Request:


```
This would update the specified keys on this external tool
curl -X PUT 'https://<canvas>/api/v1/courses/<course_id>/external_tools/<external_tool_id>' \
     -H "Authorization: Bearer <token>" \
     -F 'name=Public Example' \
     -F 'privacy_level=public'
```


---

## Delete an external toolExternalToolsController#destroy


### DELETE /api/v1/courses/:course_id/external_tools/:external_tool_id


### DELETE /api/v1/accounts/:account_id/external_tools/:external_tool_id


Remove the specified external tool


#### Example Request:


```
This would delete the specified external tool
curl -X DELETE 'https://<canvas>/api/v1/courses/<course_id>/external_tools/<external_tool_id>' \
     -H "Authorization: Bearer <token>"
```


---

## Mark tool as RCE FavoriteExternalToolsController#mark_rce_favorite


### POST /api/v1/accounts/:account_id/external_tools/rce_favorites/:id


Mark the specified editor_button external tool as a favorite in the RCE editor for courses in the given account and its subaccounts (if the subaccounts havenât set their own RCE Favorites). This places the tool in a preferred location in the RCE. Cannot mark more than 2 tools as RCE Favorites.


#### Example Request:


```
curl -X POST 'https://<canvas>/api/v1/accounts/<account_id>/external_tools/rce_favorites/<id>' \
     -H "Authorization: Bearer <token>"
```


---

## Unmark tool as RCE FavoriteExternalToolsController#unmark_rce_favorite


### DELETE /api/v1/accounts/:account_id/external_tools/rce_favorites/:id


Unmark the specified external tool as a favorite in the RCE editor for the given account. The tool will remain available but will no longer appear in the preferred favorites location.


#### Example Request:


```
curl -X DELETE 'https://<canvas>/api/v1/accounts/<account_id>/external_tools/rce_favorites/<id>' \
     -H "Authorization: Bearer <token>"
```


---

## Add tool to Top Navigation FavoritesExternalToolsController#add_top_nav_favorite


### POST /api/v1/accounts/:account_id/external_tools/top_nav_favorites/:id


Adds a dedicated button in Top Navigation for the specified tool for the given account. Cannot set more than 2 top_navigation Favorites.


#### Example Request:


```
curl -X POST 'https://<canvas>/api/v1/accounts/<account_id>/external_tools/top_nav_favorites/<id>' \
     -H "Authorization: Bearer <token>"
```


---

## Remove tool from Top Navigation FavoritesExternalToolsController#remove_top_nav_favorite


### DELETE /api/v1/accounts/:account_id/external_tools/top_nav_favorites/:id


Removes the dedicated button in Top Navigation for the specified tool for the given account.


#### Example Request:


```
curl -X DELETE 'https://<canvas>/api/v1/accounts/<account_id>/external_tools/top_nav_favorites/<id>' \
     -H "Authorization: Bearer <token>"
```


---

## Get visible course navigation toolsExternalToolsController#all_visible_nav_tools


### GET /api/v1/external_tools/visible_course_nav_tools


Get a list of external tools with the course_navigation placement that have not been hidden in course settings and whose visibility settings apply to the requesting user. These tools are the same that appear in the course navigation.


The response format is the same as for List external tools, but with additional context_id and context_name fields on each element in the array.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| context_codes[] | Required | string | List of context_codes to retrieve visible course nav tools for (for example, course_123 ). Only courses are presently supported. |


#### API response field:

- context_id The unique identifier of the associated context
- context_name The name of the associated context


#### Example Request:


```
curl 'https://<canvas>/api/v1/external_tools/visible_course_nav_tools?context_codes[]=course_5' \
     -H "Authorization: Bearer <token>"
```


#### Example Response:


```
[{
  "id": 1,
  "domain": "domain.example.com",
  "url": "http://www.example.com/ims/lti",
  "context_id": 5,
  "context_name": "Example Course",
  ...
},
{ ...  }]
```


---

## Get visible course navigation tools for a single courseExternalToolsController#visible_course_nav_tools


### GET /api/v1/courses/:course_id/external_tools/visible_course_nav_tools


Get a list of external tools with the course_navigation placement that have not been hidden in course settings and whose visibility settings apply to the requesting user. These tools are the same that appear in the course navigation.


The response format is the same as Get visible course navigation tools.


#### Example Request:


```
curl 'https://<canvas>/api/v1/courses/<course_id>/external_tools/visible_course_nav_tools' \
     -H "Authorization: Bearer <token>"
```
