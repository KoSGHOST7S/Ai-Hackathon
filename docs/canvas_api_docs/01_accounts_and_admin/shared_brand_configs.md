# Shared Brand Configs

> Canvas API — Accounts & Admin  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Share a BrandConfig (Theme)SharedBrandConfigsController#create


### POST /api/v1/accounts/:account_id/shared_brand_configs


Create a SharedBrandConfig, which will give the given brand_config a name and make it available to other users of this account.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| shared_brand_config[name] | Required | string | Name to share this BrandConfig (theme) as. |
| shared_brand_config[brand_config_md5] | Required | string | MD5 of brand_config to share |


#### Example Request:


```
curl 'https://<canvas>/api/v1/accounts/<account_id>/shared_brand_configs' \
     -X POST \
     -F 'shared_brand_config[name]=Crimson and Gold Theme' \
     -F 'shared_brand_config[brand_config_md5]=a1f113321fa024e7a14cb0948597a2a4' \
     -H "Authorization: Bearer <token>"
```


---

## Update a shared themeSharedBrandConfigsController#update


### PUT /api/v1/accounts/:account_id/shared_brand_configs/:id


Update the specified shared_brand_config with a new name or to point to a new brand_config. Uses same parameters as create.


#### Example Request:


```
curl -X PUT 'https://<canvas>/api/v1/accounts/<account_id>/shared_brand_configs/<shared_brand_config_id>' \
     -H "Authorization: Bearer <token>" \
     -F 'shared_brand_config[name]=New Name' \
     -F 'shared_brand_config[brand_config_md5]=a1f113321fa024e7a14cb0948597a2a4'
```


---

## Un-share a BrandConfig (Theme)SharedBrandConfigsController#destroy


### DELETE /api/v1/shared_brand_configs/:id


Delete a SharedBrandConfig, which will unshare it so you nor anyone else in your account will see it as an option to pick from.


#### Example Request:


```
curl -X DELETE https://<canvas>/api/v1/shared_brand_configs/<id> \
     -H 'Authorization: Bearer <token>'
```
