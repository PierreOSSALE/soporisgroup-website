import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import heroBg from "@/public/img/hero-bg.jpg";
import Link from "next/link";
import { Route } from "next";
import Image from "next/image";

const highlights = ["UI/UX Design", "Développement Web", "Performance & SEO"];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden w-full lg:px-30">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image src={heroBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-r from-primary/95 via-primary/85 to-primary/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-soporis-gold animate-pulse" />
            <span className="text-sm font-medium text-primary-foreground/90">
              Agence Web & UI/UX
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl font-bold text-primary-foreground leading-tight mb-6"
          >
            Solutions Web et UI/UX pour transformer vos idées en{" "}
            <span className="text-gradient-gold">expériences digitales</span>{" "}
            performantes
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-md text-primary-foreground/80 mb-8 max-w-2xl"
          >
            Nous concevons des interfaces modernes et développons des sites et
            applications web performants, pensés pour convertir vos visiteurs en
            clients. Votre vision, notre expertise.
          </motion.p>

          {/* Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4 mb-10"
          >
            {highlights.map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                className="flex items-center gap-2 text-primary-foreground/90"
              >
                <CheckCircle2 className="h-5 w-5 text-soporis-gold" />
                <span className="text-sm font-medium">{item}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href={"/services" as Route}>
              <Button
                variant="gold"
                size="xl"
                className="group rounded-full cursor-pointer"
              >
                Découvrir nos services
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href={"/contact" as Route}>
              <Button
                variant="heroOutline"
                size="xl"
                className="rounded-full cursor-pointer"
              >
                Demander un devis
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent" />
    </section>
  );
}
