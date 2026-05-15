const db = require('../electron/db');

async function main() {
  const diagnostics = await db.runStartupDiagnostics();
  console.log(JSON.stringify(diagnostics, null, 2));
  process.exit(diagnostics.ok ? 0 : 1);
}

main().catch((error) => {
  console.error(JSON.stringify({
    ok: false,
    error: error.message
  }, null, 2));
  process.exit(1);
});
