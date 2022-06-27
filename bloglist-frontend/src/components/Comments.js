import React, { useEffect, useState } from "react";
import { Button, ListGroup, ListGroupItem } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useField } from "../hooks";
import commentsService from "../services/comments";
import { showNotificationGreen } from "../reducers/notificationReducer";

const Comments = ({ blogId }) => {
  const dispatch = useDispatch();
  const comment = useField("text");

  const [comments, setComments] = useState([]);

  useEffect(() => {
    commentsService.getCommentsByBlogId(blogId).then((data) => {
      setComments(data);
    });
  }, [blogId]);

  const onClickCreateComment = () => {
    const text = comment.props.value;
    if (text) {
      commentsService.createComment(blogId, text).then((data) => {
        setComments([data, ...comments]);
        comment.setValue("");
        dispatch(showNotificationGreen("comment success"));
      });
    }
  };

  return (
    <div>
      <h2>comments</h2>
      <div>
        <input {...comment.props} />
        <Button variant="outline-success" onClick={onClickCreateComment}>
          add comment
        </Button>
      </div>

      <ListGroup>
        {comments.map((v) => {
          return <ListGroupItem key={v.id}>{v.text}</ListGroupItem>;
        })}
      </ListGroup>
    </div>
  );
};

export default Comments;
