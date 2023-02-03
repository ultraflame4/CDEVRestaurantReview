import {RestaurantList} from "@/components/Restaurant/RestaurantList";
import {useSearchParams} from "react-router-dom";
import classes from "./SearchPage.module.css";

export default function SearchResults(){
    const [searchParams] = useSearchParams()
    let searchQuery = searchParams.get('q')??""

    return <main className={classes.main}>
        <RestaurantList title={`Search for "${searchQuery}"`} searchQuery={searchQuery}/>
    </main>
}
