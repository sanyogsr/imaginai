import { useEffect, useState } from "react";

// Define the type for the image card
interface ImageCard {
  id: number;
  title: string;
  bgColor: string;
}

// Array of image cards with background colors for aesthetics
const cardsData: ImageCard[] = [
  { id: 1, title: "Image 1", bgColor: "#FFB6C1" },
  { id: 2, title: "Image 2", bgColor: "#ADD8E6" },
  { id: 3, title: "Image 3", bgColor: "#FFD700" },
  { id: 4, title: "Image 4", bgColor: "#98FB98" },
  { id: 5, title: "Image 5", bgColor: "#DDA0DD" },
  { id: 6, title: "Image 6", bgColor: "#FFA07A" },
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
            className="min-w-[10rem] h-[10rem] rounded-xl shadow-lg flex items-center justify-center text-white text-lg font-semibold"
            style={{ backgroundColor: card.bgColor }}
          >
            {card.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollingProfileCarousel;
