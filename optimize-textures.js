import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import fg from "fast-glob";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.resolve(__dirname, "src/assets/textures");
const outputDir = path.resolve(__dirname, "src/assets/optimized-textures");

async function optimizeImages() {
  const files = await fg(["**/*.{jpg,jpeg,png}"], {
    cwd: inputDir,
    absolute: true,
  });

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const file of files) {
    const relativePath = path.relative(inputDir, file);
    const ext = path.extname(file).toLowerCase();
    const name = path.basename(file, ext);
    const outputDirPath = path.join(outputDir, path.dirname(relativePath));
    fs.mkdirSync(outputDirPath, { recursive: true });

    const outputJpg = path.join(outputDirPath, `${name}.jpg`);
    const outputWebp = path.join(outputDirPath, `${name}.webp`);

    const image = sharp(file);

    await image.clone().jpeg({ quality: 75, mozjpeg: true }).toFile(outputJpg);

    await image.clone().webp({ quality: 75 }).toFile(outputWebp);

    console.log(`✅ Optimized: ${relativePath}`);
  }
}

optimizeImages().catch(console.error);
