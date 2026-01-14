// app/(marketing)/blog/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogLoading() {
  return (
    <div className="container mx-auto px-4 pt-48 pb-28">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <Skeleton className="h-10 w-64 mx-auto mb-4" />
        <Skeleton className="h-1 w-16 mx-auto mb-6" />
        <Skeleton className="h-6 w-full mx-auto" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:px-28">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-card rounded-2xl overflow-hidden border border-border"
          >
            <Skeleton className="aspect-16/10 w-full" />
            <div className="p-6 space-y-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
