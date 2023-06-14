// import { formatDate } from '../MainPage/MainPageItineraryItem'

const ActivityItem = ({ activity }) => {
    const {photoURLs, name, type, createdAt, streetAddress, rating} = activity;

    return (
        <div className="activity-item-wrap">
            <div>
                <img className='activity-photo' src={photoURLs[0]}></img>
            </div>

            <div className="activity-info-holder">
                <div className='activity-place-name'>{ name }</div>
                <div className='activity-place-type'>{ type }</div>
                <div className='activity-place-type'>{ streetAddress }</div>
                <div className="activity-place-rating">{ rating }</div>
            </div>
        </div>
    )
}

export default ActivityItem;