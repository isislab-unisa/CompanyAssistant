
import store from "../store/"


export async function create(callback, vm) {

    let headers = new Headers();
    headers.set('Authorization', store.getState().auth.token);
    headers.set('Content-Type', 'application/x-www-form-urlencoded',)

    fetch(process.env.NEXT_PUBLIC_SERVER_ADDRESS + "/api/v1/vms/create/" + vm.name + "/" + vm.osType, {
        method: 'PUT',
        headers: headers,
        body: "username=" + vm.username + "&password=" + vm.password + "&account=" + vm.account + "&tags=" + JSON.stringify(vm.selectedTags),

    })
        .then(res => res.json())
        .then(
            (result) => {
                callback(result, null)
            },
            (error) => {
                callback(null, error)
            }
        )

}

export async function existVm(callback, vmName) {

    console.log("NAMEMMMEMEME: "+vmName)

    let headers = new Headers();
    headers.set('Authorization', store.getState().auth.token);
    headers.set('Content-Type', 'application/x-www-form-urlencoded',)

    fetch(process.env.NEXT_PUBLIC_SERVER_ADDRESS + "/api/v1/vms/exist/" + vmName, {
        method: 'GET',
        headers: headers,

    })
        .then(res => res.json())
        .then(
            (result) => {
                callback(result.result, null)
            },
            (error) => {
                callback(null, error)
            }
        )

}

export async function backupVm(callback, vmName, storage) {

    let headers = new Headers();
    headers.set('Authorization', store.getState().auth.token);
    headers.set('Content-Type', 'application/x-www-form-urlencoded',)

    fetch(process.env.NEXT_PUBLIC_SERVER_ADDRESS + "/api/v1/vms/backup/" + vmName, {
        method: 'PUT',
        headers: headers,
        body: "storage=" + storage,

    })
        .then(res => res.json())
        .then(
            (result) => {
                callback(result.result, null)
            },
            (error) => {
                callback(null, error)
            }
        )

}



export async function remove(callback, vmName) {

    let headers = new Headers();

    headers.set('Authorization', store.getState().auth.token);
    headers.set('Content-Type', 'application/x-www-form-urlencoded',)

    fetch(process.env.NEXT_PUBLIC_SERVER_ADDRESS + "/api/v1/vms/delete/" + vmName, {
        method: 'DELETE',
        headers: headers,

    })
        .then(res => res.json())
        .then(
            (result) => {
                callback(result, null)
            },
            (error) => {
                callback(null, error)
            }
        )

}

export async function use(callback, vmName) {

    let headers = new Headers();

    headers.set('Authorization', store.getState().auth.token);
    headers.set('Content-Type', 'application/x-www-form-urlencoded',)


    fetch(process.env.NEXT_PUBLIC_SERVER_ADDRESS + "/api/v1/vms/use/" + vmName, {
        method: 'PUT',
        headers: headers,

    })
        .then(res => res.json())
        .then(
            (result) => {
                callback(result, null)
            },
            (error) => {
                callback(null, error)
            }
        )

}



export async function getVms(callback) {

    let headers = new Headers();
    headers.set('Authorization',store.getState().auth.token);

    fetch(process.env.NEXT_PUBLIC_SERVER_ADDRESS + "/api/v1/vms/getAll", { headers: headers })
        .then(res => res.json())
        .then(
            (result) => {
                callback(result.vms, null)
            },
            (error) => {
                callback(null, error)
            }
        )

}



export async function getVmsInUse(callback) {

    let headers = new Headers();
    headers.set('Authorization',store.getState().auth.token);

    fetch(process.env.NEXT_PUBLIC_SERVER_ADDRESS + "/api/v1/vms/getAllInUse", { headers: headers })
        .then(res => res.json())
        .then(
            (result) => {
                callback(result.vms, null)
            },
            (error) => {
                callback(null, error)
            }
        )

}


export async function getVmsTypes(callback) {

    let headers = new Headers();
    headers.set('Authorization', store.getState().auth.token);

    fetch(process.env.NEXT_PUBLIC_SERVER_ADDRESS + "/api/v1/vms/getVmTypes", { headers: headers })
      .then(res => res.json())
      .then(
        (result) => {
            callback(result.vmTypes, null)
        },
        (error) => {
            callback(null, error)
        }
    )

}