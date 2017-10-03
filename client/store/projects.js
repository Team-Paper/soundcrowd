import axios from 'axios';

/**
 * ACTION TYPES
 */
const GET_PROJECTS = 'GET_PROJECTS';
const GET_PROJECT = 'GET_PROJECT';
const REMOVE_PROJECT = 'REMOVE_PROJECT';
const CLEAR_PROJECTS = 'CLEAR_PROJECTS';

/**
 * INITIAL STATE
 */
const defaultProjects = [];

/**
 * ACTION CREATORS
 */
export const getProject = project => ({ type: GET_PROJECT, project });
export const removeProject = project => ({ type: REMOVE_PROJECT, project });
export const getProjects = projects => ({ type: GET_PROJECTS, projects });
export const clearProjects = () => ({ type: CLEAR_PROJECTS });

/**
 * THUNK CREATORS
 */
export const fetchProject = (id) => {
  return (dispatch) => {
    return axios.get(`/api/projects/${id}`)
      .then(res => res.data)
      .then(project => dispatch(getProject(project)))
      .catch(console.error.bind(console));
  };
};

export const fetchUserProjects = (projectId) => {
  return (dispatch) => {
    return axios.get(`/api/users/${projectId}/projects`)
      .then(res => res.data)
      .then(projects => dispatch(getProjects(projects)))
      .catch(console.error.bind(console));
  };
};

/**
 * REDUCER
 */
export default function (state = defaultProjects, action) {
  switch (action.type) {
    case GET_PROJECT:
      return [...state, action.project];
    case GET_PROJECTS:
      return action.projects;
    case REMOVE_PROJECT:
      return state.filter(project => project.id !== action.project.id);
    case CLEAR_PROJECTS:
      return defaultProjects;
    default:
      return state;
  }
}
