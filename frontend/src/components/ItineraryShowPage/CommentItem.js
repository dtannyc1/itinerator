import './CommentItem.css'


const CommentItem = ({ comment }) => {
    const { body } = comment;

    return (
        <>
            <div>{body}</div>
        </>
    )
}

export default CommentItem;