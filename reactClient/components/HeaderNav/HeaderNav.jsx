import {defComponent} from "@/tools/define";
import classes from "./HeaderNav.module.css";
import {Icon} from "@iconify-icon/react";
import {IconLink} from "@/components/Links/IconLink";
import {useContext, useRef, useState} from "react";
import PropTypes from "prop-types";
import {useOverlayToggle, useToggle, useWatchableValue} from "@/tools/hooks";
import {UserAccountInfo} from "@/api";
import Modal from "react-modal";
import {WModal} from "@/components/Modal/WModal";


const HeaderNavAccount_LoggedInMenu = (props) => {
    return (
        <>

        </>
    )
}

const HeaderNavAccount_GuestMenu = (props) => {
    const [currentModal,setModal] = useState(-1) // -1 is none, 0 is login, 1 is signup

    function closeModal() {
        setModal(-1);
    }


    return (
        <>
            <button type={"button"} className={"btn-primary"} onClick={()=>setModal(0)}>Sign in</button>
            <h6 className={"color-lightg no-margin text-center"}>or</h6>
            <button type={"button"} className={"btn-secondary"} onClick={()=>setModal(1)}>Sign up</button>
            <WModal isOpen={currentModal===0} onRequestClose={closeModal}>
                <h1>Login</h1>
            </WModal>
            <WModal isOpen={currentModal===1} onRequestClose={closeModal}>
                <h1>Sign Up</h1>
            </WModal>
        </>
    )
}

HeaderNavAccount_GuestMenu.propTypes={
    username: PropTypes.string,
}

const HeaderNavAccount = (props) => {
    const username = useWatchableValue(UserAccountInfo.username);

    const accIconRef = useRef(null);
    /**
     * @type {MutableRefObject<HTMLDivElement | null>}
     */
    const menuRef = useOverlayToggle(accIconRef);



    return (
        <div className={classes.HeaderNavAccount} data-loggedin={(username != null).toString()} ref={menuRef}>
            <div className={classes.HeaderNavAccountIconBorder}></div>
            <a ref={accIconRef}>
                <Icon icon={"ic:account-circle"} className={classes.HeaderNavAccountIcon}/>
            </a>
            <div className={classes.HeaderNavAccountMenu}>
                <h6 className={classes.HeaderNavAccountMenu_username}>{username??"Guest User"}</h6>
                {
                    username==null?
                        <HeaderNavAccount_GuestMenu/>:
                        <HeaderNavAccount_LoggedInMenu/>
                }
            </div>


        </div>
    )
}


export default defComponent((props) => {
    const [hamburgerToggled, setHamburgerToggled] = useState(false)
    function toggleHamburger(){
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

            <div className={classes.HeaderHamburger} data-toggled={hamburgerToggled} >
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
