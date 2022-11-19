import HeaderNav from "@/components/HeaderNav/HeaderNav";
import {Outlet} from "react-router-dom";
import "./App.css"
import {useEffect} from "react";
import {UserAccountInfo} from "@/api";


export default function App() {

    return (
        <>
            <HeaderNav/>
            <Outlet/>
        </>
    )
}

