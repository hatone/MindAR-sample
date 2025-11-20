import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadImage } from "canvas";
import { OfflineCompiler } from "mind-ar/src/image-target/offline-compiler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.resolve(__dirname, "..", "web", "assets", "door-reference.jpg");
const outputPath = path.resolve(__dirname, "..", "web", "assets", "door-targets.mind");

async function main() {
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Missing input image: ${inputPath}`);
  }

  const img = await loadImage(inputPath);
  const compiler = new OfflineCompiler();

  process.stdout.write("Compiling MindAR target... 0%\r");
  await compiler.compileImageTargets([img], (progress) => {
    process.stdout.write(`Compiling MindAR target... ${progress.toFixed(1)}%\r`);
  });

  const buffer = compiler.exportData();
  fs.writeFileSync(outputPath, Buffer.from(buffer));
  process.stdout.write(`\nSaved MindAR target to ${outputPath}\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
