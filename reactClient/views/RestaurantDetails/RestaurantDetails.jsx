import {defComponent} from "@/tools/define";
import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {GetRestaurantById} from "@/api";
import "./RestaurantDetails.css"
import {InfiniteScroll} from "@/components/InfiniteScroll/InfiniteScroll";
import {StarRatings} from "@/components/Ratings/StarRatings";
import {Icon} from "@iconify-icon/react";
import {CostRatings} from "@/components/Ratings/CostRatings";
import {LineBreaker} from "@/components/LineBreaker";

export default defComponent((props) => {
    const params = useParams()
    const restaurantId = params.id
    const [data, setData] = useState(null)

    useEffect(() => {
        GetRestaurantById(restaurantId)
            .then(value => {
                setData(value)
            })
    })

    if (data === null){
        return <div><InfiniteScroll/></div>
    }


    return (<div>
        <main>
            <div>
                <h1>{data.name}</h1>
                <StarRatings rating={data.avg_rating}/>
                <div id={"other-info"}>
                    <CostRatings rating={data.cost_rating/2}/>
                    <Icon icon={"ci:dot-03-m"}/>
                    <span>{Math.round(data.distance / 10) / 100}km</span>
                </div>
                <h2>Description</h2>
                <p id={"restaurant-desc"}>
                    <LineBreaker text={data.description} sep={"<br>"}/>
                </p>
            </div>
            <div>

            </div>
        </main>
    </div>)
})
