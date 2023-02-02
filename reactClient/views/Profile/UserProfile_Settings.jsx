import classes from "./Settings.module.css";
import {useContext} from "react";
import {UserAccountContext} from "@/tools/contexts";
import {Icon} from "@iconify-icon/react";

export default function UserProfile_Settings() {
    const currentUser = useContext(UserAccountContext);
    return (<main className={classes.main}>
        <div>
            <h2>Username :</h2><p>{currentUser?.username}</p>
        </div>
        <button>Edit Username <Icon icon={"ic:baseline-edit"}/></button>
        <div>
            <h2>Email :</h2><p>{currentUser?.email}</p>
        </div>
        <button>Change Email <Icon icon={"ic:baseline-edit"}/></button>
        <div>
            <h2>Password</h2>
        </div>
        <button>Update Password <Icon icon={"ic:baseline-edit"}/></button>
    </main>)
}
