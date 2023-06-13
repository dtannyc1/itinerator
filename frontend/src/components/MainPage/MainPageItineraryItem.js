

const MainPageItineraryItem = ({ itinerary }) => {
    const { _id, creator } = itinerary;

    return (
        <a href={`/itineraries/${_id}`}>
            <div className="itinerary-item-wrap">
                <p>{creator}</p>
            </div>
        </a>
    )
}

export default MainPageItineraryItem;