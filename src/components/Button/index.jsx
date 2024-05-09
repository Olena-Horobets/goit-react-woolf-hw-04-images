import s from './Button.module.css';

import { Component } from 'react';

class Button extends Component {
  render() {
    return (
      <button
        className={s[this.props.class]}
        type={this.props.type}
        disabled={this.props.disabled}
        onClick={this.props.onClick}
      >
        {this.props.text}
      </button>
    );
  }
}

export default Button;
