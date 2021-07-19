import {useState} from 'react';
import { Card, Navbar, Container, Row, Col } from 'react-bootstrap';
import { Link, useHistory } from "react-router-dom";
import Validation from './ValidationSignup';
import logo from '../../decentorage.png';
import axios from 'axios';
import url from '../../url';
import './Signup.css'

function Signup() {
    const history = useHistory();

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
            }).catch(error => {
                if(error.response.data) {
                    errors.signin = error.response.data;
                    seterrors(errors);
                }
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
                    signin(event);
                }).catch(error => {
                });
            } else {
                axios.post(url + '/storage/signup', {
                    username: values.username,
                    password: values.password,
                    wallet_address: values.walletAddress,
                    available_space: values.availableSpace
                }).then((response) => {
                }).catch(error => {
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
        <Card style={{ width: '25rem' }} className="signup-card">
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
                    <label>confirm password</label>
                    <input 
                    type="password" 
                    name="confirm"
                    value={values.confirm}
                    onChange={changeHandler}
                    className="input-style"
                    />
                    {errors.confirm && <p>{errors.confirm}</p>}
                </div>
                <div>
                    <label>wallet address</label>
                    <input 
                    type="text" 
                    name="walletAddress"
                    value={values.walletAddress}
                    onChange={changeHandler}
                    disabled={values.selection === "user"}
                    className="input-style"
                    />
                    {errors.password && <p>{errors.walletAddress}</p>}
                </div>
                <div>
                    <label>available space</label>
                    <input 
                    type="number" 
                    name="availableSpace"
                    value={values.availableSpace}
                    onChange={changeHandler}
                    disabled={values.selection === "user"}
                    className="input-style"
                    />
                    {errors.password && <p>{errors.availableSpace}</p>}
                </div>
                {values.selection === "user" && <p>do not need to fill wallet address and available as user sign up</p>}
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
                <input type="submit" value="sign up" className="btn btn-primary btn-lg buttons-style" />
                <p>if you have an account</p>
                <Link to="/" className="btn btn-primary btn-lg buttons-style">sign in</Link>
            </form>
        </Card>
        </>
    );
}

export default Signup;