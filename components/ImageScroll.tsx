import { useEffect, useState } from "react";
import Image from "next/image";
import img1 from "../assets/images/1.png";
import img2 from "../assets/images/2.png";
import img3 from "../assets/images/3.png";
import img4 from "../assets/images/4.png";
import img5 from "../assets/images/5.png";
import img6 from "../assets/images/6.png";
import { StaticImageData } from "next/image";
// Define the type for the image card
interface ImageCard {
  id: number;
  title: string;
  bgColor: string;
  url: StaticImageData;
}

// Array of image cards with background colors for aesthetics
const cardsData: ImageCard[] = [
  {
    id: 1,
    title: "Image 1",
    bgColor: "#FFB6C1",
    url: img1,
  },
  {
    id: 2,
    title: "Image 2",
    bgColor: "#ADD8E6",
    url: img2,
  },
  {
    id: 3,
    title: "Image 3",
    bgColor: "#FFD700",
    url: img3,
  },
  {
    id: 4,
    title: "Image 4",
    bgColor: "#98FB98",
    url: img4,
  },
  {
    id: 5,
    title: "Image 5",
    bgColor: "#DDA0DD",
    url: img5,
  },
  {
    id: 6,
    title: "Image 6",
    bgColor: "#FFA07A",
    url: img6,
  },
];

const ScrollingProfileCarousel = () => {
  const [cards, setCards] = useState<ImageCard[]>([]);

  useEffect(() => {
    // Duplicate cards to create a seamless scrolling effect
    setCards([...cardsData, ...cardsData]);
  }, []);

  return (
    <div className="w-full overflow-hidden py-10">
      <div className="carousel-container flex animate-scroll gap-6">
        {cards.map((card, index) => (
          <div
            key={`${card.id}-${index}`}
            className="min-w-[10rem] h-[10rem] rounded-xl shadow-lg flex   text-white text-lg font-semibold"
            style={{ backgroundColor: card.bgColor }}
          >
            {/* {card.title} */}
            <Image
              src={card.url}
              alt="kjxk"
              width={250}
              height={250}
              className="rounded-xl"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollingProfileCarousel;
