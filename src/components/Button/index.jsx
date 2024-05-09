import s from './Button.module.css';

function Button({ className, type, disabled, onClick, text }) {
  return (
    <button
      className={s[className]}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default Button;
