import store from "../store/";

export async function create(callback, role) {
	let headers = new Headers();
	headers.set("Authorization", store.getState().auth.token);
	headers.set("Content-Type", "application/x-www-form-urlencoded");

	fetch(process.env.NEXT_PUBLIC_SERVER_ADDRESS + "/api/v1/roles/" + role.name, {
		method: "PUT",
		headers: headers,
		body: "policies=" + JSON.stringify(role.selectedPolicies),
	})
		.then((res) => res.json())
		.then(
			(result) => {
				callback(result, null);
			},
			(error) => {
				callback(null, error);
			}
		);
}

export async function existRole(callback, name) {
	let headers = new Headers();
	headers.set("Authorization", store.getState().auth.token);
	headers.set("Content-Type", "application/x-www-form-urlencoded");

	fetch(
		process.env.NEXT_PUBLIC_SERVER_ADDRESS + "/api/v1/roles/exist/" + name,
		{
			method: "GET",
			headers: headers,
		}
	)
		.then((res) => res.json())
		.then(
			(result) => {
				callback(result.result, null);
			},
			(error) => {
				callback(null, error);
			}
		);
}

export async function getRoles(callback) {
	let headers = new Headers();
	headers.set("Authorization", store.getState().auth.token);

	fetch(process.env.NEXT_PUBLIC_SERVER_ADDRESS + "/api/v1/roles/getAll", {
		headers: headers,
	})
		.then((res) => res.json())
		.then(
			(result) => {
				callback(result.roles, null);
			},
			(error) => {
				callback(null, error);
			}
		);
}
export async function remove(callback, roleName) {
	let headers = new Headers();

	headers.set("Authorization", store.getState().auth.token);
	headers.set("Content-Type", "application/x-www-form-urlencoded");

	fetch(process.env.NEXT_PUBLIC_SERVER_ADDRESS + "/api/v1/roles/" + roleName, {
		method: "DELETE",
		headers: headers,
	})
		.then((res) => res.json())
		.then(
			(result) => {
				callback(result, null);
			},
			(error) => {
				callback(null, error);
			}
		);
}

// export async function remove(callback, vmName) {

//     let headers = new Headers();

//     headers.set('Authorization', store.getState().auth.token);
//     headers.set('Content-Type', 'application/x-www-form-urlencoded',)

//     fetch(process.env.NEXT_PUBLIC_SERVER_ADDRESS + "/api/v1/vms/delete/" + vmName, {
//         method: 'DELETE',
//         headers: headers,

//     })
//         .then(res => res.json())
//         .then(
//             (result) => {
//                 callback(result, null)
//             },
//             (error) => {
//                 callback(null, error)
//             }
//         )

// }

// export async function use(callback, vmName) {

//     let headers = new Headers();

//     headers.set('Authorization', store.getState().auth.token);
//     headers.set('Content-Type', 'application/x-www-form-urlencoded',)

//     fetch(process.env.NEXT_PUBLIC_SERVER_ADDRESS + "/api/v1/vms/use/" + vmName, {
//         method: 'PUT',
//         headers: headers,

//     })
//         .then(res => res.json())
//         .then(
//             (result) => {
//                 callback(result, null)
//             },
//             (error) => {
//                 callback(null, error)
//             }
//         )

// }
