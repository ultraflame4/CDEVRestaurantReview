import {WModal} from "@/components/Modal/WModal";
import {useEffect, useRef, useState} from "react";
import authManager from "@/core/authManager";
import {useModal} from "@ebay/nice-modal-react/lib/cjs";
import NiceModal from "@ebay/nice-modal-react";
import PropTypes from "prop-types";
import {WatchableValue} from "@/tools/utils";


export function SignInModal(props) {
    const inpEmailRef = useRef(null);
    const inpPwdRef = useRef(null);

    async function signIn() {
        let s = await authManager.login(inpEmailRef.current.value, inpPwdRef.current.value)
        if (s){
            closeModal("signin")
        }

    }

    return (
        <WModal
            isOpen={props.currentModal === "signin"}
            onClose={() => closeModal("signin")}
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

SignInModal.propTypes = {
    currentModal: PropTypes.object.isRequired,
}
export function SignUpModal(props) {


    return (
        <WModal
            isOpen={props.currentModal === "signup"}
            onClose={() => closeModal("signup")}
            title={"Sign Up"}>
            <h1>Sign up</h1>
        </WModal>
    )
}

SignUpModal.propTypes = {
    currentModal: PropTypes.object.isRequired,
}


const currentGlobalModal = new WatchableValue(null)

export function showModal(modalId) {
    currentGlobalModal.value = modalId
}

export function closeModal(modalId) {
    if (currentGlobalModal.value === modalId){
        currentGlobalModal.value = null
    }
}

export default function AllModals(props) {
    const [currentModal, setCurrentModal] = useState(null)

    useEffect(()=>{
        currentGlobalModal.watch(() => {
            console.log("TEST")
            setCurrentModal(currentGlobalModal.value)
        })
    },[currentGlobalModal])


    return <>
        <SignInModal currentModal={currentModal} />
        <SignUpModal currentModal={currentModal} />
    </>
}
