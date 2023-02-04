import React from 'react'
import ReactDOM from 'react-dom/client'
import Modal from 'react-modal';

import './index.css'
import {createBrowserRouter, RouterProvider, Route} from "react-router-dom";

import App from "@/views/App";

import {NearestSort, TopRatedSort} from "@/views/Search/DefaultSort"; // Cannot lazy load these because they are both in the same file.


const Home = React.lazy(() => import("@/views/Home/Home"))
const RestaurantDetails = React.lazy(() => import("@/views/RestaurantDetails/RestaurantDetails"))
const SearchResults = React.lazy(() => import("@/views/Search/SearchResults"))
const UserProfile = React.lazy(() => import("@/views/Profile/UserProfile"))
const UserProfile_Settings  = React.lazy(() => import("@/views/Profile/UserProfile_Settings"))
const UserProfile_Reviews = React.lazy(() => import("@/views/Profile/UserProfile_Reviews"))

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
                },                {
                    path: "/nearest/",
                    element: <NearestSort/>,
                },                {
                    path: "/top/",
                    element: <TopRatedSort/>,
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
