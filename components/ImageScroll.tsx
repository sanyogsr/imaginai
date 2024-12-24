// import { useEffect, useState } from "react";
// import Image from "next/image";
// import img1 from "../assets/images/1.png";
// import img2 from "../assets/images/2.png";
// import img3 from "../assets/images/3.png";
// import img4 from "../assets/images/4.png";
// import img5 from "../assets/images/5.png";
// import img6 from "../assets/images/6.png";
// import { StaticImageData } from "next/image";
// // Define the type for the image card
// interface ImageCard {
//   id: number;
//   title: string;
//   bgColor: string;
//   url: StaticImageData;
// }

// // Array of image cards with background colors for aesthetics
// const cardsData: ImageCard[] = [
//   {
//     id: 1,
//     title: "Image 1",
//     bgColor: "#FFB6C1",
//     url: img1,
//   },
//   {
//     id: 2,
//     title: "Image 2",
//     bgColor: "#ADD8E6",
//     url: img2,
//   },
//   {
//     id: 3,
//     title: "Image 3",
//     bgColor: "#FFD700",
//     url: img3,
//   },
//   {
//     id: 4,
//     title: "Image 4",
//     bgColor: "#98FB98",
//     url: img4,
//   },
//   {
//     id: 5,
//     title: "Image 5",
//     bgColor: "#DDA0DD",
//     url: img5,
//   },
//   {
//     id: 6,
//     title: "Image 6",
//     bgColor: "#FFA07A",
//     url: img6,
//   },
// ];

// const ScrollingProfileCarousel = () => {
//   const [cards, setCards] = useState<ImageCard[]>([]);

//   useEffect(() => {
//     // Duplicate cards to create a seamless scrolling effect
//     setCards([...cardsData, ...cardsData]);
//   }, []);

//   return (
//     <div className="w-full overflow-hidden py-10">
//       <div className="carousel-container flex animate-scroll gap-6">
//         {cards.map((card, index) => (
//           <div
//             key={`${card.id}-${index}`}
//             className="min-w-[10rem] h-[10rem] rounded-xl shadow-lg flex   text-white text-lg font-semibold"
//             style={{ backgroundColor: card.bgColor }}
//           >
//             {/* {card.title} */}
//             <Image
//               src={card.url}
//               alt="kjxk"
//               width={250}
//               height={250}
//               className="rounded-xl"
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ScrollingProfileCarousel;

import React from "react";
import img1 from "../assets/images/1.png";
import img2 from "../assets/images/2.png";
import img3 from "../assets/images/3.png";
import img4 from "../assets/images/4.png";
import img5 from "../assets/images/5.png";
import img6 from "../assets/images/6.png";
import Image from "next/image";
const ScatteredThumbnails = () => {
  const thumbnails = [
    {
      id: 1,
      title: "Minecraft In Real Life",
      views: "500,000+ views",
      position: "left-4 top-0",
      width: "w-40",
      url: img1,
    },
    {
      id: 2,
      title: "TRAIN Yourself Like Ayanokoji",
      views: "800,000+ views",
      position: "left-4 top-48",
      width: "w-52",
      url: img2,
    },
    {
      id: 3,
      title: "Study like Pro",
      views: "300,000+ views",
      position: "left-4 top-96",
      width: "w-46",
      url: img3,
    },
    {
      id: 4,
      title: "People Are Scared of AI",
      views: "600,000+ views",
      position: "right-4 top-0",
      width: "w-44",
      url: img4,
    },
    {
      id: 5,
      title: "Survive In The Wilderness and Win",
      views: "200,000+ views",
      position: "right-4 top-48",
      width: "w-52",
      url: img5,
    },
    {
      id: 6,
      title: "100 Hour Minecraft",
      views: "400,000+ views",
      position: "right-4 top-96",
      width: "w-56",
      url: img6,
    },
  ];

  return (
    <div className="relative w-full h-[32rem] max-w-6xl mx-auto">
      {thumbnails.map((thumb) => (
        <div
          key={thumb.id}
          className={`absolute ${thumb.position} ${thumb.width} transform transition-all duration-300 hover:scale-105`}
        >
          <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
            <div className="relative">
              <Image
                src={thumb.url}
                alt={thumb.title}
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="p-3">
              <h3 className="text-white font-medium text-sm mb-1">
                {thumb.title}
              </h3>
              <p className="text-gray-400 text-xs">{thumb.views}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScatteredThumbnails;
