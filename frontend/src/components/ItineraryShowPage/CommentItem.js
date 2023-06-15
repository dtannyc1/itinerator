import { formatDate } from '../MainPage/MainPageItineraryItem';
import './CommentItem.css';

const CommentItem = ({ comment }) => {
    const { author, body, createdAt } = comment;

    return (
        <div className='comment-capsule'>
            <div className='comment-author'>{author}</div>
            <div>{body}</div>
            <div className='comment-date'>{formatDate(createdAt)}</div>
        </div>
    )
}

export default CommentItem;