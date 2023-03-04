import "./App.css";
import { useSelector, useDispatch } from "react-redux";
import { useRef } from "react";

function App() {
  const renderCounter = useRef(0);
  const userId = useRef(0);
  const dispatch = useDispatch();

  const shootBatched = () => {
    userId.current++;
    return dispatch({
      type: "REQUEST_DATA_BATCHED",
      payload: {
        key: userId.current,
        url: `https://swapi.dev/api/people/${userId.current}/`,
      },
    });
  };

  const shootRegular = () => {
    userId.current++;
    dispatch({
      type: "REQUEST_DATA",
      payload: {
        key: userId.current,
        url: `https://swapi.dev/api/people/${userId.current}/`,
      },
    });
  };

  const fullStore = useSelector((state) => state);

  renderCounter.current = renderCounter.current + 1;
  return (
    <div className="App">
      <h3>Redux batching requests custom middleware</h3>
      <div>(keep an eye on this counter while shooting)</div>
      <div>This page re-rendered {renderCounter.current} times</div>
      <div>
        Click 5 times: <button onClick={() => shootRegular()}>+</button>
      </div>
      <div>
        Click 5 times and wait:{" "}
        <button onClick={() => shootBatched()}>+</button>
      </div>
      <pre
        style={{
          width: "80%",
          backgroundColor: "black",
          color: "lightgreen",
          textAlign: "left",
          padding: "1rem",
        }}
      >
        store: {JSON.stringify(fullStore, null, 1)}
      </pre>
    </div>
  );
}

export default App;
