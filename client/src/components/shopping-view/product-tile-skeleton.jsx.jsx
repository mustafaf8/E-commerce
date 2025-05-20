import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

function ProductTileSkeleton() {
  return (
    <Card className="w-full max-w-sm mx-auto flex flex-col h-full overflow-hidden border">
      <Skeleton className="w-full h-[230px] sm:h-[230px] rounded-t-lg rounded-b-none" />
      <CardContent className="px-4 pt-1 pb-3 flex flex-col flex-grow space-y-2">
        <Skeleton className="h-5 w-4/5" />
        <div className="flex items-center mb-1">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-4 rounded-full ml-1" />
          <Skeleton className="h-4 w-4 rounded-full ml-1" />
          <Skeleton className="h-4 w-4 rounded-full ml-1" />
          <Skeleton className="h-4 w-4 rounded-full ml-1" />
          <Skeleton className="h-3 w-8 ml-2" />
        </div>
        <div className="mt-auto pt-1">
          <Skeleton className="h-5 w-1/2" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}

export default ProductTileSkeleton;
