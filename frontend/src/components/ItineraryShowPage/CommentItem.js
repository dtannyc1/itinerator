import { useDispatch, useSelector } from 'react-redux';
import { formatDate } from '../MainPage/MainPageItineraryItem';
import './CommentItem.css';
import { selectCurrentUser } from '../../store/session';
import { useState } from 'react';
import { deleteComment, updateComment } from '../../store/comments';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

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
            <div className='comment-body'>{body}</div>
            <div className='comment-date'>{formatDate(createdAt)}</div>
            {currentUser?._id === authorId ? controlButtons : <></>}
        </div>
    );

    const updateCommentForm = (
        <div className='comment-capsule-update'>
            
            <textarea
                className='comment-form-body'
                value={commentBody}
                onChange={e => setCommentBody(e.currentTarget.value)}
            />
            <button 
                onClick={handleUpdate} 
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