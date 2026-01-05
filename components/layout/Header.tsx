"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Route } from "next";
import { ThemeToggle } from "@/components/ThemeToggle";
import logo from "@/public/img/logo-soporis.png";
import Image from "next/image";

const navItems = [
  { name: "À propos", href: "/a-propos" },
  { name: "Nos services", href: "/services" },
  { name: "Nos réalisations", href: "/realisations" },
  { name: "Packs & Offres", href: "/packs" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed z-100 top-5 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl">
      <div
        className={`relative px-4 sm:px-6 lg:px-8  ${
          scrolled || isMenuOpen
            ? "bg-card/90 backdrop-blur-md shadow-navbar"
            : "bg-card shadow-navbar"
        } ${isMenuOpen ? "rounded-t-2xl" : "rounded-full"}`}
      >
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src={logo}
              alt="Soporis Group"
              className="h-9 w-auto object-contain"
              priority
            />
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href as Route}
                className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-full
                  after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-1
                  after:h-0.5 after:w-0 hover:after:bg-primary after:rounded-full
                  after:transition-all after:duration-300 after:ease-in-out
                  hover:after:w-[70%]
                  ${
                    pathname === item.href
                      ? "text-primary after:w-[70%]"
                      : "text-muted-foreground hover:text-primary"
                  }
                `}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA et Menu Mobile */}
          <div className="flex items-center gap-2">
            {/* <ThemeToggle /> */}

            {!isMenuOpen && (
              <Link href={"/rendez-vous" as Route}>
                <Button
                  variant="nav"
                  size="default"
                  className="rounded-full cursor-pointer animate-in fade-in duration-300"
                >
                  Rendez-vous
                </Button>
              </Link>
            )}

            {/* Bouton Menu Mobile */}
            <button
              className="lg:hidden p-2 rounded-full hover:bg-secondary transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-primary cursor-pointer" />
              ) : (
                <Menu className="h-8 w-8 text-primary cursor-pointer" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MENU MOBILE */}
      {isMenuOpen && (
        <nav className="lg:hidden absolute top-full left-0 w-full animate-in fade-in slide-in-from-top-2 duration-300  p-6 bg-card/95 backdrop-blur-xl shadow border-y border-border/50 rounded-b-2xl space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href as Route}
              className={`block px-5 py-4 text-base font-medium rounded-2xl transition-colors cursor-pointer ${
                pathname === item.href
                  ? "text-primary bg-secondary"
                  : "text-muted-foreground hover:text-primary hover:bg-secondary/40"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          <div className="pt-4 px-2">
            <Link
              href={"/rendez-vous" as Route}
              onClick={() => setIsMenuOpen(false)}
            >
              <Button
                variant="nav"
                className="w-full h-14 text-base rounded-full shadow-button cursor-pointer"
              >
                Rendez-vous
              </Button>
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
