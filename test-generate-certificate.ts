import fs from "fs";
import path from "path";
import { generateCertificatePDF, normalizeNameForCursive } from "./src/lib/certificate";

async function main() {
  const nameArg = process.argv[2] || "JOHN DOE";
  const dateArg = process.argv[3] || new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  const displayName = normalizeNameForCursive(nameArg);
  const pdfBytes = await generateCertificatePDF(displayName, dateArg);

  const safeFilename = displayName.replace(/[^a-z0-9\-\s_\.]/gi, "_").replace(/\s+/g, "_");
  const outPath = path.join(process.cwd(), `certificate-${safeFilename}.pdf`);
  fs.writeFileSync(outPath, Buffer.from(pdfBytes));
  console.log(`Saved: ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


