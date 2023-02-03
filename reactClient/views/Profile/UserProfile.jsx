
import {UserAccountContext} from "@/tools/contexts";
import {matchPath, Outlet, useMatch, useNavigate} from "react-router-dom";
import React, {Suspense, useContext, useEffect} from "react";
import classes from "./UserProfile.module.css";
import {Icon} from "@iconify-icon/react";
import {IconLink} from "@/components/Links/IconLink";

export default function UserProfile() {
    const currentUser = useContext(UserAccountContext);
    const settingsActive = useMatch("/profile/settings/*") !==null
    const reviewsActive = useMatch("/profile/reviews/*") !==null
    const navigate = useNavigate()
    console.log(settingsActive, reviewsActive)
    useEffect(() => {
        if (currentUser === null){
            navigate("/")
        }
    },[currentUser])
    return (
        <div className={classes.UserProfile}>
            <aside>
                <div className={classes.UserDetails}>
                    <Icon icon={"ic:baseline-account-circle"} className={classes.icon}/>
                    <h4>{currentUser?.username}</h4>
                    <h5>
                        {currentUser?.email}
                    </h5>
                </div>
                <ul>
                    <li data-active={settingsActive}>
                        <IconLink to={"settings"} text={"Settings"} icon={"material-symbols:settings"}/>
                    </li>
                    <li data-active={reviewsActive}>
                        <IconLink to={"reviews"} text={"My Reviews"} icon={"material-symbols:chat"}/>
                    </li>
                </ul>
            </aside>
            <Suspense fallback={(<div>Loading page...</div>)}>
                <Outlet/>
            </Suspense>
        </div>

    )
}
