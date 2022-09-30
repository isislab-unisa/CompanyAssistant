## Creare una macchina virtuale

```
PUT /api/v1/vms/create/[name]/[vmType]
```

### Parametri URI
**name:** Il nome da assegnare alla macchina virtuale <br>
**vmType:** Il tipo da assegnare alla macchina virtuale

### Autenticazione
Gli argomenti seguenti sono obbligatori:

| Nome           | Descrizione                     |
| :------------- | ------------------------------- |
| Authorization: | Obbligatorio. Impostare un Bearer token di accesso valido. |

### Corpo della richiesta

| Nome     | Tipo   | Descrizione                                                                             |
| :------- | ------ | --------------------------------------------------------------------------------------- |
| vmType   | String | Il tipo della macchina virtuale                                                         |
| name     | String | Il nome della macchina virtuale                                                         |
| username | String | L' username che sarà utilizzato per l'accesso                                           |
| password | String | La password che sarà utilizzata per l'accesso                                           |
| account  | String | Il nome dell'account, legato ad un Cloud Provider, a cui si vuole associare la macchina |


## Cancellare una macchina virtuale

```
DELETE /api/v1/vms/delete/[name]
```
### Parametri URI
**name:** Il nome della macchine virtuale

### Autenticazione
Gli argomenti seguenti sono obbligatori:

| Nome           | Descrizione                     |
| :------------- | ------------------------------- |
| Authorization: | Obbligatorio. Impostare un Bearer token di accesso valido. |


## Get di tutte le macchine virtuali

```
GET /api/v1/vms/getAll
```

### Autenticazione
Gli argomenti seguenti sono obbligatori:

| Nome           | Descrizione                     |
| :------------- | ------------------------------- |
| Authorization: | Obbligatorio. Impostare un Bearer token di accesso valido. |

## Usere una macchina virtuale

```
PUT /api/v1/vms/use/[vmName]
```
### Parametri URI
**vmName:** Il nome della macchina virtuale 

### Autenticazione
Gli argomenti seguenti sono obbligatori:

| Nome           | Descrizione                     |
| :------------- | ------------------------------- |
| Authorization: | Obbligatorio. Impostare un Bearer token di accesso valido. |

## Get di tutti i tipi di macchine virtuali

```
GET /api/v1/vms/getVmTypes
```

### Autenticazione
Gli argomenti seguenti sono obbligatori:

| Nome           | Descrizione                     |
| :------------- | ------------------------------- |
| Authorization: | Obbligatorio. Impostare un Bearer token di accesso valido. |

## Assegnare un indirizzo IP ad una macchina virtuale

```
GET /api/v1/vms/assignIp/[ip]/[name]
```
### Parametri URI
**name:** Il nome della macchina virtuale <br>
**ip:** l' indirizzo IP da assegnare 

### Autenticazione
Gli argomenti seguenti sono obbligatori:

| Nome           | Descrizione                     |
| :------------- | ------------------------------- |
| Authorization: | Obbligatorio. Impostare un Bearer token di accesso valido. |

## Verificare se una macchine virtuale esiste

```
GET /api/v1/vms/exist/[vmName]
```

### Parametri URI
**vmName:** Il nome della macchina virtuale 

### Autenticazione
Gli argomenti seguenti sono obbligatori:

| Nome           | Descrizione                     |
| :------------- | ------------------------------- |
| Authorization: | Obbligatorio. Impostare un Bearer token di accesso valido. |
