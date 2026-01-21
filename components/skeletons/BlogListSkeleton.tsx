// components/blog/BlogListSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogListSkeleton() {
  return (
    <div className="min-h-screen bg-background pt-38">
      {/* Back Button Skeleton */}
      <div className="max-w-325 mx-auto pb-4">
        <Skeleton className="h-4 w-24" />
      </div>

      <div className="max-w-7xl bg-background mx-auto px-4 pb-8 md:pb-12">
        {/* Hero Section Skeleton */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          {/* Hero Post Skeleton */}
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="aspect-video rounded-2xl" />
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-32" />
          </div>

          {/* Featured Posts Skeleton */}
          <aside className="lg:col-span-1 space-y-2">
            <Skeleton className="h-6 w-48 mb-4" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3 py-3">
                <Skeleton className="w-14 h-14 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </aside>
        </section>

        {/* Recent Posts Section Skeleton */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Search Filter Skeleton */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-40" />
          </div>

          {/* Posts Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-video rounded-lg" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
