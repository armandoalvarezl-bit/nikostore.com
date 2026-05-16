# Inventario Excel + Apps Script

## 1. Plantilla para Excel

Usa este archivo:

- `inventario-template.csv`

Puedes abrirlo en Excel y luego guardarlo como `.xlsx` si quieres.

Nombre recomendado del archivo:

- `inventario-farmapos.xlsx`

## 2. Hoja en Excel / Google Sheets

La hoja debe llamarse exactamente:

- `Inventario`

Columnas esperadas:

- `id`
- `sku`
- `nombre`
- `categoria`
- `precio`
- `stock`
- `codigo_barras`
- `descripcion`
- `activo`

## 3. Publicar con Apps Script

1. Sube el Excel a Google Drive.
2. Ãbrelo con Google Sheets.
3. Ve a `Extensiones > Apps Script`.
4. Borra el contenido inicial.
5. Pega el cÃ³digo de `apps-script-inventario.gs`.
6. Guarda el proyecto.
7. Ve a `Implementar > Nueva implementaciÃ³n`.
8. Elige `AplicaciÃ³n web`.
9. Ejecutar como: `TÃº`.
10. QuiÃ©n tiene acceso: `Cualquier persona con el enlace`.
11. Implementa y copia la URL.

## 4. Respuesta esperada

La URL debe devolver un JSON asÃ­:

```json
{
  "ok": true,
  "updated_at": "2026-03-19T00:00:00.000Z",
  "total": 6,
  "items": [
    {
      "id": "1",
      "sku": "FP-001",
      "nombre": "Acetaminofen 500 mg",
      "categoria": "analgesico",
      "precio": 8500,
      "stock": 24,
      "codigo_barras": "770000000001",
      "descripcion": "Tabletas x 100 unidades",
      "activo": "SI"
    }
  ]
}
```

## 5. Siguiente paso

Cuando tengas la URL del Apps Script, la enlazamos con:

- `ventas.html`
- `farmapos-data.js`

y hacemos que el inventario se cargue automÃ¡ticamente desde tu Excel en lÃ­nea.

