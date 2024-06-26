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
  const [isLastPage, setIsLastPage] = useState(false);
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
        .then(({ hits, totalHits }) => {
          try {
            if (!hits.length) {
              resetSearchData();
              notify(`Sorry, we couldn't find anything for you`);
            }
            if (page === 1) {
              setImages(hits);
            } else {
              setImages(prev => [...prev, ...hits]);
            }

            setStatus(STATUS.RESOLVED);
            setIsLastPage(Math.ceil(totalHits / 12) === page);
          } catch {
            throw Error;
          }
        })
        .catch(err => {
          notify(`Sorry, we couldn't find anything for you`);
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
    setPage(1);
    setIsLastPage(false);
  };

  // Methods for components render
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
            {!isLastPage && (
              <Button
                type="button"
                className="btn"
                text="Load more"
                onClick={() => setPage(prev => prev + 1)}
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
  const onGalleryCardClick = ({ url, alt }) => toggleModal(url, alt);

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
