import React from 'react';
import { shallow, render, mount } from 'enzyme';
import Signin from './Signin';

describe('Signin', () => {
  let props;
  let shallowSignin;
  let renderedSignin;
  let mountedSignin;

  const shallowTestComponent = () => {
    if (!shallowSignin) {
      shallowSignin = shallow(<Signin {...props} />);
    }
    return shallowSignin;
  };

  const renderTestComponent = () => {
    if (!renderedSignin) {
      renderedSignin = render(<Signin {...props} />);
    }
    return renderedSignin;
  };

  const mountTestComponent = () => {
    if (!mountedSignin) {
      mountedSignin = mount(<Signin {...props} />);
    }
    return mountedSignin;
  };  

  beforeEach(() => {
    props = {};
    shallowSignin = undefined;
    renderedSignin = undefined;
    mountedSignin = undefined;
  });

  // Shallow / unit tests begin here
 
  // Render / mount / integration tests begin here
  
});
