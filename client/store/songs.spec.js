/* global describe beforeEach afterEach it */

import {expect} from 'chai'
import {fetchTopSongs, fetchUserSongs, clearSongs, removeSong} from './songs'
import axios from './axios'
import MockAdapter from 'axios-mock-adapter'
import configureMockStore from 'redux-mock-store'
import thunkMiddleware from 'redux-thunk'
import history from '../history'
import songReducer from './songs'

const mockAxios = new MockAdapter(axios)
const middlewares = [thunkMiddleware]
const mockStore = configureMockStore(middlewares)

describe('thunk creators', () => {
  let store
  const song1 = {id: 1, url: 'test'}
  const initialState = {songs: [song1]}

  beforeEach(() => {
    store = mockStore(initialState)
  })

  afterEach(() => {
    store.clearActions()
  })

  describe('Top Songs', () => {
    it('eventually dispatches the GET SOME SONGS action', () => {
      const numSongs = 5;
      mockAxios.onGet(`/api/songs/top/${numSongs}`).replyOnce(200, {})
      return store.dispatch(fetchTopSongs(numSongs))
        .then(() => {
          const actions = store.getActions()
          expect(actions[0].type).to.be.equal('GET_SOME_SONGS')
          // expect(actions[0].user).to.be.deep.equal(fakeUser)
        })
    })
  })

  describe('Remove a song', () => {
    it.only('dispatches the REMOVE SONG action and removes a song based on ID', () => {
          const action = removeSong(song1)
          const actions = store.getActions()
          const allSongs = [{id: 4, url: 'hi'}, {id: 2, url: 'me'}, song1]
          console.log(allSongs)
          const newState = songReducer(allSongs, action)
          console.log(newState)
          // expect(actions[0].type).to.be.equal('REMOVE_SONG')
          expect(newState).to.not.contain(song1)
          // expect(history.location.pathname).to.be.equal('/login')
        })
    })

  describe('Clear songs', () => {
    it('dispatches the CLEAR SONGS action and removes all songs', () => {
          const action = clearSongs()
          const currState = store.getState()
          const newState = songReducer(currState, action)
          expect(newState).to.deep.equal([])
          console.log(newState)
          // expect(history.location.pathname).to.be.equal('/login')
        });
    })
  })
