import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Grid, Header} from 'semantic-ui-react'

/**
 * COMPONENT
 */
export const Project = (props) => {
  const {project} = props

  return (
    <Grid divided>
      <Grid.Column width={3}>
        <Header as='h3'>{project.name}</Header>
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
  return {
    project: { name: 'Current Project' },
  }
}

export default connect(mapState)(Project)

/**
 * PROP TYPES
 */
Project.propTypes = {
  project: PropTypes.object.isRequired,
}
