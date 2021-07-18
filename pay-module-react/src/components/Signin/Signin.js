import {useState} from 'react';
import Validation from './ValidationSignin';
import { Card, Navbar, Container, Row, Col } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import logo from '../../decentorage.png';
import axios from 'axios';
import url from '../../url';
import './Signin.css'

function Signin() {

    const [values, setvalues] = useState({
        username:"",
        password:"",
        selection:"user",
        loggedin: false
    });

    const [errors, seterrors] = useState({});

    const submitForm = (event) => {
        event.preventDefault();
        let stat = Validation(values);
        seterrors(stat);
        if(Object.keys(stat).length === 0){
            if(values.selection === 'user'){
                values.loggedin = true;
                setvalues(values);
                axios.post(url + '/user/signin', {
                    username: values.username,
                    password: values.password
                }).then((response) => {
                    console.log(response.status, response.data['token']);
                    localStorage.setItem('accessToken', response.data['token']);
                    
                }).catch(error => {
                    console.log('There was an error!', error);
                    errors.signin = error.response.data;
                    seterrors(errors);
                });
            } else {
                axios.post(url + '/storage/signin', {
                    username: values.username,
                    password: values.password
                }).then((response) => {
                    console.log(response.status, response.data);
                    localStorage.setItem('accessToken', response.data['token']);
                }).catch(error => {
                    console.log('There was an error!', error.response.status, error.response.data);
                    errors.signin = error.response.data;
                    seterrors(errors);
                });
            }
        }
    };

    const changeHandler = (event) => {
        setvalues({
            ...values,
            [event.target.name]: event.target.value
        })
    };

    return (
        <>
        <Navbar className = "Navbar">
            <Container fluid>
                <Row>
                    <Col sm={3}><img src={logo} alt="Logo" className='logo'/></Col>
                </Row>
            </Container>
        </Navbar>
        <Card style={{ width: '25rem' }} className="signin-card">
            <form onSubmit={submitForm}>
                <div>
                    <label>Username</label>
                    <input 
                    type="text" 
                    name="username" 
                    value={values.username}
                    onChange={changeHandler}
                    className="input-style"
                    />
                    {errors.username && <p>{errors.username}</p>}
                </div>
                <div>
                    <label>password</label>
                    <input 
                    type="password" 
                    name="password"
                    value={values.password}
                    onChange={changeHandler}
                    className="input-style"
                    />
                    {errors.password && <p>{errors.password}</p>}
                </div>
                <div>
                    <label>
                        <input
                        type="radio"
                        name="selection"
                        value="user"
                        checked={values.selection === "user"}
                        onChange={changeHandler}
                        />
                        User
                    </label>
                    <label>
                        <input
                        type="radio"
                        name="selection"
                        value="storage"
                        checked={values.selection === "storage"}
                        onChange={changeHandler}
                        />
                        Storage
                    </label>
                </div>
                {errors.signin && <p>{errors.signin}</p>}
                <input type="submit" value="sign in" className="btn btn-primary btn-lg buttons-style" />
                <p>if you don't have an account sign up</p>
                <Link to="/signup" className="btn btn-primary btn-lg buttons-style">sign up</Link>
                {values.loggedin && <Redirect to='/user'/>}
            </form>
        </Card>
        </>
    );
}

export default Signin;