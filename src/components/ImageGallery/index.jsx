import s from './ImageGallery.module.css';

import { Component } from 'react';

import ImageGalleryItem from 'components/ImageGalleryItem';

class ImageGallery extends Component {
  render() {
    return (
      <ul className={s.gallery}>
        {this.props.images.map(el => {
          return (
            <ImageGalleryItem
              key={el.id}
              image={el}
              onCardClick={this.props.onCardClick}
            />
          );
        })}
      </ul>
    );
  }
}

export default ImageGallery;
