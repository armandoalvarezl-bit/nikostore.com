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

  const validation = await tenantManager.validateTenantSchema(companyId);
  console.log(JSON.stringify(validation, null, 2));
  process.exit(validation.ok ? 0 : 1);
}

main().catch((error) => {
  console.error(JSON.stringify({
    ok: false,
    error: error.message
  }, null, 2));
  process.exit(1);
});
