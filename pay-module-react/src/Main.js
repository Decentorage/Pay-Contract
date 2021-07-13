import 'bootstrap/dist/css/bootstrap.min.css';
import './Main.css'
import Signin from './Signin';
import Signup from './Signup';
import App from './App';
import { BrowserRouter as Router, Link,  Switch, Route } from "react-router-dom";
import { Button, Container } from "react-bootstrap";

function Main() {
    return (
        <Router>
            <Container>
                <div>
                    <Link to='/signin'>
                        <Button size="lg">sign in</Button>
                    </Link>
                    <Link to='signup'> 
                        <Button size="lg">sign up</Button>
                    </Link>
                    <Link to='app'> 
                        <Button size="lg">contract page</Button>
                    </Link>
                </div>
                
            </Container>
            <Switch>
                <Route path="/signin" component={Signin}/>
                <Route path="/signup" component={Signup}/>
                <Route path="/app" component={App}/>
            </Switch>
        </Router>
    );
}

export default Main;