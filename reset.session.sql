USE db_posfarma;

SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM detalle_venta;
DELETE FROM cierres_caja_ventas;
DELETE FROM devoluciones;
DELETE FROM compras;
DELETE FROM auditoria;
DELETE FROM retiros_caja;
DELETE FROM cierres_caja;
DELETE FROM ventas;
DELETE FROM proveedores;
DELETE FROM inventario;
DELETE FROM clientes;
DELETE FROM perfil_farmacia;
DELETE FROM licencias_historial;
DELETE FROM licencias_equipos;
DELETE FROM licencias;
DELETE FROM empresas;
DELETE FROM usuarios WHERE empresa_id IS NOT NULL OR username NOT IN ('admin', 'operador');

SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO usuarios (empresa_id, nombre, username, password_hash, rol, activo)
VALUES
(NULL, 'Administrador desarrollador', 'admin', 'cambia_esta_clave', 'admin', 'SI'),
(NULL, 'Operador desarrollador', 'operador', 'cambia_esta_clave', 'operador', 'SI')
ON DUPLICATE KEY UPDATE
empresa_id = VALUES(empresa_id),
nombre = VALUES(nombre),
rol = VALUES(rol),
activo = VALUES(activo);

SELECT 'BASE RESETEADA OK' AS mensaje;
