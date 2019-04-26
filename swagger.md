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
| datos | body |  | No | [datos](#datos) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Se realizo la request con exito! | object |
| 404 | Request Invalida! | object |
| 500 | Fallo el server | object |

### /signUp

#### POST
##### Summary:

Registra a un usuario nuevo o notifica que ya existe

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| usuario | body |  | No | [usuario](#usuario) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Request Exitoso! | object |
| 500 | Request Invalida! | object |

### /logFacebook

#### POST
##### Summary:

Envia el token de facebook del usuario que se logueo.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token | body |  | No | [token](#token) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Se realizo la request con exito! | object |
| 400 | Request Invalida! | object |

### /profile

#### PUT
##### Summary:

Envia el token del usuario que quiere modificar los datos del perfil y los datos que quiere modificar.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| usuario | body |  | No | [usuario_1](#usuario_1) |
|  | body |  | Yes | [token](#token) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Request Exitoso! | object |
| 500 | Fallo el servidor | object |

### /profile/:email

#### GET
##### Summary:

Se muestra el perfil del usuario al cual le corresponde el email del path (poner el mail sin las llaves en los costados).

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| email | path | email del usuario del cual se quiere ver el perfil | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Request Exitoso! | object |
| 400 | email del path no existe. | object |
| 500 | Fallo el servidor | object |

### Models


#### datos

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| email | string | el mail del usuario | Yes |
| psw | string | la contraseña del usuario | Yes |

#### usuario_1

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| token | string | el token que el server le asigno al hacer login | Yes |
| name | string | nombre nuevo del usuario | No |
| nickname | string | nickname nuevo del usuario | No |
| email | string | email nuevo del usuario | No |
| photo | string | url de la nueva foto del usuario | No |

#### inline_response_200_1

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| result | integer | Indica con un numero si fue registro exitoso o si el usuario ya existe en el sistema | No |

#### inline_response_200

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| valido | integer | Indica con un numero si las credenciales son validas o si el usuario o password son incorrectas | No |
| token | string |  | No |
| name | string |  | No |
| nickname | string |  | No |
| email | string |  | No |

#### inline_response_200_2

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| message | string | El perfil se modificó correctamente | No |

#### usuario

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string | nombre del usuario | Yes |
| nickname | string | nickname del usuario | Yes |
| email | string | email del usuario | Yes |
| psw | string | contraseña del usuario | Yes |

#### inline_response_200_3

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string | nombre del usuario consultado | No |
| nickname | string | apodo del usuario consultado | No |
| email | string | email del usuario consultado | No |
| photo | string | url de la foto del usuario consultado | No |

#### inline_response_500

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| message | string | se muestra el error que se produjo en el servidor | No |

#### inline_response_400

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| message | string |  | No |

#### token

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| token | string | el token de facebook asignado al usuario | Yes |

#### inline_response_400_1

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| message | string | el usuario solicitado no existe. | No |