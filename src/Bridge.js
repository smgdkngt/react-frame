import React, {useRef} from 'react';
import * as chakra from '@chakra-ui/react';

const Bridge = ({contents}) => {

  const CreateComponentArray = (components) => {
    const output = [];
    const eleRef = useRef();
    
    if (!Array.isArray(window.reactFrame)) {
      window.reactFrame = [];
    }

    if (components) {
      components.map((item, i) => {
        if (item.type == 'text') {  
          output.push(item.text);
        } else if (item.type == 'component') {
          const ToRender = chakra[item.component];
          if (item.children) {
            output.push(<ToRender ref={eleRef} key={i} {...item.props}>
              {CreateComponentArray(item.children)}
            </ToRender>);

            window.reactFrame.push(eleRef);
          } else {
            output.push(<ToRender key={i} {...item.props} />);
          }
        }
      });
    }

    return output;
  }

  return <>{CreateComponentArray(contents)}</>;
};

Bridge.propTypes = {};
Bridge.defaultProps = {};

export default Bridge;
