import { createContext, useContext, useReducer } from 'react';

export const UserContext = createContext();

export const UserContextWrap = ({ intialState, reducer, children }) => (
  <UserContext.Provider value={useReducer(reducer, intialState)}>
    {children}
  </UserContext.Provider>
);

export const useUserValue = () => useContext(UserContext);