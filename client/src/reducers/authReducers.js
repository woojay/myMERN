import isEmpty from '../validation/is-empty';
import { SET_CURRENT_USER } from '../actions/types';
import { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } from 'constants';

const initialState = {
  isAuthenticated: false,
  user: {}
}

export default function (state = initialState, action) {
  switch (action.type) {
    // case TEST_DISPATCH:
    //   return {
    //     ...state,
    //     user: action.payload
    //   }
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      }
    default:
      return state;
  }
}