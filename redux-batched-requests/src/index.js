import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import batchMiddleware from "./middleware";
import { createLogger } from "redux-logger";

const initialState = {
  data: {
    batched: {},
    regular: {},
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "BATCHED_REQUEST_SUCCESS":
      return {
        ...state,
        data: {
          ...state.data,
          batched: {
            ...state.data.batched,
            ...action.payload.data,
          },
        },
      };
    case "REQUEST_DATA":
      const res = `name of id ${action.payload.key}`;
      return {
        ...state,
        data: {
          ...state.data,
          regular: { ...state.data.regular, [action.payload.key]: res },
        },
      };
    default:
      return state;
  }
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middlewares = [batchMiddleware];
middlewares.push(
  createLogger({
    collapsed: true,
    duration: true,
    diff: false,
  })
);
const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(...middlewares))
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
