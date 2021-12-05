import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { createStore } from "redux";

// REDUX: Initial State
const initialState = {
  aaa: 1000,
  bbb: 2000,
};
// REDUX: Root Reducer
function reducer(state = initialState, action) {
  switch (action.type) {
    case "INCREMENT_A":
      return {
        ...state,
        aaa: state.aaa + 1,
      };
    case "INCREMENT_B":
      return {
        ...state,
        bbb: state.aaa + 1,
      };
    case "ZERO_ALL":
      return {
        aaa: 0,
        bbb: 0,
      };
    default:
      return state;
  }
}

// REDUX: Store
const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

// REDUX: Selectors
export const selectA = () => store.getState().aaa;

// REDUX: Dispatchers
export const incrementA = () => store.dispatch({ type: "INCREMENT_A" });

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
