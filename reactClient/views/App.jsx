import HeaderNav from "@/components/HeaderNav/HeaderNav";
import {Outlet} from "react-router-dom";
import "./App.css"
import {useEffect} from "react";
let a = {
    username: "test",
    email: "d"
}

export default function App() {
    useEffect(()=>{
        setTimeout(()=>{

            a=null
            console.log("tset")
        },5000)
    },[0])
    return (
        <>
            <HeaderNav/>
            <Outlet/>
        </>
    )
}

