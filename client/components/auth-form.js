import React from 'react';
import { connect } from 'react-redux';
import { Form, Container, Header, Message, Segment, Button } from 'semantic-ui-react';
import { auth } from '../store';

/**
 * COMPONENT
 */
const AuthForm = (props) => {
  const { name, displayName, handleSubmit } = props;

  return (
    <Container
      textAlign="center"
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
    >
      <div style={{ width: '100%', maxWidth: 450 }}>
        <Header as="h2" color="grey" textAlign="center">
          {displayName}
        </Header>
        <Form onSubmit={handleSubmit} size="large" name={name}>
          <Segment>
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="E-mail address"
              name="email"
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              name="password"
            />

            <Button color="black" type="submit" fluid size="large">{displayName}</Button>
          </Segment>
        </Form>
        <Message>

          <a href="/auth/facebook">{displayName} with Facebook</a>

        </Message>
      </div>
    </Container>
  );
};

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = () => ({
  name: 'login',
  displayName: 'Login',
});

const mapSignup = () => ({
  name: 'signup',
  displayName: 'Sign Up',
});

const mapDispatch = dispatch => ({
  handleSubmit(evt) {
    evt.preventDefault();
    const formName = evt.target.name;
    const email = evt.target.email.value;
    const password = evt.target.password.value;
    dispatch(auth(email, password, formName));
  },
});

export const Login = connect(mapLogin, mapDispatch)(AuthForm);
export const Signup = connect(mapSignup, mapDispatch)(AuthForm);
