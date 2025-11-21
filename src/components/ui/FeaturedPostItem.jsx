import React from 'react';
import Image from 'next/image';

const FeaturedPostItem = ({ item }) => (
  <a
    href={item.url}
    target='_blank'
    rel='noopener noreferrer'
    className='relative block overflow-hidden rounded-lg shadow-md card-hover featured-post-item website-item'
  >
    <div className='relative w-full h-64'>
      <Image
        src={item.image}
        alt={item.title}
        fill
        className='object-cover'
        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
      />
    </div>
    <div
      className={`absolute inset-0 ${item.overlayColor} ${item.overlayOpacity} card-overlay transition-all duration-300 flex flex-col p-6`}
    >
      <div>
        <h3 className='text-white text-xl font-bold mb-2'>{item.title}</h3>
        <p className='text-white text-sm opacity-0 transition-opacity duration-300 website-description-text transform translate-y-2 transition-transform duration-300'>
          {item.description}
        </p>
      </div>
    </div>
  </a>
);

export default FeaturedPostItem;
