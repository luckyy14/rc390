import React from 'react';
import { ParallaxProvider } from 'react-scroll-parallax';
import ParallaxCard from './ParallaxCard';
import sky1 from '../assets/gifs/sky.png';
import mountain1 from '../assets/gifs/mountain.png';

const cards = [
  {
    title: 'Left Card',
    layers: [
      { src: sky1, speed: -10, zIndex: 1, centerYOffset:-50,},
      { src: mountain1, speed: -15, zIndex: 2,centerYOffset:-50 },
    ],
    zoomOnScroll: false,
  },
//   {
//     title: 'Center Card',
//     layers: [
//       { src: sky2, speed: -8, zIndex: 1 },
//       { src: mountain2, speed: -15, zIndex: 2 },
//     ],
//     zoomOnScroll: true,
//   },
//   {
//     title: 'Right Card',
//     layers: [
//       { src: sky3, speed: -12, zIndex: 1 },
//       { src: mountain3, speed: -18, zIndex: 2 },
//     ],
//     zoomOnScroll: false,
//   },
];

export default function ParallaxCardsContainer() {
  return (
    <ParallaxProvider>
      <div className="flex flex-row justify-center items-center gap-8 py-16">
        {cards.map((card, i) => (
          <ParallaxCard
            key={i}
            layers={card.layers}
            title={card.title}
            zoomOnScroll={card.zoomOnScroll}
            width={350}
            height={400}
          />
        ))}
      </div>
    </ParallaxProvider>
  );
} 