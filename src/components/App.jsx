import { useState, useEffect } from 'react';
import { photoFinder } from 'services/APIdataFetch';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './Header';
import SearchForm from './Searchbar';
import ImageGallery from './ImageGallery';
import Button from './Button';
import Modal from './Modal';
import Loader from './Loader';

const notify = message => toast.error(message);

const STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

export function App() {
  const [status, setStatus] = useState(STATUS.IDLE);

  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);

  const [modal, setModal] = useState({
    isShown: false,
    imageUrl: '',
    alt: '',
  });

  useEffect(() => {
    if (!searchValue) {
      resetSearchData();
      return;
    } else {
      setStatus(STATUS.PENDING);

      photoFinder
        .getFetchResponse(searchValue, page)
        .then(response => {
          try {
            page === 1
              ? setImages(response)
              : setImages(prev => [...prev, ...response]);

            setStatus(STATUS.RESOLVED);
          } catch {
            throw Error;
          }
        })
        .catch(err => {
          notify(`Sorry, we couldn't find anything for you`);
          resetSearchData();
          setStatus(STATUS.REJECTED);
        });
    }
  }, [page, searchValue]);

  // Methods for search handling
  const onFormSubmit = newValue => {
    setSearchValue(newValue);
    setPage(1);
  };

  const resetSearchData = () => {
    setStatus(STATUS.IDLE);
    setSearchValue('');
    setImages([]);
  };

  // Methods for components render
  const isLastPage = () => {
    return images.length < photoFinder.perPage;
  };

  const defineMainContent = () => {
    switch (status) {
      case STATUS.IDLE:
        return (
          <h2 className="reqest-message">...enter what are you looking for</h2>
        );

      case STATUS.PENDING:
        return <Loader />;

      case STATUS.RESOLVED:
        return (
          <>
            <ImageGallery images={images} onCardClick={onGalleryCardClick} />
            {!isLastPage() && (
              <Button
                type="button"
                className="btn"
                text="Load more"
                onClick={() => {
                  setPage(prev => prev + 1);
                }}
              />
            )}
          </>
        );

      case STATUS.REJECTED:
        return <div className="reject-image"></div>;

      default:
        setStatus(STATUS.IDLE);
    }
  };

  // Methods for modal window
  const onGalleryCardClick = ({ url, alt }) => {
    toggleModal(url, alt);
  };

  const toggleModal = (imageUrl = '', alt = '') => {
    setModal(prev => ({ ...prev, isShown: !prev.isShown, imageUrl, alt }));
  };

  // RENDER ITSELF
  return (
    <div className={modal.isShown ? 'AppFixed' : 'App'} id="App">
      <ToastContainer theme="colored" icon={true} limit={1} />
      <Header />
      <div className="container">
        <SearchForm
          onSubmit={onFormSubmit}
          notify={toast.error}
          onReset={resetSearchData}
        />
        {defineMainContent()}
      </div>
      {modal.isShown && (
        <Modal
          src={modal.imageUrl}
          alt={modal.alt}
          onModalClose={toggleModal}
        />
      )}
    </div>
  );
}
