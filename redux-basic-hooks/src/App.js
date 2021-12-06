import "./App.css";
import { useSelector, useDispatch } from "react-redux";
import { incrementA, useSelectA } from "./index";

function App() {
  // The hooks way
  const dispatch = useDispatch();
  const incA = () => dispatch({ type: "INCREMENT_A" });
  const incB = () => dispatch({ type: "INCREMENT_B" });
  const zeroAll = () => dispatch({ type: "ZERO_ALL" });

  const aaa = useSelector((state) => state.aaa);
  const bbb = useSelector((state) => state.bbb);

  // The "another" way
  const aValue = useSelectA();

  return (
    <div className="App">
      The hooks way:
      <div>
        The aaa value is: {aaa} (<span onClick={incA}>+</span>)
      </div>
      <div>
        The bbb value is: {bbb} (<span onClick={incB}>+</span>)
      </div>
      <div onClick={zeroAll}>Everything is zeroed</div>
      <hr width="200px" />
      <div>
        Another way:
        <div>
          The aaa value is: {aValue} (<span onClick={incrementA}>+</span>)
        </div>
      </div>
    </div>
  );
}

export default App;
