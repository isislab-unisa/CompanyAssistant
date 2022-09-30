import store from "../store"
import { LOG_IN,LOG_OUT } from '../store/actions';

export async function logUser(event) {
  event.preventDefault()

  // prendo i dati dal ws
  const res = await fetch(process.env.NEXT_PUBLIC_SERVER_ADDRESS + '/login', {
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
    }),
    body: "username=" + event.target.username.value + "&password=" + event.target.password.value,

    method: 'POST'
  })
  const result = await res.json()

  // salvo i dati in sessione
  if (result.token != null && result.token != "") {
    store.dispatch({
      type: LOG_IN,
      token: result.token,
      logged: true,
      username: result.username,
      userType: result.type
    })

    window.location.href = "/";
  }
  else
    logOut()
}

export async function logUserNew(username,password) {

  // prendo i dati dal ws
  const res = await fetch(process.env.NEXT_PUBLIC_SERVER_ADDRESS + '/login', {
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
    }),
    body: "username=" + username + "&password=" + password,

    method: 'POST'
  })
  const result = await res.json()

  // salvo i dati in sessione
  if (result.token != null && result.token != "") {
    store.dispatch({
      type: LOG_IN,
      token: result.token,
      logged: true,
      username: result.username,
      userType: result.type
    })

    window.location.href = "/";
  }
  else
    logOut()
}

export async function logOut() {

  // salvo i dati in sessione
  store.dispatch({
    //SE NON FUNZIONA IL LOG OUT METTERE .LOG_IN
    type: LOG_OUT,
    token: "",
    logged: false,
    username: "",
    userType: ""
  })
  window.location.href = "/login";
}

export function isLogged() {
  console.log("store.getState()")
  console.log(store.getState())
  return store.getState().auth.logged
}
