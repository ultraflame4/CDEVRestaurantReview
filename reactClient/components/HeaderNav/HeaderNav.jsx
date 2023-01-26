import {defComponent} from "@/tools/define";
import classes from "./HeaderNav.module.css";
import {Icon} from "@iconify-icon/react";
import {IconLink} from "@/components/Links/IconLink";
import {useContext, useRef, useState} from "react";
import PropTypes from "prop-types";
import {useOverlayToggle} from "@/tools/hooks";

import {UserAccountContext} from "@/tools/contexts";
import authManager from "@/core/authManager";
import NiceModal from "@ebay/nice-modal-react";
import {SignInModal, SignUpModal} from "@/components/modals/modals";
import {WModal} from "@/components/Modal/WModal";


const HeaderNavAccount_LoggedInMenu = (props) => {
    return (
        <>

        </>
    )
}

const HeaderNavAccount_GuestMenu = (props) => {
    const [currentModal, setModal] = useState(-1) // -1 is none, 0 is login, 1 is signup
    const inpEmailRef = useRef(null);
    const inpPwdRef = useRef(null);
    function closeModal() {
        setModal(-1);
    }

    function signIn() {
        authManager.login(inpEmailRef.current.value, inpPwdRef.current.value)
    }


    return (
        <>
            <button type={"button"} className={"btn-primary"} onClick={() => setModal(0)}>Sign in</button>
            <h6 className={"color-lightg no-margin text-center"}>or</h6>
            <button type={"button"} className={"btn-secondary"} onClick={() => setModal(1)}>Sign up</button>
            <SignInModal isOpen={currentModal===0} onClose={closeModal} onCreateAccountRedirect={()=>setModal(1)}/>
            <SignUpModal isOpen={currentModal===1} onClose={closeModal}/>
        </>
    )
}

HeaderNavAccount_GuestMenu.propTypes = {
    username: PropTypes.string,
}

const HeaderNavAccount = (props) => {
    const currentUser = useContext(UserAccountContext);
    const accIconRef = useRef(null);
    /**
     * @type {MutableRefObject<HTMLDivElement | null>}
     */
    const menuRef = useOverlayToggle(accIconRef);
    let isLoggedIn = currentUser !== null;


    return (
        <div className={classes.HeaderNavAccount} data-loggedin={(isLoggedIn).toString()} ref={menuRef}>
            <div className={classes.HeaderNavAccountIconBorder}></div>
            <a ref={accIconRef}>
                <Icon icon={"ic:account-circle"} className={classes.HeaderNavAccountIcon}/>
            </a>
            <div className={classes.HeaderNavAccountMenu}>
                <h6 className={classes.HeaderNavAccountMenu_username}>{currentUser?.username ?? "Guest User"}</h6>
                {
                    isLoggedIn ?
                        <HeaderNavAccount_LoggedInMenu/>:
                        <HeaderNavAccount_GuestMenu/>

                }
            </div>


        </div>
    )
}


export default defComponent((props) => {
    const [hamburgerToggled, setHamburgerToggled] = useState(false)

    function toggleHamburger() {
        setHamburgerToggled(prevState => !prevState)
    }


    return (
        <header className={classes.HeaderNav}>
            <a href={"/"} className={classes.HeaderNavTitle}>
                <h1>Restau<sub>Rants</sub></h1>
            </a>
            <div className={classes.HeaderNavSearch}>
                <Icon icon={"ic:outline-search"} className={classes.SearchIcon}/>
                <div className={classes.SearchInput}>
                    <input type={"text"} placeholder={"Search Restaurants, Food, Locations and Tags."}/>
                    <span className={classes.SearchInputUnderline}></span>
                </div>
            </div>
            <ul className={classes.HeaderNavLinks}>
                <li>
                    <IconLink to={"/search?sort=0"} text={"Nearby"} icon={"oi:map-marker"}/>
                </li>
                <li>
                    <IconLink to={"/search?sort=1"} text={"Top Rated"} icon={"ic:stars"}/>
                </li>
            </ul>
            <HeaderNavAccount/>

            <div className={classes.HeaderHamburger} data-toggled={hamburgerToggled}>
                <Icon icon={"ph:hamburger"} className={classes.HeaderHamburgerIcon} onClick={toggleHamburger}/>
                <div className={classes.HeaderHamburgerContent}>
                    <ul className={classes.HeaderNavLinks}>
                        <li>
                            <IconLink to={"/search?sort=0"} text={"Nearby"} icon={"oi:map-marker"}/>
                        </li>
                        <li>
                            <IconLink to={"/search?sort=1"} text={"Top Rated"} icon={"ic:stars"}/>
                        </li>
                    </ul>
                </div>
            </div>

        </header>
    )
})
