# Hypechat API
API para la app Hypechat de la materia 75.52 Taller de Programacion 2 de la FIUBA

## Version: 1.0.0

### /login

#### POST
##### Summary:

Valida al usuario que quiere ingresar a la app

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| loginInfo | body |  | Yes | [loginCredentials](#logincredentials) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Se realizo la request con exito! | [user](#user) |
| 404 | Bad login information | [Error](#error) |
| 500 | Server error | [Error](#error) |

### /signUp

#### POST
##### Summary:

Receives user information through the body and registers it as a new user if it doesn't already exists.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| userSignUpData | body |  | Yes | [signUpCredentials](#signupcredentials) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Succesful request | [user](#user) |
| 500 | Server error | [Error](#error) |

### /loginFacebook

#### POST
##### Summary:

sends user's facebook token for login.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| facebookToken | body |  | Yes | [facebookLoginCredentials](#facebooklogincredentials) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Se realizo la request con exito! | [user](#user) |
| 400 | Bad login information | [Error](#error) |
| 500 | Server error | [Error](#error) |

### /profile/{userEmail}

#### GET
##### Summary:

Se muestran los datos (sin pws y token) del usuario al cual le corresponde el email del path (poner el mail sin las llaves en los costados).

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| email | path | email del usuario del cual se quiere ver el perfil | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Request Exitoso! | [userProfile](#userprofile) |
| 400 | email del path no existe. | [Error](#error) |
| 500 | Fallo el servidor | [Error](#error) |

### /profile

#### PUT
##### Summary:

updates information fields (with exception of the token), of the user identified by the token, provided in the body.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| userProfile | body |  | No | [user](#user) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | string |
| 500 | Fallo el servidor | [Error](#error) |

### /password

#### PUT
##### Summary:

updates password of the user identified by the token, provided in the body.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| user | body |  | No | [user](#user) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | string |
| 500 | Fallo el servidor | [Error](#error) |

### /recoveredPassword

#### GET
##### Summary:

returns a token with which the password can be recovered

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| userToken | body |  | Yes | object |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | object |
| 400 | user dose not exist | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### Models


#### user

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| token | string | user login token | No |
| name | string | user name | No |
| nickname | string | user nickname | No |
| email | string | null | No |
| photo | string | url de la nueva foto del usuario | No |

#### signUpCredentials

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| psw | string | user password | Yes |
| name | string | user name | No |
| nickname | string | user nickname | No |
| email | string | null | Yes |
| photo | string | url de la nueva foto del usuario | No |

#### logInCredentials

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| email | string | user email | Yes |
| psw | string | user password | Yes |

#### facebookLogInCredentials

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| token | string | user token asigned by facebook api | Yes |

#### userProfile

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string | user name | No |
| nickname | string | user nickname | No |
| email | string | null | No |
| photo | string | url de la nueva foto del usuario | No |

#### Error

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| code | int32 |  | No |
| message | string |  | No |