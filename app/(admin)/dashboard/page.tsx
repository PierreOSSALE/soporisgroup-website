// app/(admin)/dashboard/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FolderKanban,
  FileText,
  Eye,
  DollarSign,
  Code,
  Package,
} from "lucide-react";
import { getProjects } from "@/lib/actions/project.actions";
import { getBlogArticles } from "@/lib/actions/blog.actions";
import { getServices } from "@/lib/actions/service.actions";
import { getPacks } from "@/lib/actions/pack.actions";
import { Suspense } from "react";
import DashboardSkeleton from "@/components/skeletons/admin-dashboard-skeleton";

// Fonction pour formater la date
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Composant pour les statistiques
async function StatsCards() {
  const [projects, blogs, services, packs] = await Promise.all([
    getProjects(),
    getBlogArticles(),
    getServices(),
    getPacks(),
  ]);

  const publishedProjects = projects.filter(
    (p) => p.status === "published"
  ).length;
  const totalBlogViews = blogs.reduce(
    (acc, blog) => acc + (blog.views || 0),
    0
  );
  const activeServicesCount = services.filter((s) => s.isActive).length;
  const activePacksCount = packs.filter((p) => p.isActive).length;
  const popularPacksCount = packs.filter(
    (p) => p.isPopular && p.isActive
  ).length;

  const statsData = [
    {
      title: "Projets",
      value: projects.length,
      icon: FolderKanban,
      description: `${publishedProjects} publiés`,
      trend: "+12%",
      color: "text-blue-600",
    },
    {
      title: "Articles",
      value: blogs.length,
      icon: FileText,
      description: `${totalBlogViews} vues totales`,
      trend: "+8%",
      color: "text-green-600",
    },
    {
      title: "Services actifs",
      value: activeServicesCount,
      icon: Code,
      description: `${services.length} services au total`,
      trend: "+5%",
      color: "text-purple-600",
    },
    {
      title: "Packs actifs",
      value: activePacksCount,
      icon: Package,
      description: `${popularPacksCount} packs populaires`,
      trend: "+15%",
      color: "text-orange-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <IconComponent className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="text-green-600 font-medium">{stat.trend}</span>
                <span>{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// Composant pour les projets récents
async function RecentProjectsCard() {
  const projects = await getProjects();
  const recentProjects = projects
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 3);

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderKanban className="h-5 w-5" />
          Projets récents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentProjects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between p-3 rounded-lg border"
            >
              <div>
                <h4 className="font-medium">{project.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {project.client || "Non spécifié"}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    project.status === "published"
                      ? "bg-green-100 text-green-800"
                      : project.status === "archived"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {project.status === "published"
                    ? "Publié"
                    : project.status === "archived"
                    ? "Archivé"
                    : "Brouillon"}
                </span>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatDate(project.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Composant pour les articles populaires
async function PopularArticlesCard() {
  const blogs = await getBlogArticles();
  const popularArticles = blogs
    .filter((blog) => blog.published)
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Articles populaires
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {popularArticles.map((article) => (
            <div key={article.id} className="p-3 rounded-lg border">
              <h4 className="font-medium line-clamp-1">{article.title}</h4>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-muted-foreground">
                  {article.category}
                </span>
                <span className="text-xs font-medium">
                  {article.views || 0} vues
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Composant pour les promotions actives
async function ActivePromotionsCard() {
  const packs = await getPacks();
  const activePromos = packs.filter((p) => p.isPromo && p.isActive);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Promotions actives
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activePromos.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activePromos.map((pack) => (
              <div
                key={pack.id}
                className="p-4 rounded-lg border border-accent bg-accent/5"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{pack.name}</h4>
                  {pack.promoLabel && (
                    <span className="bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded">
                      {pack.promoLabel}
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">
                    {pack.priceEUR ?? pack.priceTND ?? pack.priceCFA ?? "N/A"}
                  </span>
                  {pack.originalPriceEUR && (
                    <span className="text-sm text-muted-foreground line-through">
                      {pack.originalPriceEUR}€
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {pack.description}
                </p>
                {pack.promoEndDate && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Expire le {formatDate(pack.promoEndDate)}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            Aucune promotion active pour le moment
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default async function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Titre et description */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Tableau de bord Administrateur
        </h1>
        <p className="text-muted-foreground">
          Vue d'ensemble complète de votre plateforme et suivi des performances
        </p>
      </div>

      {/* Statistiques avec skeleton */}
      <Suspense fallback={<DashboardSkeleton type="stats" />}>
        <StatsCards />
      </Suspense>

      {/* Projets récents et articles populaires */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<DashboardSkeleton type="projects" />}>
          <RecentProjectsCard />
        </Suspense>

        <Suspense fallback={<DashboardSkeleton type="articles" />}>
          <PopularArticlesCard />
        </Suspense>
      </div>

      {/* Promotions actives */}
      <Suspense fallback={<DashboardSkeleton type="promotions" />}>
        <ActivePromotionsCard />
      </Suspense>
    </div>
  );
}
