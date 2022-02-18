export const initialState = {
  user_details:null,
};

export const actionTypes = {
  SET_USER_DETAILS: 'SET_USER_DETAILS',
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USER_DETAILS:
      return {
        ...state,
        user_details: action.data,
      };
    default:
      return state;
    }
};

export default reducer;