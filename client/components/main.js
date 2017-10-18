import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import { logout } from '../store';

const styles = {
  main: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
};

const Main = (props) => {
  const { children, handleClick, isLoggedIn } = props;

  return (
    <div style={styles.main}>
      <Menu stackable >
        <Menu.Item header as={Link} to="/">SOUNDCROWD</Menu.Item>
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
      {children}
    </div>
  );
};

/**
 * CONTAINER
 */
const mapState = state => ({
  isLoggedIn: !!state.user.id,
});

const mapDispatch = dispatch => ({
  handleClick() {
    dispatch(logout());
  },
});

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Main));
