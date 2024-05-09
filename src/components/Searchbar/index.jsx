import s from './Searchbar.module.css';

import { useState } from 'react';

import Button from 'components/Button';

function SearchForm({ notify, onSubmit, onReset }) {
  const [value, setValue] = useState('');

  const handleInputChange = e => {
    setValue(e.currentTarget.value.toLowerCase());
  };

  const resetInput = () => {
    setValue('');
    onReset();
  };

  const handleFormSubmit = e => {
    e.preventDefault();
    if (!value.trim().length) {
      notify('ENTER SOMETHING');
      resetInput();
      return;
    }
    onSubmit(value);
  };

  return (
    <form className={s.searchForm} id="search-form" onSubmit={handleFormSubmit}>
      <input
        onChange={handleInputChange}
        value={value}
        className={s.searchForm__input}
        type="text"
        name="query"
        autoComplete="off"
        autoFocus={true}
        placeholder="Search images..."
        aria-label="Search images"
      />
      <Button
        className="search-form__btn"
        type="submit"
        disabled={!value.length}
        text="Search"
      />
      <Button
        className="search-form__btn--reset"
        type="button"
        disabled={!value}
        text="Reset"
        onClick={resetInput}
      />
    </form>
  );
}

export default SearchForm;
