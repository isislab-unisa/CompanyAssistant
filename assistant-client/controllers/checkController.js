

/*export function checkPassword(password) {

    //Deve essere almeno di 8 caratteri e masssimo di 16 e deve contenere almeno un carattere speciale, almeno un numero, aleno una lettra grande e alemno una lettera piccola

    return password.match(/^[a-zA-Z\-]{5,10}$/)


}*/



export function checkPassword(password) {

    //Deve essere almeno di 8 caratteri e masssimo di 16 e deve contenere almeno un carattere speciale, almeno un numero, aleno una lettra grande e alemno una lettera piccola

    return password.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/)


}



export function checkName(name) {

    //Può contenere solo lettere grandi o piccole oppure -, deve essere di alemno 2 caratteri e massimo di 86

    return name.match(/^[a-zA-Z\-]{2,86}$/)

}

export function checkNameVm(name) {

    //Può contenere solo lettere grandi o piccole oppure -, deve essere di alemno 5 caratteri e massimo di 10
    return name.match(/^[a-z]{5,10}$/)

}
export function checkNameGroup(name) {

    //Può contenere solo lettere grandi o piccole oppure -, deve essere di alemno 5 caratteri e massimo di 10
    return name.match(/^[a-zA-Z0-9\-]{5,10}$/)

}
export function checkNameRole(name) {

    //Può contenere solo lettere grandi o piccole oppure -, deve essere di alemno 5 caratteri e massimo di 10
    return name.match(/^[a-zA-Z0-9\-]{5,10}$/)

}

export function checkNameAccount(name) {

    //Può contenere solo lettere grandi o piccole oppure -, deve essere di alemno 5 caratteri e massimo di 10
    return name.match(/^[a-zA-Z0-9\-]{5,10}$/)

}


export function checkUsername(username) {

    //Può contenere solo lettere grandi o piccole oppure numeri, deve essere di alemno 5 caratteri e massimo di 10
    return username.match(/^[a-zA-Z0-9]{5,10}$/)

}

export function checkUsernameVm(username) {

    //Può contenere solo lettere grandi o piccole oppure numeri, deve essere di alemno 5 caratteri e massimo di 10
    return username.match(/^[a-z]{5,10}$/)

}

export function checkOs(os) {

    if(os != "")
       return true
    else return false

}

export function checkAccount(account) {

    if(account != "")
       return true
    else return false

}


export function checkVmSize(size) {

    if(size != "")
       return true
    else return false

}

export function checkProvider(provider) {

    if(provider != "")
       return true
    else return false

}




