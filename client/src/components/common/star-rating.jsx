import { StarIcon } from "lucide-react";

function StarRatingComponent({ rating, handleRatingChange }) {
  // console.log(rating, "rating star");
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
        className={`w-5 h-5 max-[640px]:w-4 max-[640px]:h-4 ${
          // Boyut
          star <= rating
            ? "fill-yellow-500 stroke-yellow-500"
            : "fill-transparent"
        }`}
        strokeWidth={1.2}
      />
    </button>
  ));
}

export default StarRatingComponent;
