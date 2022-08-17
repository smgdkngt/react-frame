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
      setTimeout(()=> {
        let doc = new DOMParser().parseFromString(this.innerHTML, "text/html");
        let components = doc.documentElement.childNodes[1].childNodes;        
        let output = this.loopNodelist(components);

        console.log(output);
        this.innerHTML = `<div data-root></div>`;

        const container = this.querySelector('[data-root]');
        const root = ReactDOM.createRoot(container);

        root.render(
          <ChakraProvider theme={theme}>
            <Bridge contents={output} />
          </ChakraProvider>
        );        
      })
    }

    loopNodelist(collection) {
      let output = [];

      for (let i = 0; i < collection.length; i++) {
        output.push(this.objectFromNode(collection.item(i)));
      }

      return output;
    }

    objectFromNode(node) {
      if (node.localName) {
        let component = {
          type: 'component',
          component: this.handleName(node.localName),
          props: this.propsFromNode(node.attributes),
        }

        if (node.childNodes.length) {
          component.children = this.loopNodelist(node.childNodes);
        }
        
        return component;
      } else {
        return {
          type: 'text',
          text: node.textContent
        }
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