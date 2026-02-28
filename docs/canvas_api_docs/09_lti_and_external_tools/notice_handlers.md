# Notice Handlers

> Canvas API — LTI & External Tools  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Show notice handlersLti::Ims::NoticeHandlersController#index


### GET /api/lti/notice-handlers/:context_external_tool_id


List all notice handlers for the tool


#### Example Response:


```
{
  "client_id": 10000000000267,
  "deployment_id": "123:8865aa05b4b79b64a91a86042e43af5ea8ae79eb",
  "notice_handlers": [
    {
      "handler": "",
      "notice_type": "LtiHelloWorldNotice"
    }
  ]
}
```


---

## Set notice handlerLti::Ims::NoticeHandlersController#update


### PUT /api/lti/notice-handlers/:context_external_tool_id


Subscribe (set) or unsubscribe (remove) a notice handler for the tool


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| notice_type | Required | string | The type of notice |
| handler | Required | string | URL to receive the notice, or an empty string to unsubscribe |
| max_batch_size |  | integer | The maximum number of notices to include in a single batch |


#### Example Response:


```
{
    "handler": "",
    "notice_type": "LtiHelloWorldNotice"
}
```
