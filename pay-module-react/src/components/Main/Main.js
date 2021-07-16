import 'bootstrap/dist/css/bootstrap.min.css';
import './Main.css'
import Signin from '../Signin/Signin';
import Signup from '../Signup/Signup';
import App from '../contract/App';
import User from '../User/User'
import { BrowserRouter as Router,  Switch, Route, Redirect } from "react-router-dom";


function Main() {
    return (
        <>
        <Router>
            <Redirect to="signin"></Redirect>
            <Switch>
                <Route path="/signin" component={Signin}/>
                <Route path="/signup" component={Signup}/>
                <Route path="/app" component={App}/>
                <Route path="/user" component={User}/>
            </Switch>
        </Router>
        </>
    );
}

export default Main;