import axios from 'axios';

/**
 * ACTION TYPES
 */
const GET_PROJECTS = 'GET_PROJECTS';
const GET_PROJECT = 'GET_PROJECT';
const REMOVE_PROJECT = 'REMOVE_PROJECT';
const CLEAR_PROJECTS = 'CLEAR_PROJECTS';
const UPDATE_PROJECT = 'UPDATE_PROJECT';

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
export const updateProject = project => ({ type: UPDATE_PROJECT, project });

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

export const addCollaborator = (collabId, projectId) => {
  return (dispatch) => {
    return axios.put(`/api/projects/${projectId}/addCollab`, { id: collabId })
      .then(res => res.data)
      .then((project) => {
        dispatch(updateProject(project));
      })
      .catch(console.error.bind(console));
  }
}

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
    case UPDATE_PROJECT:
      return state.map((project) => {
        if (project.id !== action.project.id) return project;
        return action.project;
      });
    default:
      return state;
  }
}
