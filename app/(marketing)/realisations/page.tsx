// app/(marketing)/realisations/page.tsx
import { prisma } from "@/lib/prisma";
import RealisationsClient from "./realisations-client";

export default async function RealisationsPage() {
  const projects = await prisma.project.findMany({
    where: { status: "published" },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      subtitle: true,
      slug: true,
      category: true,
      imageUrl: true,
    },
  });

  return <RealisationsClient projects={projects} />;
}
