# Lti Public Jwk

> Canvas API — LTI & External Tools  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Update Public JWKLti::PublicJwkController#update


### PUT /api/lti/developer_key/update_public_jwk


Rotate the public key in jwk format when using lti services


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| public_jwk | Required | json | The new public jwk that will be set to the tools current public jwk. |
