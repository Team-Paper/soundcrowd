/* global describe beforeEach afterEach it */

import {expect} from 'chai'
import {fetchTopSongs, fetchUserSongs, clearSongs} from './songs'
import axios from './axios'
import MockAdapter from 'axios-mock-adapter'
import configureMockStore from 'redux-mock-store'
import thunkMiddleware from 'redux-thunk'
import history from '../history'

const mockAxios = new MockAdapter(axios)
const middlewares = [thunkMiddleware]
const mockStore = configureMockStore(middlewares)

describe('thunk creators', () => {
  let store
  const song1 = {id: 1, url: 'test'}
  const initialState = {songs: song1}

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

  describe('Clear songs', () => {
    it.only('dispatches the CLEAR SONGS action and removes all songs', () => {
          store.dispatch(clearSongs())
          const actions = store.getActions()
          console.log(actions)
          expect(actions[0].type).to.be.equal('CLEAR_SONGS')
          // expect(history.location.pathname).to.be.equal('/login')
        })
    })
  })
