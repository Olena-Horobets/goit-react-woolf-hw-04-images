import s from './Searchbar.module.css';

import { Component } from 'react';

import Button from 'components/Button';

class SearchForm extends Component {
  state = {
    value: '',
  };

  handleInputChange = e => {
    this.setState({ value: e.currentTarget.value.toLowerCase() });
  };

  handleFormSubmit = e => {
    e.preventDefault();
    if (!this.state.value.trim().length) {
      this.props.notify('ENTER SOMETHING');
      this.resetInput();
      return;
    }
    this.props.onSubmit(this.state.value);
  };

  resetInput = () => {
    this.setState({ value: '' });
    this.props.onReset();
  };

  render() {
    return (
      <form
        className={s.searchForm}
        id="search-form"
        onSubmit={this.handleFormSubmit}
      >
        <input
          onChange={this.handleInputChange}
          value={this.state.value}
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
          disabled={!this.state.value.length}
          text="Search"
        />
        <Button
          className="search-form__btn--reset"
          type="button"
          disabled={!this.state.value}
          text="Reset"
          onClick={this.resetInput}
        />
      </form>
    );
  }
}

export default SearchForm;
