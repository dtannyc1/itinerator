import { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { createComment } from "../../store/comments";

const CommentForm = () => {
    const {itineraryId} = useParams();
    const [commentBody, setCommentBody] = useState('');
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createComment(itineraryId, commentBody));
        setCommentBody('');
    };

    return (
        <div className="flex-box">
            <form className="comment-capsule-update">
                <div className="comment-form-title">Have anything to share?</div>
                <textarea
                    className="comment-form-body"
                    id="comment-form-body-create"
                    value={commentBody}
                    onChange={e => setCommentBody(e.currentTarget.value)}
                />
                <button
                    onClick={handleSubmit}
                    className='form-create-button'
                    >Create Comment
                </button>
            </form>
        </div>
    )
}

export default CommentForm;
