import {WModal} from "@/components/Modal/WModal";

export function EditUsernameModal() {
    return (
        <WModal icon={"material-symbols:drive-file-rename-outline"} modalId={"edit-username"} title={"Edit Username"}>

        </WModal>
    )
}
export function ChangeEmailModal() {
    return (
        <WModal icon={"mdi:email-edit"} modalId={"change-email"} title={"Change Password"}>

        </WModal>
    )
}
export function UpdatePasswordModal() {
    return (
        <WModal icon={"mdi:form-textbox-password"} modalId={"update-password"} title={"Update Password"}>

        </WModal>
    )
}
