import React from 'react';
import { Feed } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

function CommentEntry({ comment }) {
  return (
    <Feed>
      <Feed.Event>
        <Feed.Label image={comment.user.userImage || ''} />
        <Feed.Content>
          <Feed.Summary>
            <Link to={`/song/${comment.songId}`} >{comment.text}</Link>
          </Feed.Summary>
        </Feed.Content>
      </Feed.Event>
    </Feed>
  );
}

export default CommentEntry;
