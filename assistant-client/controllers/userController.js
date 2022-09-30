
import store from "../store/"


export async function register(callback, user) {



    let headers = new Headers();

    headers.set('Authorization', store.getState().auth.token);
    headers.set('Content-Type', 'application/x-www-form-urlencoded',)

    fetch(process.env.NEXT_PUBLIC_SERVER_ADDRESS + "/api/v1/users/create", {
        method: 'PUT',
        headers: headers,
        body: "username=" + user.username + "&password=" + user.password + "&name=" + user.name + "&lastname=" + user.lastname + "&email=" + user.email + "&role=" + user.role + "&groups=" + JSON.stringify(user.groups),

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

export async function existUser(callback, username) {

    let headers = new Headers();
    headers.set('Authorization', store.getState().auth.token);
    headers.set('Content-Type', 'application/x-www-form-urlencoded',)

    fetch(process.env.NEXT_PUBLIC_SERVER_ADDRESS + "/api/v1/users/exist/" + username, {
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



export async function remove(callback, userId) {

    let headers = new Headers();

    headers.set('Authorization', store.getState().auth.token);
    headers.set('Content-Type', 'application/x-www-form-urlencoded',)

    fetch(process.env.NEXT_PUBLIC_SERVER_ADDRESS + "/api/v1/users/get/" + userId, {
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


export async function getUserRole(callback) {

    let headers = new Headers();
    headers.set('Authorization', store.getState().auth.token);
    headers.set('Content-Type', 'application/x-www-form-urlencoded',)

    fetch(process.env.NEXT_PUBLIC_SERVER_ADDRESS + "/api/v1/users/role/", {
        method: 'GET',
        headers: headers,
    })
        .then(res => res.json())
        .then(
            (result) => {
                if (result.role !== undefined) {
                    callback(result.role.policies, null)
                }
                else callback([], null)
            },
            (error) => {
                callback(null, error)
            }
        )

}

export async function getUsers(callback) {

    let headers = new Headers();
    headers.set('Authorization',store.getState().auth.token);

    fetch(process.env.NEXT_PUBLIC_SERVER_ADDRESS + "/api/v1/users/getAll", { headers: headers })
        .then(res => res.json())
        .then(
            (result) => {
                callback(result.users, null)
            },
            (error) => {
                callback(null, error)
            }
        )

}