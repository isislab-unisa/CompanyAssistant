
import store from "../store/"


export async function create(callback, group) {

    console.log("create group");
    let headers = new Headers();
    headers.set('Authorization', store.getState().auth.token);
    headers.set('Content-Type', 'application/x-www-form-urlencoded',)

    fetch(process.env.NEXT_PUBLIC_SERVER_ADDRESS + "/api/v1/groups/create/" + group.groupName, {
        method: 'PUT',
        headers: headers,
        body: "tags=" + JSON.stringify(group.selectedTags) + "&users=" + JSON.stringify(group.selectedUsers),
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

export async function existGroup(callback, name) {

    let headers = new Headers();
    headers.set('Authorization', store.getState().auth.token);
    headers.set('Content-Type', 'application/x-www-form-urlencoded',)

    fetch(process.env.NEXT_PUBLIC_SERVER_ADDRESS + "/api/v1/groups/exist/" + name, {
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

export async function getGroups(callback, name) {

    let headers = new Headers();
    headers.set('Authorization', store.getState().auth.token);
    headers.set('Content-Type', 'application/x-www-form-urlencoded',)

    fetch(process.env.NEXT_PUBLIC_SERVER_ADDRESS + "/api/v1/groups/getAll/", {
        method: 'GET',
        headers: headers,

    })
        .then(res => res.json())
        .then(
            (result) => {
                callback(result.groups, null)
            },
            (error) => {
                callback(null, error)
            }
        )

}


export async function edit(callback, group) {

    let headers = new Headers();
    headers.set('Authorization', store.getState().auth.token);
    headers.set('Content-Type', 'application/x-www-form-urlencoded',)

    fetch(process.env.NEXT_PUBLIC_SERVER_ADDRESS + "/api/v1/groups/setTags/" + group.groupName, {
        method: 'PATCH',
        headers: headers,
        body: "tags=" + JSON.stringify(group.selectedTags),
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


export async function exitFromGroup(callback, groupName, username) {

    console.log("username")
    console.log(username)
    console.log("groupName")
    console.log(groupName)

    let headers = new Headers();
    headers.set('Authorization', store.getState().auth.token);
    headers.set('Content-Type', 'application/x-www-form-urlencoded',)

    fetch(process.env.NEXT_PUBLIC_SERVER_ADDRESS + "/api/v1/users/deleteSingleGroup/" +username, {
        method: 'PATCH',
        headers: headers,
        body: "group=" + groupName,
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



// export async function getGroups(callback) {

//     let headers = new Headers();
//     headers.set('Authorization',store.getState().auth.token);

//     fetch(process.env.NEXT_PUBLIC_SERVER_ADDRESS + "/api/v1/groups/getAll", { headers: headers })
//         .then(res => res.json())
//         .then(
//             (result) => {
//                 callback(result.groups, null)
//             },
//             (error) => {
//                 callback(null, error)
//             }
//         )

// }