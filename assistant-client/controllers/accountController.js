import store from "../store/";

export async function create(callback, account) {
	let headers = new Headers();

	headers.set("Authorization", store.getState().auth.token);
	headers.set("Content-Type", "text");

	let myJSON = JSON.stringify(account);

	fetch(process.env.NEXT_PUBLIC_SERVER_ADDRESS + "/api/v1/providers/create/", {
		method: "PUT",
		headers: headers,
		body: myJSON,
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

export async function edit(callback, accountName, account) {
	let headers = new Headers();

	headers.set("Authorization", store.getState().auth.token);
	headers.set("Content-Type", "text");

	let myJSON = JSON.stringify(account);

	fetch(
		process.env.NEXT_PUBLIC_SERVER_ADDRESS +
			"/api/v1/providers/edit/" +
			accountName,
		{
			method: "PATCH",
			headers: headers,
			body: myJSON,
		}
	)
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

export async function existAccount(callback, name) {
	let headers = new Headers();
	headers.set("Authorization", store.getState().auth.token);
	headers.set("Content-Type", "application/x-www-form-urlencoded");

	fetch(
		process.env.NEXT_PUBLIC_SERVER_ADDRESS + "/api/v1/providers/exist/" + name,
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

export async function checkStatus(callback, name) {
	let headers = new Headers();
	headers.set("Authorization", store.getState().auth.token);
	headers.set("Content-Type", "application/x-www-form-urlencoded");

	fetch(
		process.env.NEXT_PUBLIC_SERVER_ADDRESS +
			"/api/v1/providers/checkStatus/" +
			name,
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

export async function remove(callback, account) {
	let headers = new Headers();

	headers.set("Authorization", store.getState().auth.token);
	headers.set("Content-Type", "application/x-www-form-urlencoded");

	fetch(
		process.env.NEXT_PUBLIC_SERVER_ADDRESS + "/api/v1/providers/delete/" + account.name,
		{
			method: "DELETE",
			headers: headers,
		}
	)
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

export async function getAccounts(callback) {
	let headers = new Headers();
	headers.set("Authorization", store.getState().auth.token);

	fetch(
		process.env.NEXT_PUBLIC_SERVER_ADDRESS + "/api/v1/providers/getAllNames",
		{ headers: headers }
	)
		.then((res) => res.json())
		.then(
			(result) => {
				callback(result.accounts, null);
			},
			(error) => {
				callback(null, error);
			}
		);
}

export async function getParemeters(callback) {
	let headers = new Headers();
	headers.set("Authorization", store.getState().auth.token);

	fetch(
		process.env.NEXT_PUBLIC_SERVER_ADDRESS +
			"/api/v1/providers/getAllParameters",
		{ headers: headers }
	)
		.then((res) => res.json())
		.then(
			(result) => {
				callback(result.providers, null);
			},
			(error) => {
				callback(null, error);
			}
		);
}
