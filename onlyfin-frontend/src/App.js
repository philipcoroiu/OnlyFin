import './style/App.css';
import {Route, Routes} from "react-router-dom";
import Home from "./components/home/Home"
import Login from "./components/login/Login"
import Dashboard from "./components/dashboard/Dashboard"
import LoginTest from "./components/login/LoginTest"
import Studio from "./components/studio/Studio"

function App() {
  return (
    <Routes className="App">
      <Route path="/" element={<Home />}></Route>
        <Route path="Dashboard"> {/* moved "Dashboard" to next line */}
            <Route path="" element={<Dashboard/>}></Route>
            <Route path="Studio" element={<Studio/>}></Route>
        </Route>
      <Route path="Login">
        <Route path="" element={<Login/>}></Route>
        <Route path="LoginTest">
          <Route path="" element={<LoginTest />}/>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
