import s from './ImageGallery.module.css';

import ImageGalleryItem from 'components/ImageGalleryItem';

function ImageGallery({ images, onCardClick }) {
  return (
    <ul className={s.gallery}>
      {images.map(el => {
        return (
          <ImageGalleryItem key={el.id} image={el} onCardClick={onCardClick} />
        );
      })}
    </ul>
  );
}

export default ImageGallery;
