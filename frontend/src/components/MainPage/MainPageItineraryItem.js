

const MainPageItineraryItem = ({ itinerary }) => {
    const {creator} = itinerary;

    return (
        <div className="itinerary-item-wrap">
            <p>{creator}</p>
        </div>
    )
}

export default MainPageItineraryItem;