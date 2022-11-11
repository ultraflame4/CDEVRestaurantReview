import {defComponent} from "@/tools/define";
import classes from "./HeaderNav.module.css";
import {Icon} from "@iconify-icon/react";
import {IconLink} from "@/components/Links/IconLink";
import {useContext} from "react";
import {UserInfoContext} from "@/api";
import PropTypes from "prop-types";
import {useToggle} from "@/tools/hooks";


const HeaderNavAccount_UserMenu = (props) => {

    return (
        <div className={classes.HeaderNavAccountMenu}>

        </div>
    )
}


const HeaderNavAccount_GuestMenu = (props) => {

    return (
        <div className={classes.HeaderNavAccountMenu}>

        </div>
    )
}

const HeaderNavAccount = (props) => {
    const userInfo = useContext(UserInfoContext);
    const listener = useToggle()

    return (
        <div className={classes.HeaderNavAccount} data-loggedin={(userInfo != null).toString()}>
            <a onClick={listener}>
                <Icon icon={"ic:account-circle"}/>
            </a>
            <span></span>

            {userInfo == null ? <HeaderNavAccount_GuestMenu/> : <HeaderNavAccount_UserMenu/>}

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
