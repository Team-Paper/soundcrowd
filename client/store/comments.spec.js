/* global describe it */

import { expect } from 'chai';
import commentReducer, { getComment, GET_COMMENT, getSomeComments, GET_SOME_COMMENTS } from './comments';


describe('Comment redux store', () => {
  const fakeComment = { id: 1, text: 'This is a comment', user: { name: 'Tess', id: 4 } };
  const fakeComment2 = { id: 2, text: 'This is a comment', user: { name: 'Tess', id: 4 } };

  describe('Action Creators', () => {
    it('returns the correct action for each creator', () => {
      expect(getComment(fakeComment)).to.deep.equal({ type: GET_COMMENT, comment: fakeComment });
      expect(getSomeComments([fakeComment, fakeComment2]))
        .to.deep.equal({ type: GET_SOME_COMMENTS, comments: [fakeComment, fakeComment2] });
    });
  });

  describe('Reducer', () => {
    it('Appends a comment to the state when action type is GET_COMMENT', () => {
      const action = getComment(fakeComment);
      const newState = commentReducer([], action);
      expect(newState).to.deep.equal([fakeComment]);
    });

    it('Appends multiple comments when the action type is GET_SOME_COMMENTS', () => {
      const action = getSomeComments([fakeComment]);
      const newState = commentReducer([fakeComment2], action);
      expect(newState).to.contain(fakeComment);
      expect(newState).to.contain(fakeComment2);
    });

    it('Returns the previous state when the action type does not match', () => {
      const action = { type: 'BOGUS_ACTION_TYPE', comment: fakeComment };
      const newState = commentReducer([fakeComment2], action);
      expect(newState).to.deep.equal([fakeComment2]);
    });
  });
});
