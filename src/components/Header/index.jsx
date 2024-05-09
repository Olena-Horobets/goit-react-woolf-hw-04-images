import s from './Header.module.css';

import { Component } from 'react';
import { ReactComponent as ReactSprite } from 'images/svg/sprite.svg';

class Header extends Component {
  render() {
    return (
      <header className={s.header}>
        <ReactSprite />
        <a href="#App" className={s.logo}>
          <svg width="60" height="60">
            <use href="#icon-logo"></use>
          </svg>
        </a>

        <h1 className={s.header__title}>Perfect image finder</h1>
      </header>
    );
  }
}

export default Header;
