import {WModal} from "@/components/Modal/WModal";
import {useEffect, useRef, useState} from "react";
import authManager from "@/core/authManager";
import PropTypes from "prop-types";
import {closeModal, showModal} from "@/components/Modal/modalsManager";
import {CreateAccount} from "@/core/api";

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
            <br/>
            <button onClick={signIn}>Sign in</button>
        </WModal>
    )
}

// Modal for sign up. Work in progress....
export function SignUpModal(props) {
    // Reference to the email and password inputs
    const inpEmailRef = useRef(null);
    const inpPwdRef = useRef(null);
    const inpPwdConfirmRef = useRef(null);
    const inpUsernameRef = useRef(null);

    async function signUp() {
        if (inpPwdRef.current.value !== inpPwdConfirmRef.current.value){
            alert("Passwords do not match!")
            return
        }

        if (inpPwdRef.current.value.length < 8){
            alert("Password must be at least 8 characters long!")
            return
        }

        if (inpUsernameRef.current.value.length < 3){
            alert("Username must be at least 3 characters long!")
            return
        }

        try{
            let data = await CreateAccount(inpUsernameRef.current.value, inpEmailRef.current.value, inpPwdRef.current.value)
            if (!data?.success){
                alert("Email already in use!")
                return
            }
            closeModal("signup")
            showModal("signin")
            return
        }
        catch (e){
            alert("Error creating account!")
            console.error(e)
            return
        }


    }
    return (
        <WModal
            modalId={"signup"}
            title={"Sign Up"}>

            <input placeholder={"Username"} ref={inpUsernameRef}/>
            <input placeholder={"Email"} type={"email"} ref={inpEmailRef}/>
            <input placeholder={"Password"} type={"password"} ref={inpPwdRef}/>
            <input placeholder={"Confirm password"} type={"password"} ref={inpPwdConfirmRef}/>
            <br/>
            <button onClick={signUp}>Sign Up</button>
        </WModal>
    )
}
