import classes from "./Settings.module.css";
import {useContext} from "react";
import {UserAccountContext} from "@/tools/contexts";
import {Icon} from "@iconify-icon/react";
import {ChangeEmailModal, EditUsernameModal, UpdatePasswordModal} from "@/views/Profile/UpdateAccountModals";
import {showModal} from "@/components/Modal/modalsManager";

export default function UserProfile_Settings() {
    const currentUser = useContext(UserAccountContext);


    return (<main className={classes.main}>

        <EditUsernameModal/>
        <ChangeEmailModal/>
        <UpdatePasswordModal/>

        <div>
            <h2>Username :</h2><p>{currentUser?.username}</p>
        </div>
        <button onClick={()=>showModal("edit-username")}>Edit Username <Icon icon={"ic:baseline-edit"}/></button>
        <div>
            <h2>Email :</h2><p>{currentUser?.email}</p>
        </div>
        <button onClick={()=>showModal("change-email")}>Change Email <Icon icon={"ic:baseline-edit"}/></button>
        <div>
            <h2>Password : </h2><p>{new Array(16).fill("█")}</p>
        </div>
        <button onClick={()=>showModal("update-password")}>Update Password <Icon icon={"ic:baseline-edit"}/></button>
    </main>)
}
