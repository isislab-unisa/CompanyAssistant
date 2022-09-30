import store from "../store/";

export async function getPolicies(callback) {
	let headers = new Headers();
	headers.set("Authorization", store.getState().auth.token);

	fetch(process.env.NEXT_PUBLIC_SERVER_ADDRESS + "/api/v1/policies/getAll", {
		headers: headers,
	})
		.then((res) => res.json())
		.then(
			(result) => {
				callback(result.policies, null);
			},
			(error) => {
				callback(null, error);
			}
		);
}
