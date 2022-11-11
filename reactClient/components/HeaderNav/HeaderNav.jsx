import {defComponent} from "@/tools/define";
import classes from "./HeaderNav.module.css";

export default defComponent((props) => {
    return (
        <header className={classes.HeaderNav}>
            <div className={classes.HeaderNavTitle}>
                <h1>Restau<sub>Rants</sub></h1>
            </div>
            <div className={classes.HeaderNavSearch}>

            </div>
        </header>
    )
})
