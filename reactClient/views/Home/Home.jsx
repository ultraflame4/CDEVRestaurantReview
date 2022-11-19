import {defComponent} from "@/tools/define";
import "./Home.css"
import {RestaurantList} from "@/components/Restaurant/RestaurantList";

export default defComponent((props) => {
    return (
        <main>
            <section id={"recommendations-banner"}>
            {/*todo later as part of advanced feature*/}
            </section>
            <section id={"allrestaurants"}>
                <RestaurantList title={"All Restaurants"}/>
            </section>
            {/*<h1>Test</h1>*/}
            {/*<h2>Test</h2>*/}
            {/*<h3>Test</h3>*/}
            {/*<h4>Test</h4>*/}
            {/*<h5>Test</h5>*/}
            {/*<h6>Test</h6>*/}
        </main>
    )
})
