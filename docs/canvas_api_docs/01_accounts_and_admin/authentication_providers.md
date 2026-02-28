# Authentication Providers

> Canvas API — Accounts & Admin  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List authentication providersAuthenticationProvidersController#index


### GET /api/v1/accounts/:account_id/authentication_providers


Returns a paginated list of authentication providers


#### Example Request:


```
curl 'https://<canvas>/api/v1/accounts/<account_id>/authentication_providers' \
     -H 'Authorization: Bearer <token>'
```


---

## Get authentication providerAuthenticationProvidersController#show


### GET /api/v1/accounts/:account_id/authentication_providers/:id


Get the specified authentication provider


#### Example Request:


```
curl 'https://<canvas>/api/v1/accounts/<account_id>/authentication_providers/<id>' \
     -H 'Authorization: Bearer <token>'
```


---

## Add authentication providerAuthenticationProvidersController#create


### POST /api/v1/accounts/:account_id/authentication_providers


Add external authentication provider(s) for the account. Services may be Apple, CAS, Facebook, GitHub, Google, LDAP, LinkedIn, Microsoft, OpenID Connect, or SAML.


Each authentication provider is specified as a set of parameters as described below. A provider specification must include an âauth_typeâ parameter with a value of âappleâ, âcanvasâ, âcasâ, âcleverâ, âfacebookâ, âgithubâ, âgoogleâ, âldapâ, âlinkedinâ, âmicrosoftâ, âopenid_connectâ, or âsamlâ. The other recognized parameters depend on this auth_type; unrecognized parameters are discarded. Provider specifications not specifying a valid auth_type are ignored.


You can set the âpositionâ for any provider. The config in the 1st position is considered the default. You can set âjit_provisioningâ for any provider besides Canvas. You can set âmfa_requiredâ for any provider.


For Apple, the additional recognized parameters are:

- client_id [Required] The developerâs client identifier, as provided by WWDR. Not available if configured globally for Canvas.
- login_attribute [Optional] The attribute to use to look up the userâs login in Canvas. Either âsubâ (the default), or âemailâ
- federated_attributes [Optional] See FederatedAttributesConfig. Valid provider attributes are âemailâ, âfirstNameâ, âlastNameâ, and âsubâ.


For Canvas, the additional recognized parameter is:

- self_registration âallâ, ânoneâ, or âobserverâ - who is allowed to register as a new user


For CAS, the additional recognized parameters are:

- auth_base The CAS serverâs URL.
- log_in_url [Optional] An alternate SSO URL for logging into CAS. You probably should not set this.


For Clever, the additional recognized parameters are:

- client_id [Required] The Clever applicationâs Client ID. Not available if configured globally for Canvas.
- client_secret [Required] The Clever applicationâs Client Secret. Not available if configured globally for Canvas.
- district_id [Optional] A districtâs Clever ID. Leave this blank to let Clever handle the details with its District Picker. This is required for Clever Instant Login to work in a multi-tenant environment.
- login_attribute [Optional] The attribute to use to look up the userâs login in Canvas. Either âidâ (the default), âsis_idâ, âemailâ, âstudent_numberâ, or âteacher_numberâ. Note that some fields may not be populated for all users at Clever.
- federated_attributes [Optional] See FederatedAttributesConfig. Valid provider attributes are âidâ, âsis_idâ, âemailâ, âstudent_numberâ, and âteacher_numberâ.


For Facebook, the additional recognized parameters are:

- app_id [Required] The Facebook App ID. Not available if configured globally for Canvas.
- app_secret [Required] The Facebook App Secret. Not available if configured globally for Canvas.
- login_attribute [Optional] The attribute to use to look up the userâs login in Canvas. Either âidâ (the default), or âemailâ
- federated_attributes [Optional] See FederatedAttributesConfig. Valid provider attributes are âemailâ, âfirst_nameâ, âidâ, âlast_nameâ, âlocaleâ, and ânameâ.


For GitHub, the additional recognized parameters are:

- domain [Optional] The domain of a GitHub Enterprise installation. I.e. github.mycompany.com. If not set, it will default to the public github.com.
- client_id [Required] The GitHub applicationâs Client ID. Not available if configured globally for Canvas.
- client_secret [Required] The GitHub applicationâs Client Secret. Not available if configured globally for Canvas.
- login_attribute [Optional] The attribute to use to look up the userâs login in Canvas. Either âidâ (the default), or âloginâ
- federated_attributes [Optional] See FederatedAttributesConfig. Valid provider attributes are âemailâ, âidâ, âloginâ, and ânameâ.


For Google, the additional recognized parameters are:

- client_id [Required] The Google applicationâs Client ID. Not available if configured globally for Canvas.
- client_secret [Required] The Google applicationâs Client Secret. Not available if configured globally for Canvas.
- hosted_domain [Optional] A Google Apps domain to restrict logins to. See developers.google.com/identity/protocols/OpenIDConnect?hl=en#hd-param
- login_attribute [Optional] The attribute to use to look up the userâs login in Canvas. Either âsubâ (the default), or âemailâ
- federated_attributes [Optional] See FederatedAttributesConfig. Valid provider attributes are âemailâ, âfamily_nameâ, âgiven_nameâ, âlocaleâ, ânameâ, and âsubâ.


