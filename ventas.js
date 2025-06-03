document.addEventListener('DOMContentLoaded', () => {
    const formVenta = document.getElementById('form-venta');
    const selectProducto = document.getElementById('producto');
    const cantidadInput = document.getElementById('cantidad');
    const tablaVentas = document.getElementById('tabla-ventas').getElementsByTagName('tbody')[0];
    const btnDescargarCSV = document.getElementById('descargar-csv');

    // ✅ Recuperar productos guardados en localStorage por inventario.js
    let productos = JSON.parse(localStorage.getItem('productos')) || [];

    // Validar y asegurar que todos tengan los campos necesarios
    productos = productos.map((p, index) => ({
        id: p.id || index + 1,
        nombre: p.nombre || 'Sin nombre',
        precioCompra: parseFloat(p.precioCompra) || 0,
        stock: parseInt(p.stock) || 0
    }));

    let ventas = [];

    function actualizarSelectProductos() {
        selectProducto.innerHTML = '<option value="">(Seleccione un producto)</option>';
        productos.forEach(producto => {
            if (producto.stock > 0) {
                const option = document.createElement('option');
                option.value = producto.id;
                option.textContent = `${producto.nombre} - S/ ${producto.precioCompra}`;
                selectProducto.appendChild(option);
            }
        });
    }

    function mostrarVentas() {
        tablaVentas.innerHTML = '';
        ventas.forEach((venta, index) => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${venta.producto.nombre}</td>
                <td>${venta.cantidad}</td>
                <td>S/ ${venta.costoTotal.toFixed(2)}</td>
                <td><button class="eliminar" data-index="${index}">Eliminar</button></td>
            `;
            tablaVentas.appendChild(fila);
        });

        document.querySelectorAll('.eliminar').forEach(boton => {
            boton.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                ventas.splice(index, 1);
                mostrarVentas();
            });
        });
    }

    formVenta.addEventListener('submit', (e) => {
        e.preventDefault();

        const productoId = parseInt(selectProducto.value);
        const cantidad = parseInt(cantidadInput.value);

        const producto = productos.find(p => p.id === productoId);
        if (!producto || cantidad <= 0 || cantidad > producto.stock) {
            alert('Cantidad no válida o producto no disponible.');
            return;
        }

        const venta = {
            producto: { ...producto }, // Copia segura
            cantidad,
            costoTotal: producto.precioCompra * cantidad
        };

        ventas.push(venta);
        producto.stock -= cantidad;

        mostrarVentas();
        actualizarSelectProductos();
        formVenta.reset();
    });

    // CSV export
    btnDescargarCSV.addEventListener('click', () => {
        if (ventas.length === 0) {
            alert("No hay ventas para exportar.");
            return;
        }

        const encabezados = ["Producto", "Cantidad", "Costo Total"];
        const filas = ventas.map(v => [
            v.producto.nombre,
            v.cantidad,
            `S/ ${v.costoTotal.toFixed(2)}`
        ]);

        const csv = [encabezados, ...filas]
            .map(row => row.map(d => `"${d}"`).join(','))
            .join('\n');

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'ventas.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    actualizarSelectProductos();
});
