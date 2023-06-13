
const ActivityItem = ({ activity }) => {
    const {duration, name, type, createdAt} = activity;

    return (
        <div className="activity-item-wrap">
            <div>{ name }</div>
            <div>{ type }</div>
            <div>{ duration }</div>
            <div>{ createdAt }</div>
        </div>
    )
}

export default ActivityItem;