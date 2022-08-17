import React from 'react';
import * as chakra from '@chakra-ui/react';

const Bridge = ({contents}) => {
  const createComponentArray = (components) => {
    const output = [];

    if (components) {
      components.map(item => {
        if (item.type == 'text') {  
          output.push(item.text);
        } else if (item.type == 'component') {
          const ToRender = chakra[item.component];

          if (item.children) {
            output.push(<ToRender {...item.props}>
              {createComponentArray(item.children)}
            </ToRender>);
          } else {
            output.push(<ToRender {...item.props} />);
          }
        }
      });
    }

    return output;
  }

  return <>{createComponentArray(contents)}</>;
};

Bridge.propTypes = {};
Bridge.defaultProps = {};

export default Bridge;
