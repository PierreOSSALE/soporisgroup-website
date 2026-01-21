// components/blog/BlogDetailSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function BlogDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Back Button Skeleton */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour
        </Link>
      </div>

      {/* Article Header Skeleton */}
      <header className="text-center max-w-3xl mx-auto px-4 pb-8">
        <div className="flex justify-center mb-4">
          <Skeleton className="h-6 w-32 rounded-full" />
        </div>
        <Skeleton className="h-12 w-3/4 mx-auto mb-6" />
        <div className="flex items-center justify-center gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-32" />
        </div>
      </header>

      {/* Hero Image Skeleton */}
      <div className="max-w-5xl mx-auto px-4 mb-12">
        <Skeleton className="w-full aspect-2/1 rounded-2xl" />
      </div>

      {/* Content Layout Skeleton */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar Skeleton */}
          <aside className="lg:col-span-3 order-2 lg:order-1">
            <div className="sticky top-38 space-y-8">
              <div className="space-y-4">
                <Skeleton className="h-6 w-40" />
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
              <div className="space-y-3">
                <Skeleton className="h-6 w-32" />
                <div className="flex gap-2">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-8 w-8 rounded-md" />
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Article Content Skeleton */}
          <article className="lg:col-span-9 order-1 lg:order-2">
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
              <Skeleton className="h-64 w-full" />
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>

            {/* Comments Section Skeleton */}
            <div className="mt-12 space-y-4">
              <Skeleton className="h-8 w-40" />
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24 mt-1" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>

      {/* Recommended Articles Skeleton */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-video rounded-lg" />
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
