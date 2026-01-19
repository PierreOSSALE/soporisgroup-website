// components/skeletons/RealisationDetailSkeleton.tsx
"use client";

import { Separator } from "@radix-ui/react-select";
import { Skeleton } from "../ui/skeleton";
import { ChevronRight } from "lucide-react";

export default function RealisationDetailSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="pt-38 pb-4 bg-soporis-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2">
            <Skeleton className="h-4 w-20" />
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Skeleton className="h-4 w-24" />
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <section className="py-12 bg-background w-full lg:px-30">
        <div className="container mx-auto px-4">
          {/* Back button & Badge */}
          <div className="flex items-center gap-2 my-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>

          {/* Title */}
          <Skeleton className="h-12 w-3/4 mb-4" />

          {/* Subtitle */}
          <Skeleton className="h-6 w-full max-w-2xl mb-8" />

          {/* Project Meta */}
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>

          {/* Main Image Skeleton */}
          <div className="relative rounded-2xl overflow-hidden aspect-video mb-12 bg-gray-200" />
        </div>
      </section>

      {/* Content Section Skeleton */}
      <section className="py-12 bg-soporis-gray w-full lg:px-30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content Skeleton */}
            <div className="lg:col-span-2 space-y-12">
              {/* Description Skeleton */}
              <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              {/* Challenges Skeleton */}
              <div className="space-y-4">
                <Skeleton className="h-8 w-32" />
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Solutions Skeleton */}
              <div className="space-y-4">
                <Skeleton className="h-8 w-36" />
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Skeleton className="h-5 w-5" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Screenshots Skeleton */}
              <div className="space-y-8">
                <Skeleton className="h-8 w-40" />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-3">
                    <div className="relative aspect-video bg-gray-200 rounded-xl" />
                    <Skeleton className="h-4 w-48 mx-auto" />
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="space-y-8">
              {/* Client Info Skeleton */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i}>
                      <Skeleton className="h-3 w-16 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies Skeleton */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <Skeleton className="h-6 w-36 mb-4" />
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-6 w-16 rounded-full" />
                  ))}
                </div>
              </div>

              {/* Results Skeleton */}
              <div className="bg-primary rounded-2xl p-6">
                <Skeleton className="h-6 w-28 mb-4 bg-white/20" />
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Skeleton className="h-5 w-5 bg-white/30" />
                      <Skeleton className="h-4 w-full bg-white/20" />
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Skeleton */}
              <div className="bg-card rounded-2xl p-6 border border-border text-center">
                <Skeleton className="h-6 w-48 mx-auto mb-2" />
                <Skeleton className="h-3 w-56 mx-auto mb-4" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section Skeleton */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Skeleton className="h-12 w-12 rounded-full mx-auto" />
            <Skeleton className="h-6 w-full max-w-xl mx-auto" />
            <Skeleton className="h-6 w-full max-w-md mx-auto" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 mx-auto" />
              <Skeleton className="h-3 w-24 mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Skeleton */}
      <section className="bg-soporis-gray">
        <Separator className="mb-8" />
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full lg:px-30">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-48" />
          </div>
        </div>
        <Separator className="mt-8" />
      </section>
    </div>
  );
}
