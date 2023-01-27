import {WModal} from "@/components/Modal/WModal";
import {useEffect, useRef, useState} from "react";
import authManager from "@/core/authManager";
import PropTypes from "prop-types";
import {showModal} from "@/components/Modal/modalsManager";


export function SignInModal(props) {
    const inpEmailRef = useRef(null);
    const inpPwdRef = useRef(null);

    async function signIn() {
        let s = await authManager.login(inpEmailRef.current.value, inpPwdRef.current.value)
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

export function SignUpModal(props) {

    return (
        <WModal
            modalId={"signup"}
            title={"Sign Up"}>
            <h1>Sign up</h1>
        </WModal>
    )
}
