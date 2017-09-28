import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter, Link} from 'react-router-dom'
import {Menu} from 'semantic-ui-react'
import {logout} from '../store'

/**
 * COMPONENT
 *  The Main component is our 'picture frame' - it displays the navbar and anything
 *  else common to our entire app. The 'picture' inside the frame is the space
 *  rendered out by the component's `children`.
 */
const Main = (props) => {
  const {children, handleClick, isLoggedIn} = props

  return (
    <div>
      <Menu floated fixed="top" stackable >
      <Menu.Item header>SOUNDCROWD</Menu.Item>
        {
          isLoggedIn
            ? <Menu.Menu>
                <Menu.Item as={Link} to="/home">
                  Home
                </Menu.Item>
                <Menu.Item onClick={handleClick}>
                  Logout
                </Menu.Item>
            </Menu.Menu>
            : <Menu.Menu>
                <Menu.Item as={Link} to="/login">
                  Login
                </Menu.Item>
                <Menu.Item as={Link} to="/signup">
                  Sign Up
                </Menu.Item>
              </Menu.Menu>
        }
      </Menu>
      <hr />
      {children}
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleClick () {
      dispatch(logout())
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Main))

/**
 * PROP TYPES
 */
Main.propTypes = {
  children: PropTypes.object,
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
