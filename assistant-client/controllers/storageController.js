import store from "../store/";

export async function create(callback, storage) {
	let headers = new Headers();
	headers.set("Authorization", store.getState().auth.token);
	headers.set("Content-Type", "application/x-www-form-urlencoded");

	fetch(
		process.env.NEXT_PUBLIC_SERVER_ADDRESS +
			"/api/v1/storage/create/" +
			storage.name,
		{
			method: "PUT",
			headers: headers,
			body:
				"size=" +
				storage.size +
				"&tags=" +
				JSON.stringify(storage.selectedTags) +
				"&account=" +
				storage.account,
		}
	)
		.then((res) => res.json())
		.then(
			(result) => {
				console.log("****result++++++");
				console.log(result);
				callback(result, null);
			},
			(error) => {
				callback(null, error);
			}
		);
}

export async function getStorage(callback, name) {
	let headers = new Headers();
	headers.set("Authorization", store.getState().auth.token);
	headers.set("Content-Type", "application/x-www-form-urlencoded");

	callback(
		[
			{ storage: { name: "test", tags: [] } },
			{ storage: { name: "test", tags: [] } },
			{ storage: { name: "test", tags: [] } },
		],
		null
	);

	fetch(process.env.NEXT_PUBLIC_SERVER_ADDRESS + "/api/v1/storage/getAll/", {
		method: "GET",
		headers: headers,
	})
		.then((res) => res.json())
		.then(
			(result) => {
				callback(result.storage, null);
			},
			(error) => {
				callback(null, error);
			}
		);
}

export async function edit(callback, storage) {
	let headers = new Headers();
	headers.set("Authorization", store.getState().auth.token);
	headers.set("Content-Type", "application/x-www-form-urlencoded");

	fetch(
		process.env.NEXT_PUBLIC_SERVER_ADDRESS +
			"/api/v1/storage/setTags/" +
			storage.storageName,
		{
			method: "PATCH",
			headers: headers,
			body: "tags=" + JSON.stringify(storage.selectedTags),
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

export async function deleteStorage(callback, storage) {
	let headers = new Headers();
	headers.set("Authorization", store.getState().auth.token);
	headers.set("Content-Type", "application/x-www-form-urlencoded");

	console.log("addiooooo");
	console.log(storage);

	fetch(
		process.env.NEXT_PUBLIC_SERVER_ADDRESS +
			"/api/v1/storage/delete/" +
			storage.name,
		{
			method: "DELETE",
			headers: headers,
		}
	)
		.then((res) => res.json())
		.then(
			(result) => {
				console.log(result);
				callback(result, null);
			},
			(error) => {
				callback(null, error);
			}
		);
}
