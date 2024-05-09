import { Component } from 'react';
import { photoFinder } from 'APIdataFetch';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './Header';
import SearchForm from './Searchbar';
import ImageGallery from './ImageGallery';
import Button from './Button';
// import { Modal } from './components/Modal/Modal';
// import { LoadingViev } from 'components/LoadingView/LoadingView';

const notify = message => toast.error(message);

const STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

export class App extends Component {
  state = {
    status: STATUS.IDLE,
    searchValue: '',
    images: [],
    modal: {
      isShown: false,
      imageUrl: '',
      alt: 'photo',
    },
  };

  componentDidUpdate(prevProps, prevState) {
    const prevValue = prevState.searchValue;
    const newValue = this.state.searchValue;

    if (prevValue !== newValue) {
      photoFinder.resetPage();
      if (newValue === '') {
        this.resetSearchData();
        return;
      }

      this.setState({ status: STATUS.PENDING });
      photoFinder
        .getFetchResponse(newValue)
        .then(response => {
          try {
            this.setState({ images: [...response] });
            this.setState({ status: STATUS.RESOLVED });
          } catch {
            throw Error;
          }
        })
        .catch(err => {
          console.log(err);
          notify(`Sorry, we couldn't find anything for you`);
          this.resetSearchData();
          this.setState({ status: STATUS.REJECTED });
        });
    }
  }

  // Methods for search handling
  onSearchSubmit = searchValue => {
    this.setState({ searchValue });
  };

  resetSearchData = () => {
    this.setState({
      searchValue: '',
      images: [],
      status: STATUS.IDLE,
    });
  };

  // Methods for components render
  defineMainContent = () => {
    const { status, images } = this.state;
    if (status === STATUS.IDLE) {
      return (
        <h2 className="reqest-message">...enter what are you looking for</h2>
      );
    }

    if (status === STATUS.PENDING) {
      // return <LoadingViev />;
      <p>loading</p>;
    }

    if (status === STATUS.RESOLVED) {
      return (
        <>
          <ImageGallery images={images} onCardClick={this.onGalleryCardClick} />
          {!this.isLastPage() && (
            <Button
              type="button"
              class="btn"
              text="Load more"
              onClick={this.onLoadMore}
            />
          )}
        </>
      );
    }

    if (status === STATUS.REJECTED) {
      return <div className="rejest-image"></div>;
    }
  };

  onLoadMore = () => {
    this.setState({ status: STATUS.PENDING });
    const { searchValue } = this.state;
    photoFinder.setNextPage();
    photoFinder
      .getFetchResponse(searchValue)
      .then(response => {
        this.setState(({ images }) => {
          return { images: [...images, ...response] };
        });
        try {
          this.setState({ status: STATUS.RESOLVED });
        } catch {
          throw Error;
        }
      })
      .catch(err => {
        notify(`Sorry, we couldn't find anything for you`);
        this.resetSearchData();
        this.setState({ status: STATUS.REJECTED });
      });
  };

  isLastPage = () => {
    return this.state.images.length < photoFinder.perPage;
  };

  // Methods for modal window
  onGalleryCardClick = e => {
    const url = e.currentTarget.getAttribute('datasrc');
    const alt = e.currentTarget.getAttribute('dataalt');
    this.toggleModal(url, alt);
  };

  toggleModal = (imageUrl = '', alt = 'photo') => {
    this.setState(({ modal }) => {
      return { modal: { isShown: !modal.isShown, imageUrl, alt } };
    });
  };

  render() {
    const { modal } = this.state;

    return (
      <div className={modal.isShown ? 'AppFixed' : 'App'} id="App">
        <ToastContainer theme="colored" icon={true} limit={1} />
        <Header />
        <div className="container">
          <SearchForm
            onSubmit={this.onSearchSubmit}
            notify={notify}
            onReset={this.resetSearchData}
          />
          {this.defineMainContent()}
        </div>
        {/* <Footer />
        {modal.isShown && (
          <Modal
            src={modal.imageUrl}
            alt={modal.alt}
            onModalClose={this.toggleModal}
          />
        )} */}
      </div>
    );
  }
}
