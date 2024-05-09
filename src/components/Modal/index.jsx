import s from './Modal.module.css';

import { createPortal } from 'react-dom';
import { Component } from 'react';
import { ReactComponent as ReactSprite } from 'images/svg/sprite.svg';

const modalRoot = document.querySelector('#modal-root');

class Modal extends Component {
  componentDidMount() {
    window.addEventListener('keydown', this.onEscapePress);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onEscapePress);
  }

  onEscapePress = e => {
    return e.code !== 'Escape' ? null : this.props.onModalClose();
  };

  onBackdropClick = e => {
    return e.target !== e.currentTarget ? null : this.props.onModalClose();
  };

  render() {
    return createPortal(
      <div className={s.lightbox}>
        <ReactSprite />
        <div
          className={s.lightbox__overlay}
          onClick={this.onBackdropClick}
        ></div>
        <div className={s.lightbox__content}>
          <img
            className={s.lightbox__image}
            src={this.props.src}
            alt={this.props.alt}
          />
          <div className={s.lightbox__info}>
            <button
              type="button"
              className={s.lightbox__buttonClose}
              onClick={this.props.onModalClose}
              aria-label="close Modal Window"
            >
              <svg className={s.icon} width="32" height="32">
                <use href="#icon-close"></use>
              </svg>
            </button>
          </div>
        </div>
      </div>,
      modalRoot
    );
  }
}

export default Modal;
