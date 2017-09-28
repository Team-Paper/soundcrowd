import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Grid, Header} from 'semantic-ui-react'

/**
 * COMPONENT
 */
export const DAW = (props) => {
  const {name} = props

  return (
    <Grid divided>
      <Grid.Column width={3}>
        <Header as='h3'>{name}</Header>
        <p>library goes here</p>
      </Grid.Column>
      <Grid.Column width={9}>
        Timeline Goes Here
      </Grid.Column>
    </Grid>
  )
}

/**
 * CONTAINER
 */
const mapState = () => {
  // return state.project
  return {
    name: 'Current Project',
  }
}

export default connect(mapState)(DAW)

/**
 * PROP TYPES
 */
DAW.propTypes = {
  name: PropTypes.string.isRequired,
}
