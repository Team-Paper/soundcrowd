/* global describe beforeEach afterEach it */

import { expect } from 'chai';
import MockAdapter from 'axios-mock-adapter';
import configureMockStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';
import songReducer, { fetchTopSongs, clearSongs, removeSong } from './songs';
import axios from './axios';

const mockAxios = new MockAdapter(axios);
const middlewares = [thunkMiddleware];
const mockStore = configureMockStore(middlewares);

describe('thunk creators', () => {
  let store;
  const song1 = { id: 1, url: 'test' };
  const initialState = { songs: [song1] };

  beforeEach(() => {
    store = mockStore(initialState);
  });

  afterEach(() => {
    store.clearActions();
  });

  describe('Top Songs', () => {
    it('eventually dispatches the GET SOME SONGS action', () => {
      const numSongs = 5;
      mockAxios.onGet(`/api/songs/top/${numSongs}`).replyOnce(200, {});
      return store.dispatch(fetchTopSongs(numSongs))
        .then(() => {
          const actions = store.getActions();
          expect(actions[0].type).to.be.equal('GET_SOME_SONGS');
        });
    });
  });

  describe('Remove a song', () => {
    it('dispatches the REMOVE SONG action and removes a song based on ID', () => {
      const action = removeSong(song1);
      const allSongs = [{ id: 4, url: 'hi' }, { id: 2, url: 'me' }, song1];
      const newState = songReducer(allSongs, action);
      expect(newState).to.not.contain(song1);
    });
  });

  describe('Clear songs', () => {
    it('dispatches the CLEAR SONGS action and removes all songs', () => {
      const action = clearSongs();
      const currState = store.getState();
      const newState = songReducer(currState, action);
      expect(newState).to.deep.equal([]);
    });
  });
});
