const Validation = (values) => {
    let errors = {};

    if(!values.username){
        errors.username="username is required"
    }

    if(!values.password){
        errors.password="password is required"
    } else if(values.password.length < 8){
        errors.password="Password must be more than 8 characters"
    }

    if(values.password !== values.confirm){
        errors.confirm="password with confirm password do not match"
    }

    if(values.selection === 'storage' && !values.availableSpace){
        errors.availableSpace="no available space specified"
    }

    if(values.selection === 'storage' && !values.walletAddress){
        errors.walletAddress="no wallet address specified"
    }

    return errors;
}

export default Validation;