import {defComponent} from "@/tools/define";
import "./Home.css"
import {RestaurantList} from "@/components/Restaurant/RestaurantList";
import {useEffect, useState} from "react";
import {GetRestaurants} from "@/core/api";
import {RecommendedNearbyItem} from "@/components/RecommendedBanner/RecommendedItems";

/**
 * Home page for the website
 */
export default defComponent((props) => {
    const [nearbyRestaurants, setNearbyRestaurants] = useState([])

    useEffect(() => {
        GetRestaurants(0, 3,0,4).then(value => {
            setNearbyRestaurants(value)
        })
    },[true])


    return (
        <main>
            <section id={"recommendations-banner"}>
                <div>
                    <div id={"recommended-list"}>
                        <h1>Recommended near you</h1>
                        <ul>
                            {
                                nearbyRestaurants.map((value,index) =>
                                <RecommendedNearbyItem
                                    key={index}
                                    id={value.id}
                                    tags={value.tags}
                                    rating={parseFloat(value.avg_rating)}
                                    cost={value.cost_rating / 2}
                                    name={value.name}
                                    desc={value.description}
                                    imageSrc={value.photo_url}
                                    reviews_count={value.reviews_count}
                                    distance={Math.round(value.distance / 10) / 100} // round distance to 2 d.p.
                                />)
                            }
                        </ul>
                    </div>
                    <div id={"top-rated-list"} className={"card"}></div>
                </div>
            </section>
            <section id={"allrestaurants"}>
                {/* Show the list of restaurants */}
                <RestaurantList title={"All Restaurants"}/>
            </section>

        </main>
    )
})
