import 'bootstrap/dist/css/bootstrap.min.css';
import './Main.css'
import Signin from '../Signin/Signin';
import Signup from '../Signup/Signup';
import User from '../User/User';
import NoProvider from '../NoProvider/Noprovider';
import { BrowserRouter as Router,  Switch, Route } from "react-router-dom";


function Main() {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={Signin}/>
                <Route path="/signup" component={Signup}/>
                <Route path="/user" component={User}/>
                <Route path="/noprovider" component={NoProvider}/>
            </Switch>
        </Router>
    );
}

export default Main;