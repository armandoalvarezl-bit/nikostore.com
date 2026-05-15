const tenantManager = require('../electron/tenant-manager');

function getArg(name) {
  const prefix = `--${name}=`;
  const match = process.argv.find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length).trim() : '';
}

async function main() {
  const companyId = getArg('company-id');
  if (!companyId) {
    throw new Error('Debes indicar --company-id=<id>.');
  }

  const result = await tenantManager.provisionCompanyTenant({
    id: companyId
  });

  console.log(JSON.stringify({
    ok: true,
    companyId,
    tenantDatabase: result.tenantDatabase,
    tenantStatus: result.tenantStatus
  }, null, 2));
  process.exit(0);
}

main().catch((error) => {
  console.error(JSON.stringify({
    ok: false,
    error: error.message
  }, null, 2));
  process.exit(1);
});
