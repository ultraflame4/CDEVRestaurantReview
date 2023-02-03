import React from 'react'
import ReactDOM from 'react-dom/client'
import Modal from 'react-modal';

import './index.css'
import {createBrowserRouter, RouterProvider, Route} from "react-router-dom";

import App from "@/views/App";
import {SignInModal, SignUpModal} from "@/components/HeaderNav/AccountModals";
import UserProfile from "@/views/Profile/UserProfile";
import UserProfile_Settings from "@/views/Profile/UserProfile_Settings";
import UserProfile_Reviews from "@/views/Profile/UserProfile_Reviews";
import SearchResults from "@/views/Search/SearchResults";

const Home = React.lazy(() => import("@/views/Home/Home"))
const RestaurantDetails = React.lazy(() => import("@/views/RestaurantDetails/RestaurantDetails"))

const router = createBrowserRouter([
        {
            path: "/",
            element: <App/>,
            children: [
                {
                    path: "/",
                    element: <Home/>
                },
                {
                    path: "/restaurant/:id",
                    element: <RestaurantDetails/>,
                },
                {
                    path: "/search/",
                    element: <SearchResults/>,
                },
                {
                    path: "/profile/",
                    element: <UserProfile/>,
                    children: [
                        {
                            path: "settings",
                            element: <UserProfile_Settings/>
                        },
                        {
                            path: "reviews",
                            element: <UserProfile_Reviews/>
                        }
                    ]
                }
            ]
        },
    ],
    {
        basename: import.meta.env.BASE_URL // Set base path so that react router is not confused.
    }
);

Modal.setAppElement('#root')

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
)
