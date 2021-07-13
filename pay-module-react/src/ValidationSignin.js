const Validation = (values) => {
    let errors = {};

    if(!values.username){
        errors.username="username is required"
    }

    if(!values.password){
        errors.password="password is required"
    }

    return errors;
}

export default Validation;