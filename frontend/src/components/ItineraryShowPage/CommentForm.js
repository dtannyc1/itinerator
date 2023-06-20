import { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { createComment } from "../../store/comments";

const CommentForm = () => {
    const {itineraryId} = useParams();
    const [commentBody, setCommentBody] = useState('');
    const dispatch = useDispatch();

    const handleSubmit = () => {
        dispatch(createComment(itineraryId, commentBody));
    };

    return (
        <form>
            <textarea
                value={commentBody}
                onChange={e => setCommentBody(e.currentTarget.value)}
            />
            <button onClick={handleSubmit}>Create Comment</button>
        </form>
    )
}

export default CommentForm;