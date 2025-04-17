import { StarIcon } from "lucide-react";
import { Button } from "../ui/button";

function StarRatingComponent({ rating, handleRatingChange }) {
  console.log(rating, "rating star");

  return [1, 2, 3, 4, 5].map((star) => (
    <Button
      key={star}
      className={` rounded-full transition-colors ${
        star <= rating
          ? "text-yellow-500"
          : "text-black  hover:bg-yellow-500 hover:text-white"
      }`}
      variant="ghost"
      size="icon"
      onClick={handleRatingChange ? () => handleRatingChange(star) : null}
    >
      <StarIcon
        className={`w-5 h-5 ${star <= rating ? "fill-yellow-500" : ""}`}
      />
    </Button>
  ));
}

export default StarRatingComponent;
