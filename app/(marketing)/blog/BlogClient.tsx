// app/(marketing)/blog/BlogClient.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import HeroPost from "@/components/features/blog/HeroPost";
import FeaturedPostItem from "@/components/features/blog/FeaturedPostItem";
import BlogCard from "@/components/features/blog/BlogCard";
import SearchFilter from "@/components/features/blog/SearchFilter";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const POSTS_PER_PAGE = 6;

interface BlogClientProps {
  initialPosts: any[];
  categories: string[];
}

export default function BlogClient({
  initialPosts,
  categories,
}: BlogClientProps) {
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const featuredPost = initialPosts[0];
  const otherFeaturedPosts = initialPosts.slice(1, 4);

  const {
    posts: recentPosts,
    totalPages,
    total,
  } = useMemo(() => {
    let filtered = initialPosts;

    if (searchTerm && searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          post.excerpt.toLowerCase().includes(searchLower),
      );
    }

    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    const start = (currentPage - 1) * POSTS_PER_PAGE;
    const end = start + POSTS_PER_PAGE;

    return {
      posts: filtered.slice(start, end),
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / POSTS_PER_PAGE),
    };
  }, [currentPage, searchTerm, selectedCategory, initialPosts]);

  // Simuler un chargement rapide pour les filtres
  useEffect(() => {
    if (searchTerm || selectedCategory !== "all") {
      setIsFilterLoading(true);
      const timer = setTimeout(() => {
        setIsFilterLoading(false);
      }, 300); // Court délai pour éviter le clignotement

      return () => clearTimeout(timer);
    }
  }, [searchTerm, selectedCategory]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={currentPage === i}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }
    } else {
      // ... logique de pagination inchangée
    }

    return items;
  };

  return (
    <div className="min-h-screen bg-background pt-38">
      {/* Back Button */}
      <div className="max-w-325 mx-auto pb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Accueil
        </Link>
      </div>

      <div className="max-w-7xl bg-background mx-auto px-4 pb-8 md:pb-12">
        {/* Hero Section */}
        {featuredPost && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
            <div className="lg:col-span-2">
              <HeroPost post={featuredPost} />
            </div>

            <aside className="lg:col-span-1">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Autres articles populaires
              </h2>
              <div className="space-y-1">
                {otherFeaturedPosts.map((post) => (
                  <FeaturedPostItem key={post.id} post={post} />
                ))}
              </div>
            </aside>
          </section>
        )}

        {/* Recent Posts Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-foreground">
              Articles récents
            </h2>
            {!isFilterLoading && total > 0 && (
              <span className="text-sm text-muted-foreground">
                {total} article{total > 1 ? "s" : ""} trouvé
                {total > 1 ? "s" : ""}
              </span>
            )}
          </div>

          <SearchFilter
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            categories={categories}
          />

          {isFilterLoading ? (
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
          ) : recentPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1)
                              handlePageChange(currentPage - 1);
                          }}
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>

                      {renderPaginationItems()}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages)
                              handlePageChange(currentPage + 1);
                          }}
                          className={
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                Aucun article trouvé pour cette recherche.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
