import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { ChakraProvider, theme } from '@chakra-ui/react';
import Bridge from './Bridge';

customElements.define('react-frame',
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback(){
      let doc = new DOMParser().parseFromString(this.innerHTML, "text/html");
      let components = doc.documentElement.childNodes[1].childNodes;        
      let output = this.loopNodelist(components);
      
      this.innerHTML = `<div data-root></div>`;

      const container = this.querySelector('[data-root]');
      const root = ReactDOM.createRoot(container);

      root.render(
        <ChakraProvider theme={theme}>
          <Bridge contents={output} />
        </ChakraProvider>
      );        
    }

    loopNodelist(collection) {
      let output = [];

      for (let i = 0; i < collection.length; i++) {
        output.push(this.objectFromNode(collection.item(i)));
      }

      return output;
    }

    objectFromNode(node) {
      switch(node.nodeName){
        // text nodes
        case '#text':
          return {
            type: 'text',
            text: node.textContent
          }
        // skip html comments <!-- foobar -->
        case '#comment':
          return {}
        default:
          let props = this.propsFromNode(node.attributes);
          let name = this.handleName(node.localName);
          let component = {
            type: 'component',
            component: name,
          }
          
          if (Object.keys(props).length !== 0) {
            component.props = props;
          }

          if (node.childNodes.length) {
            component.children = this.loopNodelist(node.childNodes);
          }
          
          return component;
      }
    }

    propsFromNode(attributes) {
      let output = {};

      for (let i = 0; i < attributes.length; i++) {
        let attr = this.handleName(attributes[i].nodeName, false);
        if (attributes[i].nodeValue.startsWith('{')) {
          output[attr] = JSON.parse(attributes[i].nodeValue);
        } else {
          output[attr] = attributes[i].nodeValue;
        }
      }

      return output;
    }

    handleName(str, startWithCap = true) {
      let output = str;
      output = output.replace('rm-', '');

      if (startWithCap) {
        output = output.charAt(0).toUpperCase() + output.slice(1);
      }

      if (!str.startsWith('data-')) {
        output = output.split('-').reduce((a, b) => a + b.charAt(0).toUpperCase() + b.slice(1));
      }

      return output;
    }
  }
);