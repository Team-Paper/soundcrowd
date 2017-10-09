import React from 'react';
import { connect } from 'react-redux';
import { Feed } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

function CommentEntry({ comment }) {
  return (
    <Feed>
      <Feed.Event>
        <Feed.Label image={comment.user.userImage} />
        <Feed.Content>
          <Feed.Summary>
            <Link to={`/song/${comment.songId}`} >{comment.text}</Link>
          </Feed.Summary>
        </Feed.Content>
      </Feed.Event>
    </Feed>
  );
}

const mapState = (state, ownProps) => ({});

const mapDispatch = dispatch => ({});

export default connect(mapState, mapDispatch)(CommentEntry);
