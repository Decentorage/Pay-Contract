import {useState, useEffect} from 'react';
import Validation from './ValidationSignin';
import { Navbar, Container, Row, Col } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import logo from '../../decentorage_icon.png';
import axios from 'axios';
import url from '../../url';
import web3 from '../contract/web3';
import './Signin.css';

function Signin() {
    const history = useHistory();

    const [values, setvalues] = useState({
        username:"",
        password:"",
        selection:"user",
        loggedin: false
    });

    const [errors, seterrors] = useState({});

    useEffect(() => {
        if(typeof web3 === 'string'){
            history.push("/noprovider");
        }
    }, []);

    const submitForm = (event) => {
        event.preventDefault();
        let stat = Validation(values);
        seterrors(stat);
        if(Object.keys(stat).length === 0){
            if(values.selection === 'user'){
                axios.post(url + '/user/signin', {
                    username: values.username,
                    password: values.password
                }).then((response) => {
                    localStorage.setItem('accessToken', response.data['token']);
                    localStorage.setItem('username', values.username);
                    history.push('/user');
                }).catch(error => {
                    alert("incorrect username or password");
                });
            } else {
                axios.post(url + '/storage/signin', {
                    username: values.username,
                    password: values.password
                }).then((response) => {
                    localStorage.setItem('accessToken', response.data['token']);
                    localStorage.setItem('username', values.username);
                    history.push('/storage');
                }).catch(error => {
                    alert("incorrect username or password");
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
                    <Col xl={1} lg={2} md={2} sm={3} ><img src={logo} alt="Logo" className='logo'/></Col>
                    <Col sm={2}><h1 className="logoName">Decentorage</h1></Col>
                </Row>
            </Container>
        </Navbar>
        <div className="login-container">
            <section className="login" id="login">
                <header>
                <h2>Decentorage</h2>
                <h4>Login</h4>
                </header>
                <form className="login-form" onSubmit={submitForm}>
                    <input 
                        type="text" 
                        name="username" 
                        value={values.username}
                        onChange={changeHandler}
                        className="login-input"
                        placeholder="User"
                        autoFocus
                    />
                    {errors.username && <p>{errors.username}</p>}
                    <input 
                        type="password" 
                        name="password"
                        value={values.password}
                        onChange={changeHandler}
                        className="login-input"
                        placeholder="Password"
                    />
                    {errors.password && <p>{errors.password}</p>}
                    <Row>
                        <Col xs={6} style={{textAlign: "center"}}>
                            <input
                                type="radio"
                                name="selection"
                                value="user"
                                checked={values.selection === "user"}
                                onChange={changeHandler}
                            />
                            User
                        </Col>
                        <Col xs={6} style={{textAlign: "center"}}>
                            <input
                                type="radio"
                                name="selection"
                                value="storage"
                                checked={values.selection === "storage"}
                                onChange={changeHandler}
                            />
                            Storage
                        </Col>
                    </Row>
                    <div className="submit-container">
                        <button type="submit" className="login-button" style={{margin: "0 auto"}}>SIGN IN</button>
                    </div>
                    <div className="submit-container">
                        <Link to="/signup" className="btn login-button" style={{margin: "0 auto"}}>IF YOU DO NOT HAVE AN ACCOUNT SIGN UP</Link>
                    </div>
                </form>
            </section>
        </div>
        </>
    );
}

export default Signin;