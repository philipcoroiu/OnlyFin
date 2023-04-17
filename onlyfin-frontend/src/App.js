import './App.css';
import {Route, Routes} from "react-router-dom";
import Home from "./components/home/Home"
import Login from "./components/login/Login"
import Dashboard from "./components/dashboard/Dashboard"
import Studio from "./components/Studio/Studio"
import UserDebug from "./components/login/UserDebug"
import Register from "./components/registration/Register";

function App() {
    return (
        <Routes className="App">
            <Route path="/" element={<Home/>}></Route>
            <Route path="Dashboard"> {/* moved "Dashboard" to next line */}
                <Route path="" element={<Dashboard/>}></Route>
                <Route path="Studio" element={<Studio/>}></Route>
            </Route>
            <Route path="Login">
                <Route path="" element={<Login/>}></Route>
                <Route path="UserDebug">
                    <Route path="" element={<UserDebug/>}/>
                </Route>
            </Route>
            <Route path="Register">
                <Route path="" element={<Register/>}></Route>
            </Route>
        </Routes>
    );
}

export default App;
