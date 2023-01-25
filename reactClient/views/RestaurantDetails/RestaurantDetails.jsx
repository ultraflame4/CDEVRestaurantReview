import {defComponent} from "@/tools/define";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {GetRestaurantById} from "@/api";

export default defComponent((props) => {
    const params = useParams()
    const restaurantId = params.id
    const [data,setData] = useState(null)

    useEffect(() => {
        GetRestaurantById(restaurantId)
            .then(value => {
                console.log(value)
            })
    })

    return (<main>

    </main>)
})
