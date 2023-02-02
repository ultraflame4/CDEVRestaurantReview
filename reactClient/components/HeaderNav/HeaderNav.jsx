import {defComponent} from "@/tools/define";
import classes from "./HeaderNav.module.css";
import {Icon} from "@iconify-icon/react";
import {IconLink} from "@/components/Links/IconLink";
import {useContext, useRef, useState} from "react";
import PropTypes from "prop-types";
import {useOverlayToggle} from "@/tools/hooks";

import {UserAccountContext} from "@/tools/contexts";

import {SignInModal, SignUpModal} from "@/components/HeaderNav/AccountModals";
import {showModal} from "@/components/Modal/modalsManager";
import authManager from "@/core/authManager";


// Menu to show when the user is logged in
const HeaderNavAccount_LoggedInMenu = (props) => {
    return (
        <>
            <IconLink to={"/profile/reviews"} text={"My Reviews"} icon={"material-symbols:chat"}/>
            <IconLink to={"/profile/settings"} text={"Settings"} icon={"material-symbols:settings"}/>
            <br/>
            <br/>
            <button type={"button"} className={"btn-danger"} onClick={()=>authManager.logout()  }>Sign Out</button>
        </>
    )
}

// Menu to show when the user is not logged in
const HeaderNavAccount_GuestMenu = (props) => {
    return (
        <>
            <button type={"button"} className={"btn-primary"} onClick={() => showModal("signin")}>Sign in</button>
            <h6 className={"color-lightg no-margin text-center"}>or</h6>
            <button type={"button"} className={"btn-secondary"} onClick={() => showModal("signup")}>Sign up</button>
        </>
    )
}

const HeaderNavAccount = (props) => {
    const currentUser = useContext(UserAccountContext);
    // Reference to the account icon which on clicked will toggle the account menu
    const accIconRef = useRef(null);
    // Reference account menu which will open when the account icon is clicked
    const menuRef = useOverlayToggle(accIconRef);

    // Check if the user is logged in. If the user is logged in, currentUser will be an object. If the user is not logged in, currentUser will be null
    let isLoggedIn = currentUser !== null;


    return (
        <div className={classes.HeaderNavAccount} data-loggedin={(isLoggedIn).toString()} ref={menuRef}>
            <SignInModal/>
            <SignUpModal/>

            <div className={classes.HeaderNavAccountIconBorder}></div>
            <a ref={accIconRef}>
                <Icon icon={"ic:account-circle"} className={classes.HeaderNavAccountIcon}/>
            </a>
            <div className={classes.HeaderNavAccountMenu} data-loggedin={isLoggedIn}>
                <h6 className={classes.HeaderNavAccountMenu_username}>{currentUser?.username ?? "Guest User"}</h6>
                {
                    isLoggedIn ? // If the user is logged in, show the logged in menu. Else, show the guest menu
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
