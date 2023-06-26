import { useDispatch, useSelector } from 'react-redux';
import { formatDate } from '../MainPage/MainPageItineraryItem';
import './CommentItem.css';
import { selectCurrentUser } from '../../store/session';
import { useState } from 'react';
import { deleteComment, updateComment } from '../../store/comments';
import { useParams } from 'react-router-dom';

const CommentItem = ({ comment }) => {
    const { itineraryId } = useParams();
    const { author, body, createdAt, authorId, _id } = comment;
    const currentUser = useSelector(selectCurrentUser);
    const [showUpdateForm, setShowUpdateFrom] = useState(false);
    const [commentBody, setCommentBody] = useState(body);
    const dispatch = useDispatch();

    const handleUpdate = () => {
        dispatch(updateComment(itineraryId, _id, commentBody));
        setShowUpdateFrom(false);
    };

    const handleDelete = () => {
        dispatch(deleteComment(itineraryId, _id));
    };

    const controlButtons = (
        <div className='comment-form-buttons-holder'>
            <button
                className="form-create-button"
                onClick={e=>setShowUpdateFrom(true)}
                >Update Comment
            </button>
            <button
                className="form-create-button"
                onClick={handleDelete}
                >Delete Comment
            </button>
        </div>
    )

    const commentItem = (
        <div className='comment-capsule'>
            <div className='comment-author'>{author}</div>
            <div className={`comment-body${currentUser?._id === authorId ? '' : ' comment-body-full'}`}>{body}</div>
            <div className={`comment-date${currentUser?._id === authorId ? ' comment-date-short' : ''}`}>{formatDate(createdAt)}</div>
            {currentUser?._id === authorId ? controlButtons : <></>}
        </div>
    );

    const updateCommentForm = (
        <div className='comment-update-box'>
            <div className='comment-author'>{author}</div>

            <textarea
                className='comment-form-body-update'
                value={commentBody}
                onChange={e => setCommentBody(e.currentTarget.value)}
            />
            <button
                onClick={handleUpdate}
                id='comment-update-button'
                className='form-create-button'
                >Update Comment
            </button>
        </div>
    )

    return (
        showUpdateForm ? updateCommentForm : commentItem
    )
}

export default CommentItem;
