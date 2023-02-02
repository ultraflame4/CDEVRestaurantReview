import {WModal} from "@/components/Modal/WModal";
import {useContext, useEffect, useRef} from "react";
import {UserAccountContext} from "@/tools/contexts";
import {UpdateEmail, UpdatePassword, UpdateUsername} from "@/core/api";
import {closeModal} from "@/components/Modal/modalsManager";

export function EditUsernameModal() {
    const usernameRef = useRef(null)
    const passwdRef = useRef(null)
    const currentUser = useContext(UserAccountContext);

    function onModalLoad() {
        usernameRef.current.value = currentUser?.username
    }

    function saveUsername() {
        UpdateUsername(usernameRef.current.value, passwdRef.current.value)
            .then(value => {
                window.location.reload()
                alert("Username updated successfully!")
            })
            .catch(err => {
                if (err.code === 401) {
                    alert("Wrong password!")
                } else {
                    alert("Something went wrong! Please try again later.")
                }
            })
    }

    return (
        <WModal
            icon={"material-symbols:drive-file-rename-outline"}
            modalId={"edit-username"}
            title={"Edit Username"}
            onAfterOpen={onModalLoad}
        >
            <input placeholder={"New Username"} ref={usernameRef}/>
            <input placeholder={"Password"} ref={passwdRef}/>
            <br/>
            <button onClick={saveUsername}>Save</button>
        </WModal>
    )
}

export function ChangeEmailModal() {
    const emailRef = useRef(null)
    const passwdRef = useRef(null)
    const currentUser = useContext(UserAccountContext);

    function onModalLoad() {
        emailRef.current.value = currentUser?.email
    }

    function saveEmail() {
        UpdateEmail(emailRef.current.value, passwdRef.current.value)
            .then(value => {
                window.location.reload()
                alert("Email updated successfully!")
            })
            .catch(err => {
                if (err.code === 401) {
                    alert("Wrong password!")
                } else {
                    alert("Something went wrong! Please try again later.")
                }
            })
    }

    return (
        <WModal icon={"mdi:email-edit"} modalId={"change-email"} title={"Change Email"} onAfterOpen={onModalLoad}>
            <input placeholder={"New Email"} ref={emailRef}/>
            <input placeholder={"Password"} ref={passwdRef}/>
            <br/>
            <button onClick={saveEmail}>Change</button>
        </WModal>
    )
}

export function UpdatePasswordModal() {
    const newPasswdRef = useRef(null)
    const passwdRef = useRef(null)

    function savePassword() {
        UpdatePassword(newPasswdRef.current.value, passwdRef.current.value)
            .then(value => {
                window.location.reload()
                alert("Password updated successfully!")
            })
            .catch(err => {
                if (err.code === 401) {
                    alert("Wrong password!")
                } else {
                    alert("Something went wrong! Please try again later.")
                }
            })
    }

    return (
        <WModal icon={"mdi:form-textbox-password"} modalId={"update-password"} title={"Update Password"} >
            <input placeholder={"New Password"} ref={newPasswdRef}/>
            <input placeholder={"Current Password"} ref={passwdRef}/>
            <br/>
            <button onClick={savePassword}>Update</button>
        </WModal>
    )
}
