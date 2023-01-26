import {ApiError, fetchApi} from "@/core/api";
import {WatchableValue} from "@/tools/utils";


class AuthManager {

    constructor() {
        this.isLoggedIn = new WatchableValue(false);
    }

    /**
     * Logs the user in
     * @param email {string}
     * @param password {string}
     * @return {Promise<boolean>} Returns true on success, false on failure. Throws an error if something else was wrong.
     */
    async login(email, password) {
        if (!(email.length > 0 && password.length > 0))
            return false;


        try {
            let value = await fetchApi("/api/user/login", undefined, {
                method: "POST",
                headers: {
                    Accept: "*/*",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    pwd: password
                })
            })

            if (value?.success) {
                this.isLoggedIn.value = true;
                return true
            }
        } catch (reason) {
            if (reason instanceof ApiError) {
                if (reason.code === 401) {
                    this.isLoggedIn.value = false;
                    await this.logout()
                    return false
                }

                throw reason
            } else {
                throw reason
            }
        }
    }

    /**
     * Logs the user out
     * @return {Promise<void>}
     */
    async logout() {
        let data = await fetchApi("/api/user/logout", undefined, {
            method: "DELETE",
            headers: {
                Accept: "*/*",
                "Content-Type": "application/json"
            }
        })
        console.log("LOGGED OUT")
        await this.AskLoggedIn()
        return null;
    }

    /**
     * Asks the server if the user is logged in
     * @return {Promise<boolean>}
     */
    async AskLoggedIn() {
        this.isLoggedIn.value = (await fetchApi("/api/user/test")).isLoggedIn
        return this.isLoggedIn.value;
    }

    /**
     * Gets the user's info
     * @return {Promise<{username:string,email:string,date_created:string,user_id:number}|null>}
     */
    async GetUserInfo() {
        let data;
        try {

            data = await fetchApi("/api/user/info", undefined, {
                credentials: "same-origin",
                mode: "no-cors",
            })
        } catch (e) {
            console.log(e)
            return null
        }
        return data
    }


}


export default new AuthManager()
