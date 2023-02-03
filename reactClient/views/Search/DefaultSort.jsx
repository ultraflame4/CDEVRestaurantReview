import {useSearchParams} from "react-router-dom";
import classes from "@/views/Search/SearchPage.module.css";
import {RestaurantList} from "@/components/Restaurant/RestaurantList";
import {useEffect} from "react";

/**
 * A page with a list of restaurants sorted by distance by default.
 * @return {JSX.Element}
 */
export function NearestSort(){
    const [searchParams] = useSearchParams()

    if (window.location.search.length === 0){

        searchParams.set("s",3)
        searchParams.set("o",0)
        location.search=searchParams.toString()
        return <></>
    }
    return <main className={classes.main}>
        <RestaurantList title={"Restaurants Nearby"}/>
    </main>
}

/**
 * A page with a list of restaurants sorted by top rated by default.
 *
 * Used for nearest restaurants and top restaurants.
 *
 * @return {JSX.Element}
 */
export function TopRatedSort(){
    const [searchParams] = useSearchParams()
    if (window.location.search.length === 0){

        searchParams.set("s",1)
        searchParams.set("o",1)
        searchParams.set("v",15)
        location.search=searchParams.toString()
        return <></>
    }
    return <main className={classes.main}>
        <RestaurantList title={"Top Rated Restaurants"}/>
    </main>
}
