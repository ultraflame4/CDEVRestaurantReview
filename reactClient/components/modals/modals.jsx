import {WModal} from "@/components/Modal/WModal";
import {useRef} from "react";
import authManager from "@/core/authManager";
import {useModal} from "@ebay/nice-modal-react/lib/cjs";
import NiceModal from "@ebay/nice-modal-react";
import PropTypes from "prop-types";


export function SignInModal(props) {
    const inpEmailRef = useRef(null);
    const inpPwdRef = useRef(null);

    function signIn() {
        authManager.login(inpEmailRef.current.value, inpPwdRef.current.value)
    }

    return (
        <WModal
            isOpen={props.isOpen}
            onClose={props.onClose}
            title={"Sign In"}
            icon={"material-symbols:login"}>

            <input placeholder={"Account Email"} type={"email"} ref={inpEmailRef}/>
            <input placeholder={"Password"} type={"password"} ref={inpPwdRef}/>
            <p className={"full-width"}>New here? <a style={{color:"var(--gold)"}} onClick={props.onCreateAccountRedirect}>Create Account</a></p>
            <p className={"full-width"}><a style={{color:"var(--red)"}}>Forget password</a></p>
            <button onClick={signIn}>Sign in</button>
        </WModal>
    )
}

SignInModal.propTypes = {
    onClose: PropTypes.func,
    onCreateAccountRedirect: PropTypes.func,
    isOpen: PropTypes.bool.isRequired,
}
export function SignUpModal(props) {


    return (
        <WModal
            isOpen={props.isOpen}
            onClose={props.onClose}
            title={"Sign Up"}>
            <h1>Sign up</h1>
        </WModal>
    )
}

SignUpModal.propTypes = {
    onClose: PropTypes.func,
    isOpen: PropTypes.bool.isRequired,
}
