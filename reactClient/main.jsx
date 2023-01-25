import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider, Route} from "react-router-dom";

import App from "@/views/App";

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
                    loader: async ({params})=>params.id
                }
            ]
        },
    ],
    {
        basename: import.meta.env.BASE_URL // Set base path so that react router is not confused.
    }
);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
)
