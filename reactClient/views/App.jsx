import {UserLoggedInContext} from "@/api";
import HeaderNav from "@/components/HeaderNav/HeaderNav";
import {Outlet} from "react-router-dom";
import "./App.css"

export default function App() {

    return (
        <UserLoggedInContext.Provider value={false}>
            <HeaderNav/>
            <Outlet/>
        </UserLoggedInContext.Provider>
    )
}

