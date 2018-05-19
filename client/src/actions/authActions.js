import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import { GET_ERRORS, SET_CURRENT_USER } from './types';

// Register User
export const registerUser = (userData, history) => dispatch => {

  axios
    .post('/api/users/register', userData)
    .then(res => history.push('/login'))   // Redir back when successful
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
}

// Login  - Get User token
export const loginUser = (userData) => dispatch => {
  axios.post('/app/users/login', userData)
    .then(res => {
      // save to local storage
      const { token } = res.data;
      // set token to ls
      localStorage.setItem('jwtToken', token);
      // set token to local header
      setAuthToken(token);
      // decode token
      const decoded = jwt_decode(token);
      // set ccurrent user
      dispatch(setCurrentuUser(decoded));

    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    })
}

// set logged in user
export const setCurrentuUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  }
}