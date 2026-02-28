# Services

> Canvas API — Accounts & Admin  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Get Kaltura configServicesApiController#show_kaltura_config


### GET /api/v1/services/kaltura


Return the config information for the Kaltura plugin in json format.


#### API response field:

- enabled Enabled state of the Kaltura plugin
- domain Main domain of the Kaltura instance (This is the URL where the Kaltura API resides)
- resources_domain Kaltura URL for grabbing thumbnails and other resources
- rtmp_domain Hostname to be used for RTMP recording
- partner_id Partner ID used for communicating with the Kaltura instance


#### Example Response:


```
# For an enabled Kaltura plugin:
{
  'domain': 'kaltura.example.com',
  'enabled': true,
  'partner_id': '123456',
  'resource_domain': 'cdn.kaltura.example.com',
  'rtmp_domain': 'rtmp.example.com'
}

# For a disabled or unconfigured Kaltura plugin:
{
  'enabled': false
}
```


---

## Start Kaltura sessionServicesApiController#start_kaltura_session


### POST /api/v1/services/kaltura_session


Start a new Kaltura session, so that new media can be recorded and uploaded to this Canvas instanceâs Kaltura instance.


#### API response field:

- ks The kaltura session id, for use in the kaltura v3 API. This can be used in the uploadtoken service, for instance, to upload a new media file into kaltura.


#### Example Response:


```
{
  'ks': '1e39ad505f30c4fa1af5752b51bd69fe'
}
```
