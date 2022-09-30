
import store from "../store/"



export async function getTags(callback) {

    let headers = new Headers();
    headers.set('Authorization', store.getState().auth.token);

    fetch(process.env.NEXT_PUBLIC_SERVER_ADDRESS + "/api/v1/tags/getAll", { headers: headers })
      .then(res => res.json())
      .then(
        (result) => {
            callback(result.tags, null)
        },
        (error) => {
            callback(null, error)
        }
    )

}