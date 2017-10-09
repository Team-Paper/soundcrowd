/* global describe beforeEach afterEach it */

import {expect} from 'chai'
import {fetchTopSongs, fetchUserSongs} from './songs'
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

  const initialState = {user: {}}

  beforeEach(() => {
    store = mockStore(initialState)
  })

  afterEach(() => {
    store.clearActions()
  })

  describe('Top Songs', () => {
    it.only('eventually dispatches the GET SOME SONGS action', () => {
      const numSongs = 5;
      const song1 = 'test123'
      const songs = []
      mockAxios.onGet(`/api/songs/top/${numSongs}`).replyOnce(200, {songs})
      return store.dispatch(fetchTopSongs(numSongs))
        .then(() => {
          const actions = store.getActions()
          console.log(actions)
          expect(actions[0].type).to.be.equal('GET_SOME_SONGS')
          // expect(actions[0].user).to.be.deep.equal(fakeUser)
        })
    })
  })

  describe('User songs', () => {
    it('eventually dispatches the REMOVE_USER action', () => {
      mockAxios.onPost('/auth/logout').replyOnce(204)
      return store.dispatch(logout())
        .then(() => {
          const actions = store.getActions()
          expect(actions[0].type).to.be.equal('REMOVE_USER')
          expect(history.location.pathname).to.be.equal('/login')
        })
    })
  })
})
