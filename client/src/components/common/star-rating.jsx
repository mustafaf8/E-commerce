import { StarIcon } from "lucide-react";
import { Button } from "../ui/button";

function StarRatingComponent({ rating, handleRatingChange }) {
  // console.log(rating, "rating star");

  return [1, 2, 3, 4, 5].map((star) => (
    <Button
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
        className={`w-5 h-5 ${
          // Boyut
          star <= rating
            ? "fill-yellow-500 stroke-yellow-500" // Seçiliyse: içi ve kenarlığı sarı
            : "fill-transparent" // Seçili değilse: içi transparan (sadece kenarlık görünür)
        }`}
        strokeWidth={1.7} // Kenarlık kalınlığını ayarla (1, 1.5, 2 gibi değerler deneyebilirsin)
      />
    </Button>
  ));
}

export default StarRatingComponent;
