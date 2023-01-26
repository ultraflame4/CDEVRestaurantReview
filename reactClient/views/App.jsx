import HeaderNav from "@/components/HeaderNav/HeaderNav";
import {Outlet, ScrollRestoration} from "react-router-dom";
import "./App.css"
import {Suspense, useEffect, useState} from "react";
import {UserAccountContext, UserAccountContextObj} from "@/tools/contexts";
import authManager from "@/core/authManager";
import NiceModal from "@ebay/nice-modal-react";


export default function App() {
    const [currentUser, setCurrentUser] = useState(null)
    useEffect(() => {

        authManager.isLoggedIn.watch(async () => {
            let user = await authManager.GetUserInfo()
            if (user) {
                setCurrentUser(new UserAccountContextObj(user.user_id, user.username, user.email, user.date_created))
            } else {
                setCurrentUser(null)
            }
        })

        authManager.AskLoggedIn()

    }, [authManager])
    return (
        <UserAccountContext.Provider value={currentUser}>
            <HeaderNav/>
            <Suspense fallback={(<div>Loading page...</div>)}>
                <Outlet/>
            </Suspense>

        </UserAccountContext.Provider>
    )
}

