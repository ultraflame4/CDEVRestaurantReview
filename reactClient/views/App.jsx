import HeaderNav from "@/components/HeaderNav/HeaderNav";
import {Outlet, ScrollRestoration} from "react-router-dom";
import "./App.css"
import {Suspense, useEffect, useState} from "react";
import {UserAccountContext} from "@/tools/contexts";



export default function App() {
    const [currentUser, setCurrentUser] = useState(null)

    return (
        <UserAccountContext.Provider value={currentUser}>
            <HeaderNav/>
            <Suspense fallback={(<div>Loading page...</div>)}>
                <Outlet/>
            </Suspense>
        </UserAccountContext.Provider>
    )
}

