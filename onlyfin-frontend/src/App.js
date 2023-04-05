import logo from './logo.svg';
import './App.css';
import {Route, Routes} from "react-router-dom";

function App() {
  return (
    <Routes className="App">
      <Route path="/" element={<Home />}></Route>
      <Route path="Login">
        <Route path="" element={<Login/>}></Route>
        <Route path="Dashboard">
          <Route path="" element={<Dashboard />}/>
        </Route>
      </Route>

    </Routes>
  );
}

export default App;