For LDAP, the additional recognized parameters are:

- auth_host The LDAP serverâs URL.
- auth_port [Optional, Integer] The LDAP serverâs TCP port. (default: 389)
- auth_over_tls [Optional] Whether to use TLS. Can be âsimple_tlsâ, or âstart_tlsâ. For backwards compatibility, booleans are also accepted, with true meaning simple_tls. If not provided, it will default to start_tls.
- auth_base [Optional] A default treebase parameter for searches performed against the LDAP server.
- auth_filter LDAP search filter. Use {{login}} as a placeholder for the username supplied by the user. For example: â(sAMAccountName={{login}})â.
- identifier_format [Optional] The LDAP attribute to use to look up the Canvas login. Omit to use the username supplied by the user.
- auth_username Username
- auth_password Password


For LinkedIn, the additional recognized parameters are:

- client_id [Required] The LinkedIn applicationâs Client ID. Not available if configured globally for Canvas.
- client_secret [Required] The LinkedIn applicationâs Client Secret. Not available if configured globally for Canvas.
- login_attribute [Optional] The attribute to use to look up the userâs login in Canvas. Either âidâ (the default), or âemailAddressâ
- federated_attributes [Optional] See FederatedAttributesConfig. Valid provider attributes are âemailAddressâ, âfirstNameâ, âidâ, âformattedNameâ, and âlastNameâ.


For Microsoft, the additional recognized parameters are:

- application_id [Required] The applicationâs ID.
- application_secret [Required] The applicationâs Client Secret (Password)
- tenant [Optional] See azure.microsoft.com/en-us/documentation/articles/active-directory-v2-protocols / Valid values are âcommonâ, âorganizationsâ, âconsumersâ, or an Azure Active Directory Tenant (as either a UUID or domain, such as contoso.onmicrosoft.com). Defaults to âcommonâ
- login_attribute [Optional] See azure.microsoft.com/en-us/documentation/articles/active-directory-v2-tokens/#idtokens Valid values are âsubâ, âemailâ, âoidâ, or âpreferred_usernameâ. Note that email may not always be populated in the userâs profile at Microsoft. Oid will not be populated for personal Microsoft accounts. Defaults to âsubâ
- federated_attributes [Optional] See FederatedAttributesConfig. Valid provider attributes are âemailâ, ânameâ, âpreferred_usernameâ, âoidâ, and âsubâ.


For OpenID Connect, the additional recognized parameters are:

- client_id [Required] The applicationâs Client ID.
- client_secret [Required] The applicationâs Client Secret.
- authorize_url [Required] The URL for getting starting the OAuth 2.0 web flow
- token_url [Required] The URL for exchanging the OAuth 2.0 authorization code for an Access Token and ID Token
- scope [Optional] Space separated additional scopes to request for the token. Note that you need not specify the âopenidâ scope, or any scopes that can be automatically inferred by the rules defined at openid.net/specs/openid-connect-core-1_0.html#ScopeClaims
- end_session_endpoint [Optional] URL to send the end user to after logging out of Canvas. See openid.net/specs/openid-connect-session-1_0.html#RPLogout
- userinfo_endpoint [Optional] URL to request additional claims from. If the initial ID Token received from the provider cannot be used to satisfy the login_attribute and all federated_attributes, this endpoint will be queried for additional information.
- login_attribute [Optional] The attribute of the ID Token to look up the userâs login in Canvas. Defaults to âsubâ.
- federated_attributes [Optional] See FederatedAttributesConfig. Any value is allowed for the provider attribute names, but standard claims are listed at openid.net/specs/openid-connect-core-1_0.html#StandardClaims


For SAML, the additional recognized parameters are:

- metadata [Optional] An XML document to parse as SAML metadata, and automatically populate idp_entity_id, log_in_url, log_out_url, certificate_fingerprint, and identifier_format
- metadata_uri [Optional] A URI to download the SAML metadata from, and automatically populate idp_entity_id, log_in_url, log_out_url, certificate_fingerprint, and identifier_format. This URI will also be saved, and the metadata periodically refreshed, automatically. If the metadata contains multiple entities, also supply idp_entity_id to distinguish which one you want (otherwise the only entity in the metadata will be inferred). If you provide the URI âurn:mace:incommonâ or â ukfederation.org.uk â, the InCommon or UK Access Management Federation metadata aggregate, respectively, will be used instead, and additional validation checks will happen (including validating that the metadata has been properly signed with the appropriate key).
- idp_entity_id The SAML IdPâs entity ID
- log_in_url The SAML serviceâs SSO target URL
- log_out_url [Optional] The SAML serviceâs SLO target URL
- certificate_fingerprint The SAML serviceâs certificate fingerprint.
- identifier_format The SAML serviceâs identifier format. Must be one of: urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress urn:oasis:names:tc:SAML:2.0:nameid-format:entity urn:oasis:names:tc:SAML:2.0:nameid-format:kerberos urn:oasis:names:tc:SAML:2.0:nameid-format:persistent urn:oasis:names:tc:SAML:2.0:nameid-format:transient urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified urn:oasis:names:tc:SAML:1.1:nameid-format:WindowsDomainQualifiedName urn:oasis:names:tc:SAML:1.1:nameid-format:X509SubjectName
- requested_authn_context [Optional] The SAML AuthnContext
- sig_alg [Optional] If set, AuthnRequest , LogoutRequest , and LogoutResponse messages are signed with the corresponding algorithm. Supported algorithms are: http://www.w3.org/2000/09/xmldsig#rsa-sha1 http://www.w3.org/2001/04/xmldsig-more#rsa-sha256 RSA-SHA1 and RSA-SHA256 are acceptable aliases.
- federated_attributes [Optional] See FederatedAttributesConfig. Any value is allowed for the provider attribute names.


