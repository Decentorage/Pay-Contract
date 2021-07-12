import React from 'react';
import PropTypes from 'prop-types';
import styles from './Signin.scss';

const Signin = props => (
	<div>This is a component called Signin.</div>
);

// todo: Unless you need to use lifecycle methods or local state,
// write your component in functional form as above and delete
// this section. 
// class Signin extends React.Component {
//   render() {
//     return <div>This is a component called Signin.</div>;
//   }
// }

const SigninPropTypes = {
	// always use prop types!
};

Signin.propTypes = SigninPropTypes;

export default Signin;
