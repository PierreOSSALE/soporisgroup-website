// scripts/convert-images.ts
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { glob } from "glob";

interface ConversionOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  deleteOriginals?: boolean;
  skipExisting?: boolean;
}

class ImageConverter {
  private options: ConversionOptions;

  constructor(options: ConversionOptions = {}) {
    this.options = {
      quality: 80,
      maxWidth: 1920,
      maxHeight: 1080,
      deleteOriginals: false,
      skipExisting: true,
      ...options,
    };
  }

  /**
   * Convertit toutes les images d'un dossier
   */
  async convertDirectory(
    sourceDir: string,
    patterns: string[] = ["**/*.{jpg,jpeg,png,gif,bmp,tiff}"],
  ) {
    console.log(`📁 Conversion des images dans : ${sourceDir}`);

    // Trouver toutes les images
    const files: string[] = [];
    for (const pattern of patterns) {
      const matches = await glob(pattern, {
        cwd: sourceDir,
        absolute: true,
        ignore: ["**/*.webp", "**/*.avif", "**/node_modules/**", "**/.git/**"],
      });
      files.push(...matches);
    }

    console.log(`📊 ${files.length} images trouvées`);

    let converted = 0;
    let skipped = 0;
    let errors = 0;

    // Conversion par lots (5 images en parallèle)
    const batchSize = 5;
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      await Promise.all(
        batch.map(async (file) => {
          try {
            const result = await this.convertImage(file);
            if (result.converted) converted++;
            if (result.skipped) skipped++;
          } catch (error) {
            errors++;
            console.error(`❌ Erreur avec ${file}:`, error);
          }
        }),
      );

      console.log(
        `🔄 Progression: ${Math.min(i + batchSize, files.length)}/${files.length}`,
      );
    }

    console.log(`\n✅ Conversion terminée !`);
    console.log(`   Converties: ${converted}`);
    console.log(`   Ignorées: ${skipped}`);
    console.log(`   Erreurs: ${errors}`);
  }

  /**
   * Convertit une image individuelle
   */
  private async convertImage(
    filePath: string,
  ): Promise<{ converted: boolean; skipped: boolean }> {
    const ext = path.extname(filePath).toLowerCase();
    const baseName = path.basename(filePath, ext);
    const dirName = path.dirname(filePath);
    const webpPath = path.join(dirName, `${baseName}.webp`);

    // Vérifier si le fichier WebP existe déjà
    if (this.options.skipExisting) {
      try {
        await fs.access(webpPath);
        console.log(`⏭️  Déjà converti: ${path.basename(filePath)}`);
        return { converted: false, skipped: true };
      } catch {
        // Le fichier n'existe pas, on continue
      }
    }

    // Lire les métadonnées pour vérifier les dimensions
    const metadata = await sharp(filePath).metadata();

    // Calculer les dimensions de redimensionnement
    let targetWidth = metadata.width || this.options.maxWidth!;
    let targetHeight = metadata.height || this.options.maxHeight!;

    if (
      metadata.width &&
      metadata.height &&
      this.options.maxWidth &&
      this.options.maxHeight
    ) {
      const widthRatio = this.options.maxWidth / metadata.width;
      const heightRatio = this.options.maxHeight / metadata.height;
      const ratio = Math.min(widthRatio, heightRatio, 1); // Ne pas agrandir

      if (ratio < 1) {
        targetWidth = Math.round(metadata.width * ratio);
        targetHeight = Math.round(metadata.height * ratio);
      }
    }

    console.log(
      `🔄 Conversion: ${path.basename(filePath)} (${metadata.width}x${metadata.height}) → ${targetWidth}x${targetHeight}`,
    );

    // Conversion et optimisation
    await sharp(filePath)
      .resize(targetWidth, targetHeight, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({
        quality: this.options.quality,
        effort: 6, // Niveau d'optimisation (0-6, 6 = meilleur)
        nearLossless: true, // Compression quasi sans perte
        smartSubsample: true, // Sous-échantillonnage intelligent
      })
      .toFile(webpPath);

    // Supprimer l'original si demandé
    if (this.options.deleteOriginals && !filePath.includes(".webp")) {
      await fs.unlink(filePath);
      console.log(`🗑️  Original supprimé: ${path.basename(filePath)}`);
    }

    return { converted: true, skipped: false };
  }

  /**
   * Génère un fichier de rapport
   */
  async generateReport(directory: string) {
    const allFiles = await glob("**/*", { cwd: directory, nodir: true });

    const images = {
      total: allFiles.length,
      webp: allFiles.filter((f) => f.endsWith(".webp")).length,
      jpg: allFiles.filter((f) => f.endsWith(".jpg") || f.endsWith(".jpeg"))
        .length,
      png: allFiles.filter((f) => f.endsWith(".png")).length,
      others: allFiles.filter(
        (f) => !f.match(/\.(webp|jpg|jpeg|png|gif|bmp)$/i),
      ).length,
    };

    const report = `
📊 RAPPORT DE CONVERSION D'IMAGES
=================================
📁 Dossier: ${directory}
📊 Total fichiers: ${images.total}
🖼️  Images WebP: ${images.webp}
🖼️  Images JPG: ${images.jpg}
🖼️  Images PNG: ${images.png}
📄 Autres fichiers: ${images.others}

💾 Économies estimées:
   - JPG → WebP: ~25-35% de réduction
   - PNG → WebP: ~80-90% de réduction
`;

    const reportPath = path.join(directory, "image-conversion-report.txt");
    await fs.writeFile(reportPath, report);
    console.log(`📄 Rapport généré: ${reportPath}`);
  }
}

// Fonction principale
async function main() {
  const args = process.argv.slice(2);
  const sourceDir = args[0] || "./public";

  console.log("🚀 Démarrage de la conversion WebP\n");

  const converter = new ImageConverter({
    quality: 85,
    maxWidth: 1920,
    maxHeight: 1080,
    deleteOriginals: false, // Mettez à true pour supprimer les originaux
    skipExisting: true,
  });

  // Convertir toutes les images
  await converter.convertDirectory(sourceDir);

  // Générer un rapport
  await converter.generateReport(sourceDir);

  console.log("\n✨ Conversion terminée avec succès !");
  console.log("\n📝 Prochaines étapes :");
  console.log("   1. Vérifiez les images converties dans", sourceDir);
  console.log("   2. Modifiez vos composants pour utiliser les .webp");
  console.log("   3. Testez avec PageSpeed Insights");
}

// Gestion des erreurs
main().catch(console.error);
