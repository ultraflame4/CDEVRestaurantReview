import {defComponent} from "@/tools/define";
import "./Home.css"
import {RestaurantList} from "@/components/Restaurant/RestaurantList";

/**
 * Home page for the website
 */
export default defComponent((props) => {
    return (
        <main>
            <section id={"recommendations-banner"}>
            {/*todo later as part of advanced feature*/}
            </section>
            <section id={"allrestaurants"}>
                {/* Show the list of restaurants */}
                <RestaurantList title={"All Restaurants"}/>
            </section>

        </main>
    )
})
