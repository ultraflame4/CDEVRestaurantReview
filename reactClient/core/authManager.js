import {ApiError, fetchApi} from "@/core/api";
import {WatchableValue} from "@/tools/utils";


class AuthManager {

    constructor() {
        // This is a watchable value, which means that if you change it, it will notify all the listeners attached to it
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
            // Call the api to login
            let value = await fetchApi("/api/user/login", undefined, {
                method: "POST",
                headers: {
                    Accept: "*/*",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ // Send the email and password
                    email: email,
                    pwd: password
                })
            })
            // If the login was successful, set the isLoggedIn value to true
            if (value?.success) {
                this.isLoggedIn.value = true;
                return true
            }

        } catch (reason) {
            // If there was an error while calling the api...

            // If the error was an ApiError, and the error code was 401, then the login failed
            if (reason instanceof ApiError) {
                // Logout internally
                if (reason.code === 401) {
                    this.isLoggedIn.value = false;
                    await this.logout()
                    return false
                }

                throw reason
            } else {
                // Else unknown error
                throw reason
            }
        }
    }

    /**
     * Logs the user out
     * @return {Promise<void>}
     */
    async logout() {
        // Call api to logout
        let data = await fetchApi("/api/user/logout", undefined, {
            method: "DELETE",
            headers: {
                Accept: "*/*",
                "Content-Type": "application/json"
            }
        })
        console.log("LOGGED OUT")
        // ReAsk the server if the user is logged in.
        await this.AskLoggedIn()
        return null;
    }

    /**
     * Asks the server if the user is logged in
     * @return {Promise<boolean>}
     */
    async AskLoggedIn() {
        // Call the api to ask if the user is logged in and set the isLoggedIn value to the result
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
            // Try calling the api to get the user's info
            data = await fetchApi("/api/user/info", undefined, {
                credentials: "same-origin",
                mode: "no-cors",
            })
        } catch (e) {
            // If there was an error, return null
            console.log(e)
            return null
        }
        return data
    }


}


export default new AuthManager()
