import {UserInfoContext} from "@/api";
import HeaderNav from "@/components/HeaderNav/HeaderNav";
import {Outlet} from "react-router-dom";
import "./App.css"

export default function App() {

    return (
        <UserInfoContext.Provider value={null}>
            <HeaderNav/>
            <Outlet/>
        </UserInfoContext.Provider>
    )
}

