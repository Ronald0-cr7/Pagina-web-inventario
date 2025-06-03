document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.tienda');
    const tabla = document.querySelector('#tablaProductos tbody');
    const busqueda = document.querySelector('#busqueda');
    const botonDescargar = document.getElementById('descargarCSV');

    // Cargar productos desde localStorage si existen
    let productos = JSON.parse(localStorage.getItem('productos')) || [];

    mostrarProductos();

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = document.querySelector('#Nombre').value;
        const descripcion = document.querySelector('#Descripcion').value;
        const precioCompra = document.querySelector('#precio_compra').value;
        const precioVenta = document.querySelector('#precio_venta').value;
        const stock = document.querySelector('#stock').value;
        const categoria = document.querySelector('#categoria').selectedOptions[0].text;

        const producto = {
            id: Date.now(),
            nombre,
            descripcion,
            precioCompra,
            precioVenta,
            stock,
            categoria
        };

        productos.push(producto);
        localStorage.setItem('productos', JSON.stringify(productos)); // Guardar en localStorage
        mostrarProductos();
        form.reset();
    });

    function mostrarProductos(filtro = '') {
        tabla.innerHTML = '';

        productos
            .filter(p =>
                p.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
                p.categoria.toLowerCase().includes(filtro.toLowerCase())
            )
            .forEach(producto => {
                const fila = document.createElement('tr');

                fila.innerHTML = `
                    <td>${producto.nombre}</td>
                    <td>${producto.descripcion}</td>
                    <td>S/ ${producto.precioCompra}</td>
                    <td>S/ ${producto.precioVenta}</td>
                    <td>${producto.stock}</td>
                    <td>${producto.categoria}</td>
                    <td>
                        <button onclick="editarProducto(${producto.id})">Editar</button>
                        <button onclick="eliminarProducto(${producto.id})">Eliminar</button>
                    </td>
                `;

                tabla.appendChild(fila);
            });
    }

    window.eliminarProducto = (id) => {
        productos = productos.filter(p => p.id !== id);
        localStorage.setItem('productos', JSON.stringify(productos)); // Actualizar localStorage
        mostrarProductos(busqueda.value);
    };

    window.editarProducto = (id) => {
        const producto = productos.find(p => p.id === id);
        if (!producto) return;

        document.querySelector('#Nombre').value = producto.nombre;
        document.querySelector('#Descripcion').value = producto.descripcion;
        document.querySelector('#precio_compra').value = producto.precioCompra;
        document.querySelector('#precio_venta').value = producto.precioVenta;
        document.querySelector('#stock').value = producto.stock;

        const select = document.querySelector('#categoria');
        for (let option of select.options) {
            if (option.text === producto.categoria) {
                option.selected = true;
                break;
            }
        }

        productos = productos.filter(p => p.id !== id); // Eliminar temporalmente
        localStorage.setItem('productos', JSON.stringify(productos)); // Actualizar
        mostrarProductos(busqueda.value);
    };

    busqueda.addEventListener('input', (e) => {
        mostrarProductos(e.target.value);
    });

    // ✅ Descargar inventario como archivo CSV
    botonDescargar.addEventListener('click', () => {
        if (productos.length === 0) {
            alert("No hay productos para exportar.");
            return;
        }

        const encabezados = ["Nombre", "Descripción", "Precio de Compra", "Precio de Venta", "Stock", "Categoría"];

        const filas = productos.map(p => [
            p.nombre,
            p.descripcion,
            `S/ ${parseFloat(p.precioCompra).toFixed(2)}`,
            `S/ ${parseFloat(p.precioVenta).toFixed(2)}`,
            p.stock,
            p.categoria
        ]);

        const csv = [encabezados, ...filas]
            .map(fila => fila.map(dato => `"${dato}"`).join(','))
            .join('\n');

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'productos.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});
