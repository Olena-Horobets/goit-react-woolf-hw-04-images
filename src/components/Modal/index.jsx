import s from './Modal.module.css';

import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import { ReactComponent as ReactSprite } from 'images/svg/sprite.svg';

const modalRoot = document.querySelector('#modal-root');

function Modal({ alt, src, onModalClose }) {
  useEffect(() => {
    const onEscapePress = e => {
      return e.code !== 'Escape' ? null : onModalClose();
    };

    window.addEventListener('keydown', onEscapePress);

    return () => {
      window.removeEventListener('keydown', onEscapePress);
    };
  }, [onModalClose]);

  const onBackdropClick = e => {
    return e.target !== e.currentTarget ? null : onModalClose();
  };

  return createPortal(
    <div className={s.lightbox}>
      <ReactSprite />
      <div className={s.lightbox__overlay} onClick={onBackdropClick}></div>
      <div className={s.lightbox__content}>
        <img className={s.lightbox__image} src={src} alt={alt} />
        <div className={s.lightbox__info}>
          <button
            type="button"
            className={s.lightbox__buttonClose}
            onClick={onModalClose}
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

export default Modal;
