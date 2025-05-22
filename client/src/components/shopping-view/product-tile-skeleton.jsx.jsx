import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

function ProductTileSkeleton() {
  return (
    <Card className="shop-product-card h-full">
      <div className="relative">
        {/* Image skeleton */}
        <div className="bg-secondary/20 p-2">
          <Skeleton className="w-full h-[140px] sm:h-[160px] md:h-[180px] rounded-md" />
        </div>
        
        {/* Content skeleton */}
        <CardContent className="p-3 space-y-2.5">
          <Skeleton className="h-4 w-4/5" />
          
          {/* Rating skeleton */}
          <div className="flex items-center space-x-1">
            <div className="flex gap-0.5">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-3 rounded-full" />
            </div>
            <Skeleton className="h-3 w-6 ml-1" />
          </div>
          
          {/* Price skeleton */}
          <div className="pt-1">
            <Skeleton className="h-5 w-20" />
          </div>
        </CardContent>
      </div>
      
      {/* Button skeleton */}
      <CardFooter className="p-3 pt-0">
        <Skeleton className="h-9 w-full rounded-md" />
      </CardFooter>
    </Card>
  );
}

export default ProductTileSkeleton;
