document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-item-form');
    const nameInput = document.getElementById('item-name');
    const quantityInput = document.getElementById('item-quantity');
    const priceInput = document.getElementById('item-price');
    const tableBody = document.getElementById('inventory-body');

    // Cargar inventario desde LocalStorage
    let inventory = JSON.parse(localStorage.getItem('inventory')) || [];

    // Función para renderizar el inventario en la tabla
    function renderInventory() {
        tableBody.innerHTML = ''; // Limpiar tabla existente
        inventory.forEach((item, index) => {
            const row = tableBody.insertRow();

            const nameCell = row.insertCell();
            nameCell.textContent = item.name;

            const quantityCell = row.insertCell();
            quantityCell.textContent = item.quantity;
            quantityCell.style.textAlign = 'right'; // Alinea la cantidad a la derecha

            const priceCell = row.insertCell();
            priceCell.textContent = item.price.toFixed(2); // Formatear precio a 2 decimales
            priceCell.style.textAlign = 'right'; // Alinea el precio a la derecha

            const actionsCell = row.insertCell();
            actionsCell.style.textAlign = 'center'; // Centra el botón
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.classList.add('delete-btn');
            deleteButton.onclick = () => deleteItem(index);
            actionsCell.appendChild(deleteButton);
        });
    }

    // Función para guardar el inventario en LocalStorage
    function saveInventory() {
        localStorage.setItem('inventory', JSON.stringify(inventory));
    }

    // Función para añadir un nuevo artículo
    function addItem(event) {
        event.preventDefault(); // Prevenir el envío del formulario

        const name = nameInput.value.trim();
        const quantity = parseInt(quantityInput.value, 10);
        const price = parseFloat(priceInput.value);

        if (name && !isNaN(quantity) && quantity >= 0 && !isNaN(price) && price >= 0) {
            const newItem = { name, quantity, price };
            inventory.push(newItem);
            saveInventory();
            renderInventory();

            // Limpiar el formulario
            form.reset();
            nameInput.focus(); // Poner el foco de nuevo en el nombre
        } else {
            alert('Por favor, introduce valores válidos para todos los campos.');
        }
    }

    // Función para eliminar un artículo
    function deleteItem(index) {
        if (confirm(`¿Estás seguro de que quieres eliminar "${inventory[index].name}"?`)) {
            inventory.splice(index, 1); // Eliminar el artículo del array
            saveInventory();
            renderInventory();
        }
    }

    // Añadir el event listener al formulario
    form.addEventListener('submit', addItem);

    // Renderizar el inventario inicial al cargar la página
    renderInventory();
});
