# Multi-Tenant y Troubleshooting Rapido

## Archivos modificados

- `electron/tenant-manager.js`: router de base maestra/tenant, aprovisionamiento idempotente, validacion cruzada y autodiagnostico.
- `electron/db.js`: mantiene la logica CRUD actual, pero ahora resuelve la base operativa por `companyId`.
- `electron/preload.js`: expone diagnostico, aprovisionamiento y validacion de tenant al renderer.
- `electron/main.js`: ejecuta diagnostico silencioso al iniciar y guarda `startup-diagnostics.json` en `userData`.
- `db.config.example.json`: nuevo bloque `tenantDatabase`.
- `scripts/provision-tenant-db.js`: aprovisiona una base por empresa.
- `scripts/validate-tenant-schema.js`: compara tenant vs base maestra.
- `scripts/diagnose-desktop.js`: revisa configuracion, conectividad y drift de esquema.

## Flujo de aprovisionamiento

1. Al crear o actualizar una empresa con `saveCompany`, la app guarda la fila en `empresas`.
2. Luego ejecuta `tenantManager.provisionCompanyTenant(...)`.
3. El aprovisionador crea `db_posfarma_empresa_<companyId>`, aplica `root.session.sql` y valida que la estructura coincida con la base maestra.
4. El estado queda registrado en `empresas.tenant_db_status`.

## Comandos utiles

```powershell
npm run db:diagnose
npm run db:tenant:provision -- --company-id=3
npm run db:tenant:validate -- --company-id=3
```

## Problemas comunes

`DB_CONFIG_MISSING`
Comando:
```powershell
Copy-Item .\db.config.example.json .\db.config.json
```

`MASTER_DB_UNAVAILABLE`
Accion: abre `db.config.json`, corrige `host`, `port`, `user`, `password` y vuelve a ejecutar:
```powershell
npm run db:diagnose
```

`DB_HOST_UNRESOLVED`
Accion: reemplaza `host` por la IP o DNS valido del servidor MariaDB.

`TENANT_DB_UNAVAILABLE`
Comando:
```powershell
npm run db:tenant:provision -- --company-id=<id>
```

`TENANT_SCHEMA_DRIFT`
Comandos:
```powershell
npm run db:tenant:validate -- --company-id=<id>
npm run db:tenant:provision -- --company-id=<id>
```

## Nota operativa

La base maestra sigue concentrando `empresas`, `licencias`, `usuarios` y metadatos de tenant.
Las tablas operativas se resuelven dinamicamente por empresa para mantener la logica existente sin reescribir CRUDs ni reportes.
