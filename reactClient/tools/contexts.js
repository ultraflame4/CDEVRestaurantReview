import React from "react";

export class UserAccountContextObj{


    /**
     *
     * @param userid {number}
     * @param username {string}
     * @param email {string}
     * @param date_created {string}
     */
    constructor(userid, username, email, date_created) {
        this._userId = userid;
        this._username = username;
        this._email = email;
        this._date_created = new Date(date_created);
    }

    get userId() {
        return this._userId;
    }

    get username() {
        return this._username;
    }
    get email() {
        return this._email;
    }
    get date_created() {
        return this._date_created;
    }
}
export const UserAccountContext = React.createContext(null);
