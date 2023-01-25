import HeaderNav from "@/components/HeaderNav/HeaderNav";
import {Outlet, ScrollRestoration} from "react-router-dom";
import "./App.css"
import {Suspense, useEffect} from "react";
import {UserAccountInfo} from "@/api";


export default function App() {

    return (
        <>
            <HeaderNav/>
            <Suspense fallback={(<div>Loading page...</div>)}>
                <Outlet/>
            </Suspense>
        </>
    )
}

