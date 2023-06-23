import { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { createComment } from "../../store/comments";

const CommentForm = () => {
    const {itineraryId} = useParams();
    const [commentBody, setCommentBody] = useState('');
    const dispatch = useDispatch();
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if(commentBody === '') {
            setError('Comment can not be empty')
        } else {
            dispatch(createComment(itineraryId, commentBody));
            setCommentBody('');
            setError('');
        }
    };

    return (
        <div className="flex-box">
            <form className="comment-capsule-update">
                <div className="comment-form-title">Have anything to share?</div>
                <textarea
                    className={error ? "comment-form-body-red" : 'comment-form-body'}
                    id="comment-form-body-create"
                    value={commentBody}
                    onChange={e => setCommentBody(e.currentTarget.value)}
                />
                <div className="flex-row">
                {error? <div className="comment-errors">{error}</div> : <div></div>}
                <button
                    onClick={handleSubmit}
                    className='form-create-button'
                    >Create Comment
                </button>
                </div>
            </form>
        </div>
    )
}

export default CommentForm;
