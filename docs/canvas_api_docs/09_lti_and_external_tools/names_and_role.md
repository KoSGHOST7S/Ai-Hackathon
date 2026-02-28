# Names And Role

> Canvas API — LTI & External Tools  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List Course MembershipsLti::Ims::NamesAndRolesController#course_index


### GET /api/lti/courses/:course_id/names_and_roles


Return active NamesAndRoleMemberships in the given course.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| rlid |  | string | If specified only NamesAndRoleMemberships with access to the LTI link references by this rlid will be included. Also causes the member array to be included for each returned NamesAndRoleMembership. If the role parameter is also present, it will be âand-edâ together with this parameter |
| role |  | string | If specified only NamesAndRoleMemberships having this role in the given Course will be included. Value must be a fully-qualified LTI/LIS role URN. If the rlid parameter is also present, it will be âand-edâ together with this parameter |
| limit |  | string | May be used to limit the number of NamesAndRoleMemberships returned in a page. Defaults to 50. |


---

## List Group MembershipsLti::Ims::NamesAndRolesController#group_index


### GET /api/lti/groups/:group_id/names_and_roles


Return active NamesAndRoleMemberships in the given group.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| `rlid` |  | string | If specified only NamesAndRoleMemberships with access to the LTI link references by this rlid will be included. Also causes the member array to be included for each returned NamesAndRoleMembership. If the role parameter is also present, it will be âand-edâ together with this parameter |
| role |  | string | If specified only NamesAndRoleMemberships having this role in the given Group will be included. Value must be a fully-qualified LTI/LIS role URN. Further, only purl.imsglobal.org/vocab/lis/v2/membership#Member and purl.imsglobal.org/vocab/lis/v2/membership#Manager are supported. If the rlid parameter is also present, it will be âand-edâ together with this parameter |
| limit |  | string | May be used to limit the number of NamesAndRoleMemberships returned in a page. Defaults to 50. |
