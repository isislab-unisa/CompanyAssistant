## Creare un ruolo
```
PUT /api/v1/roles/[name]
```
### Parametri URI
**name:** nome del ruolo

### Autenticazione
Gli argomenti seguenti sono obbligatori:

| Nome           | Descrizione                                                |
| :------------- | ---------------------------------------------------------- |
| Authorization: | Obbligatorio. Impostare un Bearer token di accesso valido. |


### Corpo della richiesta

| Nome  | Tipo          | Descrizione                                                       |
| :---- | ------------- | ----------------------------------------------------------------- |
| policies  | Array(String) | Un array di stringhe contenente le politiche da associare al ruolo   |



## Cancellare un ruolo
```
DELETE /api/v1/roles/[name]
```
### Parametri URI
**name:** nome del ruolo

### Autenticazione
Gli argomenti seguenti sono obbligatori:

| Nome           | Descrizione                                                |
| :------------- | ---------------------------------------------------------- |
| Authorization: | Obbligatorio. Impostare un Bearer token di accesso valido. |

## Get di tutti i ruoli
```
GET /api/v1/roles/getAll
```

### Autenticazione
Gli argomenti seguenti sono obbligatori:

| Nome           | Descrizione                                                |
| :------------- | ---------------------------------------------------------- |
| Authorization: | Obbligatorio. Impostare un Bearer token di accesso valido. |

## Verificare se un rolo esiste
```
GET /api/v1/roles/exist/[name]
```
### Parametri URI
**name:** nome del ruolo

### Autenticazione
Gli argomenti seguenti sono obbligatori:

| Nome           | Descrizione                                                |
| :------------- | ---------------------------------------------------------- |
| Authorization: | Obbligatorio. Impostare un Bearer token di accesso valido. |
