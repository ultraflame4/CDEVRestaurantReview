import React from "react";

class UserAccountContextObj{

    /**
     *
     * @param userid {number}
     * @param username {string}
     * @param date_created {string}
     */
    constructor(userid, username, date_created){
        this._userId = userid;
        this._username = username;
        this._date_created = new Date(date_created);
    }

    get userId() {
        return this._userId;
    }

    get username() {
        return this._username;
    }

    get date_created() {
        return this._date_created;
    }
}
export const UserAccountContext = React.createContext(null);
