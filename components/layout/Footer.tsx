"use client";

import { Facebook, Instagram, Linkedin, Mail } from "lucide-react";
import logo from "@/public/img/logo-soporis.png";
import Link from "next/link";
import Image from "next/image";
import { Route } from "next";
import { Separator } from "@/components/ui/separator";
import { BsWhatsapp } from "react-icons/bs";

const navigation = [
  { name: "À propos", href: "/a-propos" },
  { name: "Nos services", href: "/services" },
  { name: "Nos réalisations", href: "/realisations" },
  { name: "Packs & Offres", href: "/packs" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

const services = [
  { name: "UI/UX Design", href: "/services#ui-ux" },
  { name: "Développement Web", href: "/services#dev-web" },
  { name: "Performance & Conversion", href: "/services#performance" },
];

const legal = [
  { name: "Mentions légales", href: "/mentions-legales" },
  { name: "Politique de confidentialité", href: "/politique-confidentialite" },
];

const socials = [
  { name: "whatsapp", icon: BsWhatsapp, href: "#" },
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
];

export function Footer() {
  const handleMailClick = () => {
    window.location.href = "mailto:lcrpeter7@gmail.com";
  };

  return (
    <footer className="bg-soporis-gray ">
      <div className="container mx-auto px-4 pt-12 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 max-w-7xl mx-auto">
          {/* Logo & Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <Link
              href="/"
              className="group inline-block transition-transform duration-300 hover:scale-105"
            >
              <Image
                src={logo}
                alt="Soporis Group"
                className="h-8.5 w-auto opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </Link>

            <p className="text-muted-foreground text-sm max-w-sm">
              Solutions Web et UI/UX pour transformer vos idées en expériences
              digitales performantes.
            </p>
            <div className="space-y-3">
              <button
                onClick={handleMailClick}
                className="flex items-center gap-3 text-muted-foreground hover:text-soporis-gold-light transition-colors border-none bg-transparent p-0 cursor-pointer"
              >
                <Mail className="h-4 w-4" />
                <span className="text-sm">contact@soporisgroup.com</span>
              </button>
            </div>
            {/* Social Links */}
            <div className="flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={`${social.href}`}
                  className="p-2.5 rounded-full bg-card text-chart-3 hover:text-soporis-gold "
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display text-lg font-semibold text-primary mb-6">
              Navigation
            </h4>
            <ul className="space-y-3">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={`${item.href}` as Route}
                    className="text-sm text-muted-foreground hover:text-soporis-gold-light transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-lg font-semibold text-primary mb-6">
              Nos Services
            </h4>
            <ul className="space-y-3">
              {services.map((item) => (
                <li key={item.name}>
                  <Link
                    href={`${item.href}` as Route}
                    className="text-sm text-muted-foreground hover:text-soporis-gold-light transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display text-lg font-semibold text-primary mb-6">
              Informations
            </h4>
            <ul className="space-y-3">
              {legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={`${item.href}` as Route}
                    className="text-sm text-muted-foreground hover:text-soporis-gold-light transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={"/rendez-vous" as Route}
                  className="text-sm text-muted-foreground hover:text-soporis-gold-light transition-colors"
                >
                  Prendre rendez-vous
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 mb-4 max-w-7xl mx-auto">
          <Separator className="mb-8" />
          <div className="flex flex-col items-center gap-4">
            <p className="mx-auto text-sm text-muted-foreground">
              © {new Date().getFullYear()}{" "}
              <span className="font-semibold text-primary">Soporis Group</span>.
              Tous droits réservés.
            </p>
            <p className="text-[14px] text-muted-foreground ">
              Conçu par{" "}
              <a
                href="https://www.soporisgroup.com"
                className="text-primary hover:text-soporis-gold-light transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Soporis-Group
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
