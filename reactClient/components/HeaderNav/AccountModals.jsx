import {WModal} from "@/components/Modal/WModal";
import {useEffect, useRef, useState} from "react";
import authManager from "@/core/authManager";
import PropTypes from "prop-types";
import {closeModal, showModal} from "@/components/Modal/modalsManager";

// Modal for sign in
export function SignInModal(props) {
    // Reference to the email and password inputs
    const inpEmailRef = useRef(null);
    const inpPwdRef = useRef(null);

    async function signIn() {
        // Log in using the authManager using the email and password from the email and password inputs
        let success = await authManager.login(inpEmailRef.current.value, inpPwdRef.current.value)
        // On success, close the modal
        if (success){
            closeModal("signin")
        }
        else{
            // Else tell the user that the login failed
            alert("Login unsuccessful. Please try again.")
        }
    }

    return (
        <WModal
            modalId={"signin"}
            title={"Sign In"}
            icon={"material-symbols:login"}>

            <input placeholder={"Account Email"} type={"email"} ref={inpEmailRef}/>
            <input placeholder={"Password"} type={"password"} ref={inpPwdRef}/>
            <p className={"full-width"}>New here? <a style={{color:"var(--gold)"}} onClick={()=>showModal("signup")}>Create Account</a></p>
            <p className={"full-width"}><a style={{color:"var(--red)"}}>Forget password</a></p>
            <button onClick={signIn}>Sign in</button>
        </WModal>
    )
}

// Modal for sign up. Work in progress....
export function SignUpModal(props) {

    return (
        <WModal
            modalId={"signup"}
            title={"Sign Up"}>
            <h1>Sign up (WIP)</h1>
        </WModal>
    )
}