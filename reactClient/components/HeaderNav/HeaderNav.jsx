import {defComponent} from "@/tools/define";
import classes from "./HeaderNav.module.css";
import {Icon} from "@iconify-icon/react";
import {IconLink} from "@/components/Links/IconLink";
import {useContext, useRef} from "react";
import PropTypes from "prop-types";
import {useFocusedToggle, useToggle} from "@/tools/hooks";




const HeaderNavAccount_Menu = (props) => {

    return (
        <>

        </>
    )
}

HeaderNavAccount_Menu.propTypes={
    username: PropTypes.string,
}

const HeaderNavAccount = (props) => {
    const userInfo = null;
    const accIconRef = useRef(null);
    /**
     * @type {MutableRefObject<HTMLDivElement | null>}
     */
    const menuRef = useFocusedToggle(accIconRef);


    return (
        <div className={classes.HeaderNavAccount} data-loggedin={(userInfo != null).toString()} ref={menuRef}>
            <div className={classes.HeaderNavAccountIconBorder}></div>
            <a ref={accIconRef}>
                <Icon icon={"ic:account-circle"} className={classes.HeaderNavAccountIcon}/>
            </a>
            <div className={classes.HeaderNavAccountMenu}>
                {userInfo?.username??"Guest"}
                <HeaderNavAccount_Menu/>
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
