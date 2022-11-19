import {defComponent} from "@/tools/define";
import classes from "./HeaderNav.module.css";
import {Icon} from "@iconify-icon/react";
import {IconLink} from "@/components/Links/IconLink";
import {useContext, useRef} from "react";
import PropTypes from "prop-types";
import {useFocusedToggle, useToggle, useWatchableValue} from "@/tools/hooks";
import {UserAccountInfo} from "@/api";



const HeaderNavAccount_LoggedInMenu = (props) => {
    return (
        <>

        </>
    )
}

const HeaderNavAccount_GuestMenu = (props) => {
    return (
        <>
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
    const menuRef = useFocusedToggle(accIconRef);


    return (
        <div className={classes.HeaderNavAccount} data-loggedin={(username != null).toString()} ref={menuRef}>
            <div className={classes.HeaderNavAccountIconBorder}></div>
            <a ref={accIconRef}>
                <Icon icon={"ic:account-circle"} className={classes.HeaderNavAccountIcon}/>
            </a>
            <div className={classes.HeaderNavAccountMenu}>
                <h6 className={classes.HeaderNavAccountMenu_username}>{username??"Guest"}</h6>
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
    return (
        <header className={classes.HeaderNav}>
            <div className={classes.HeaderNavTitle}>
                <h1>Restau<sub>Rants</sub></h1>
            </div>
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
        </header>
    )
})
