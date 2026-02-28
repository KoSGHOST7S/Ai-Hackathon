# Developer Key Account Bindings

> Canvas API — Accounts & Admin  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Create a Developer Key Account BindingDeveloperKeyAccountBindingsController#create_or_update


### POST /api/v1/accounts/:account_id/developer_keys/:developer_key_id/developer_key_account_bindings


Create a new Developer Key Account Binding. The developer key specified in the request URL must be available in the requested account or the requested accountâs account chain. If the binding already exists for the specified account/key combination it will be updated.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| workflow_state |  | string | The workflow state for the binding. Must be one of âonâ, âoffâ, or âallowâ. Defaults to âoffâ. |
