Generar control de Stocks

Pasos a seguir
1️⃣ Crear los esquemas en MongoDB

StockItems: Para registrar cada ingreso/egreso de stock.
StockCategories: Para clasificar los tipos de stock.
PurchaseRecords: Para registrar compras y actualizar costos.
2️⃣ Definir los endpoints en el backend

GET /stock → Obtener todos los registros de stock.
POST /stock → Registrar un ingreso o egreso de stock.
PUT /stock/:id → Modificar un movimiento de stock si fue cargado con error.
DELETE /stock/:id → Eliminar un movimiento si es necesario.
GET /materials/:id/stock → Obtener stock de un material específico.
POST /purchases → Registrar una compra de material e impactar en stock y costos.
3️⃣ Testear con Postman

Crear algunos registros de stock.
Verificar que los cálculos y actualizaciones de costos se reflejen correctamente.
4️⃣ Implementar en React

Página para ver el stock disponible.
Formulario para registrar ingresos/egresos.
Historial de movimientos.