#### Example Request:


```
# Create LDAP config
curl 'https://<canvas>/api/v1/accounts/<account_id>/authentication_providers' \
     -F 'auth_type=ldap' \
     -F 'auth_host=ldap.mydomain.edu' \
     -F 'auth_filter=(sAMAccountName={{login}})' \
     -F 'auth_username=username' \
     -F 'auth_password=bestpasswordever' \
     -F 'position=1' \
     -H 'Authorization: Bearer <token>'
```


```
# Create SAML config
curl 'https://<canvas>/api/v1/accounts/<account_id>/authentication_providers' \
     -F 'auth_type=saml' \
     -F 'idp_entity_id=<idp_entity_id>' \
     -F 'log_in_url=<login_url>' \
     -F 'log_out_url=<logout_url>' \
     -F 'certificate_fingerprint=<fingerprint>' \
     -H 'Authorization: Bearer <token>'
```


```
# Create CAS config
curl 'https://<canvas>/api/v1/accounts/<account_id>/authentication_providers' \
     -F 'auth_type=cas' \
     -F 'auth_base=cas.mydomain.edu' \
     -F 'log_in_url=<login_url>' \
     -H 'Authorization: Bearer <token>'
```


---

## Update authentication providerAuthenticationProvidersController#update


### PUT /api/v1/accounts/:account_id/authentication_providers/:id


Update an authentication provider using the same options as the Add authentication provider endpoint. You cannot update an existing provider to a new authentication type.


#### Example Request:


```
# update SAML config
curl -X PUT 'https://<canvas>/api/v1/accounts/<account_id>/authentication_providers/<id>' \
     -F 'idp_entity_id=<new_idp_entity_id>' \
     -F 'log_in_url=<new_url>' \
     -H 'Authorization: Bearer <token>'
```


---

## Delete authentication providerAuthenticationProvidersController#destroy


### DELETE /api/v1/accounts/:account_id/authentication_providers/:id


Delete the config


#### Example Request:


```
curl -X DELETE 'https://<canvas>/api/v1/accounts/<account_id>/authentication_providers/<id>' \
     -H 'Authorization: Bearer <token>'
```


---

## Restore a deleted authentication providerAuthenticationProvidersController#restore


### PUT /api/v1/accounts/:account_id/authentication_providers/:id/restore


Restore an authentication provider back to active that was previously deleted. Only available to admins who can manage_account_settings for given root account.


#### Example Request:


```
curl -X PUT 'https://<canvas>/api/v1/accounts/<account_id>/authentication_providers/<id>/restore' \
     -H 'Authorization: Bearer <token>'
```


---

## Show account auth settingsAuthenticationProvidersController#show_sso_settings


### GET /api/v1/accounts/:account_id/sso_settings


The way to get the current state of each account level setting thatâs relevant to Single Sign On configuration


You can list the current state of each setting with âupdate_sso_settingsâ


#### Example Request:


```
curl -XGET 'https://<canvas>/api/v1/accounts/<account_id>/sso_settings' \
     -H 'Authorization: Bearer <token>'
```


---

## Update account auth settingsAuthenticationProvidersController#update_sso_settings


### PUT /api/v1/accounts/:account_id/sso_settings


For various cases of mixed SSO configurations, you may need to set some configuration at the account level to handle the particulars of your setup.


This endpoint accepts a PUT request to set several possible account settings. All setting are optional on each request, any that are not provided at all are simply retained as is.  Any that provide the key but a null-ish value (blank string, null, undefined) will be UN-set.


You can list the current state of each setting with âshow_sso_settingsâ


#### Example Request:


```
curl -XPUT 'https://<canvas>/api/v1/accounts/<account_id>/sso_settings' \
     -F 'sso_settings[auth_discovery_url]=<new_url>' \
     -F 'sso_settings[change_password_url]=<new_url>' \
     -F 'sso_settings[login_handle_name]=<new_handle>' \
     -H 'Authorization: Bearer <token>'
```
