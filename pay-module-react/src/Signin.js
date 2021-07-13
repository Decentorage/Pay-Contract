import {useState} from 'react';
import Validation from './ValidationSignin';

function Signin() {
    const [values, setvalues] = useState({
        username:"",
        password:"",
        selection:"user"
    });

    const [errors, seterrors] = useState({});

    const submitForm = (event) => {
        event.preventDefault();
        let stat = Validation(values);
        seterrors(stat);
        if(Object.keys(stat).length === 0){
            //call an API function
        }
    };

    const changeHandler = (event) => {
        setvalues({
            ...values,
            [event.target.name]: event.target.value
        })
    };

    return (
        <form>
            <div>
                <label>Username</label>
                <input 
                type="text" 
                name="username" 
                value={values.username}
                onChange={changeHandler}
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
            <button onClick={submitForm}>enter</button>
        </form>
    );
}

export default Signin;