import {useEffect, useState} from 'react';
import { Navbar, Container, Row, Col } from 'react-bootstrap';
import { Link, useHistory } from "react-router-dom";
import Validation from './ValidationSignup';
import logo from '../../decentorage_icon.png';
import axios from 'axios';
import url from '../../url';
import './Signup.css';
import web3 from '../contract/web3';

function Signup() {
    const history = useHistory();

    useEffect(() => {
        if(typeof web3 === 'string'){
            history.push("/noprovider");
        }
    }, []);

    const [values, setvalues] = useState({
        username:"",
        password:"",
        confirm:"",
        walletAddress:"",
        availableSpace:'',
        selection:"user"
    });

    const [errors, seterrors] = useState({});

    const signin = (event) => {
        event.preventDefault();
        if(values.selection === 'user'){
            axios.post(url + '/user/signin', {
                username: values.username,
                password: values.password
            }).then((response) => {
                localStorage.setItem('accessToken', response.data['token']);
                localStorage.setItem('username', values.username);
                history.push('/user');
            }).catch(error => {
                errors.signin = error.response.data;
                seterrors(errors);
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
    };

    const submitForm = (event) => {
        event.preventDefault();
        let stat = Validation(values);
        seterrors(stat);
        if(Object.keys(stat).length === 0){
            if(values.selection === 'user'){
                axios.post(url + '/user/signup', {
                    username: values.username,
                    password: values.password
                }).then((response) => {
                    alert("you have signed up successfully, press ok to sign in");
                    signin(event);
                }).catch(error => {
                    alert("a problem accured while signing up")
                });
            } else {
                axios.post(url + '/storage/signup', {
                    username: values.username,
                    password: values.password,
                    wallet_address: values.walletAddress,
                    available_space: values.availableSpace
                }).then((response) => {
                    alert("you have signed up successfully, press ok to sign in");
                    signin(event);
                }).catch(error => {
                    alert("a problem accured while signing up")
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
        <div className="signup-container">
            <section className="signup" id="signup">
                <header>
                <h2>Decentorage</h2>
                <h4>Signup</h4>
                </header>
                <form className="signup-form" onSubmit={submitForm}>
                    <input 
                        type="text" 
                        name="username" 
                        value={values.username}
                        onChange={changeHandler}
                        className="signup-input"
                        placeholder="User"
                        autoFocus
                    />
                    {errors.username && <p>{errors.username}</p>}
                    <input 
                        type="password" 
                        name="password"
                        value={values.password}
                        onChange={changeHandler}
                        className="signup-input"
                        placeholder="Password"
                    />
                    {errors.password && <p>{errors.password}</p>}
                    <input 
                        type="password" 
                        name="confirm"
                        value={values.confirm}
                        onChange={changeHandler}
                        className="signup-input"
                        placeholder="confirm password"
                    />
                    {errors.confirm && <p>{errors.confirm}</p>}
                    <input 
                        type="text" 
                        name="walletAddress"
                        value={values.walletAddress}
                        onChange={changeHandler}
                        hidden={values.selection === "user"}
                        className="signup-input"
                        placeholder="wallet address"
                    />
                    {errors.password && <p>{errors.walletAddress}</p>}
                    <input 
                        type="number" 
                        name="availableSpace"
                        value={values.availableSpace}
                        onChange={changeHandler}
                        hidden={values.selection === "user"}
                        className="signup-input"
                        placeholder="available space (in GB)"
                    />
                    {errors.availableSpace && <p>{errors.availableSpace}</p>}
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
                        <button type="submit" className="signup-button" style={{margin: "0 auto"}}>SIGN UP</button>
                    </div>
                    <div className="submit-container">
                        <Link to="/" className="btn signup-button" style={{margin: "0 auto"}}>IF YOU ALREADY HAVE AN ACCOUNT SIGN IN</Link>
                    </div>
                </form>
            </section>
        </div>
        </>
    );
}

export default Signup;