const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const templateDir = path.join(rootDir, "excel-online-template");
const buildDir = path.join(rootDir, "build", "excel-online-template-xlsx");
const workbookDir = path.join(buildDir, "workbook");
const outputFile = path.join(rootDir, "build", "BellezaPOS-Base-Online.xlsx");

const sheets = [
  { name: "Inventario", file: "Inventario.tsv" },
  { name: "Ventas", file: "Ventas.tsv" },
  { name: "Usuarios", file: "Usuarios.tsv" },
  { name: "Empresas", file: "Empresas.tsv" },
  { name: "Licencias", file: "Licencias.tsv" },
  { name: "LicenciasEquipos", file: "LicenciasEquipos.tsv" },
  { name: "LicenciasHistorial", file: "LicenciasHistorial.tsv" },
  { name: "Retiros", file: "Retiros.tsv" },
  { name: "CierresCaja", file: "CierresCaja.tsv" },
  { name: "Info", file: "Info.tsv" },
  { name: "Clientes", file: "Clientes.tsv" },
  { name: "Proveedores", file: "Proveedores.tsv" },
  { name: "Compras", file: "Compras.tsv" },
  { name: "Devoluciones", file: "Devoluciones.tsv" },
  { name: "Promociones", file: "Promociones.tsv" },
  { name: "Auditoria", file: "Auditoria.tsv" }
];

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function colName(index) {
  let n = index + 1;
  let name = "";
  while (n > 0) {
    const rem = (n - 1) % 26;
    name = String.fromCharCode(65 + rem) + name;
    n = Math.floor((n - 1) / 26);
  }
  return name;
}

function parseTsv(filePath) {
  const content = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  return content
    .split("\n")
    .filter((line) => line.length > 0)
    .map((line) => line.split("\t"));
}

function buildSheetXml(rows) {
  const xmlRows = rows.map((cells, rowIndex) => {
    const xmlCells = cells.map((cell, cellIndex) => {
      const ref = `${colName(cellIndex)}${rowIndex + 1}`;
      return `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${escapeXml(cell)}</t></is></c>`;
    }).join("");
    return `<row r="${rowIndex + 1}">${xmlCells}</row>`;
  }).join("");

  return [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">',
    '<sheetData>',
    xmlRows,
    '</sheetData>',
    '</worksheet>'
  ].join("");
}

function writeFile(relativePath, contents) {
  const filePath = path.join(workbookDir, relativePath);
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, contents, "utf8");
}

fs.rmSync(buildDir, { recursive: true, force: true });
ensureDir(workbookDir);

const parsedSheets = sheets.map((sheet, index) => {
  const rows = parseTsv(path.join(templateDir, sheet.file));
  writeFile(`xl/worksheets/sheet${index + 1}.xml`, buildSheetXml(rows));
  return { ...sheet, id: index + 1 };
});

writeFile("[Content_Types].xml", [
  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
  '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">',
  '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>',
  '<Default Extension="xml" ContentType="application/xml"/>',
  '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>',
  '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>',
  '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>',
  ...parsedSheets.map((sheet) =>
    `<Override PartName="/xl/worksheets/sheet${sheet.id}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`
  ),
  '</Types>'
].join(""));

writeFile("_rels/.rels", [
  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
  '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">',
  '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>',
  '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>',
  '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>',
  '</Relationships>'
].join(""));

writeFile("xl/workbook.xml", [
  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
  '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">',
  '<sheets>',
  ...parsedSheets.map((sheet) =>
    `<sheet name="${escapeXml(sheet.name)}" sheetId="${sheet.id}" r:id="rId${sheet.id}"/>`
  ),
  '</sheets>',
  '</workbook>'
].join(""));

writeFile("xl/_rels/workbook.xml.rels", [
  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
  '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">',
  ...parsedSheets.map((sheet) =>
    `<Relationship Id="rId${sheet.id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${sheet.id}.xml"/>`
  ),
  '</Relationships>'
].join(""));

writeFile("docProps/app.xml", [
  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
  '<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">',
  '<Application>Codex</Application>',
  '</Properties>'
].join(""));

writeFile("docProps/core.xml", [
  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
  '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">',
  '<dc:title>BellezaPOS Base Online</dc:title>',
  '<dc:creator>Codex</dc:creator>',
  '</cp:coreProperties>'
].join(""));

console.log(outputFile);
