/** @jsxImportSource react */
import { qwikify$ } from '@builder.io/qwik-react';
import React, {Component} from 'react'

export class Car extends Component {
    render() {
      return <h2>Hi, I am a Car!</h2>;
    }
}

export const CarFn = () => (<div>This is from Car</div>)
export const QwikifyCar = qwikify$(CarFn);