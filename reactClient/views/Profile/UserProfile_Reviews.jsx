import ReviewsList from "@/components/Reviews/ReviewsList";
import {GetUserReviews} from "@/core/api";

export default function UserProfile_Reviews() {
    async function loadMoreReviews(start){
        let value = await GetUserReviews(start)
        console.log(value)
        let allShown = value.limit > value.total
        return {reviews: value.reviews, allShown: allShown}
    }
    return (<main>
        <ReviewsList loadMore={loadMoreReviews}/>
    </main>)
}
