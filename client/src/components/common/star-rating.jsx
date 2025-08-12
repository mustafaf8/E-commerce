import { StarIcon } from "lucide-react";

function StarRatingComponent({ rating, handleRatingChange, size = 18 }) {
  const starSize = size === 18 ? "w-4 h-4" : size === 24 ? "w-6 h-6" : "w-5 h-5 max-[640px]:w-4 max-[640px]:h-4";
  
  return [1, 2, 3, 4, 5].map((star) => (
    <button
      key={star}
      className={` rounded-full transition-colors ${
        star <= rating
          ? "text-yellow-500"
          : "text-gray-400 hover:bg-yellow-500 hover:text-white"
      }`}
      variant="ghost"
      size="icon"
      onClick={handleRatingChange ? () => handleRatingChange(star) : null}
    >
      <StarIcon
        className={`${starSize} ${
          star <= rating
            ? "fill-yellow-500 stroke-yellow-500"
            : "fill-gray-200 stroke-gray-300"
        }`}
        strokeWidth={1.2}
        aria-label={`${star} yıldız`}
      />
    </button>
  ));
}

export default StarRatingComponent;
