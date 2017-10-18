import React from 'react';
import { connect } from 'react-redux';
import { Card } from 'semantic-ui-react';
import CommentEntry from './comment-entry';
import { fetchCommentsAboutUser, fetchComments } from '../store';

class CommentList extends React.Component {
  componentDidMount() {
    const { fetchCommentsAboutUser, userId, fetchComments } = this.props;
    if (userId === null) {
      fetchComments();
    } else {
      fetchCommentsAboutUser(userId);
    }
  }

  render() {
    const { comments } = this.props;
    return (
      <Card fluid>
        <Card.Content>
          {
            comments.map(comment => <CommentEntry key={`comment-${comment.id}`} comment={comment} />)
          }
        </Card.Content>
      </Card>
    );
  }
}

const mapState = state => ({
  comments: state.comments,
});

const mapDispatch = dispatch => ({
  fetchCommentsAboutUser: userId => dispatch(fetchCommentsAboutUser(userId)),
  fetchComments: () => dispatch(fetchComments()),
});

export default connect(mapState, mapDispatch)(CommentList);
