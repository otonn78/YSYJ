document.addEventListener('DOMContentLoaded', () => {
    // --- DATOS SIMULADOS (Esto vendría de un CMS en una implementación completa) ---
    const cakeData = {
        styles: [
            { id: "drip_cake", name: "Drip Cake", description: "Moderna y sofisticada, con chorreados de ganache.", image: "images/tarta-estilo-placeholder.jpg" },
            { id: "naked_cake", name: "Naked Cake", description: "La belleza de lo sencillo, mostrando sus capas.", image: "images/tarta-estilo-placeholder.jpg" },
            { id: "vintage_cake", name: "Vintage Cake", description: "Elegancia atemporal con detalles clásicos.", image: "images/tarta-estilo-placeholder.jpg" },
            { id: "letter_cake", name: "Letter/Number Cake", description: "Originales y divertidas, con forma de letra o número.", image: "images/tarta-estilo-placeholder.jpg" },
            { id: "custom_theme", name: "Temática Personalizada", description: "Cuéntanos tu idea y la hacemos realidad.", image: "images/tarta-estilo-placeholder.jpg" }
        ],
        sizes: [
            { id: "4_porciones", name: "4 Porciones (aprox. 15cm)", description: "Perfecta para una celebración íntima." },
            { id: "8_porciones", name: "8 Porciones (aprox. 18cm)", description: "Ideal para pequeñas reuniones." },
            { id: "12_porciones", name: "12 Porciones (aprox. 20cm)", description: "Comparte dulzura en tus eventos medianos." },
            { id: "20_porciones", name: "20+ Porciones (consultar)", description: "Para grandes celebraciones." }
        ],
        flavors: [
            { id: "chocolate", name: "Chocolate Intenso" },
            { id: "vainilla", name: "Vainilla Clásica" },
            { id: "red_velvet", name: "Red Velvet Aterciopelado" },
            { id: "zanahoria", name: "Carrot Cake Especiada" },
            { id: "limon", name: "Limón y Amapolas" },
            { id: "coco", name: "Coco Exótico" }
        ],
        fillings: [
            { id: "ganache_chocolate_negro", name: "Ganache de Chocolate Negro" },
            { id: "ganache_chocolate_blanco", name: "Ganache de Chocolate Blanco" },
            { id: "dulce_de_leche", name: "Dulce de Leche Artesanal" },
            { id: "buttercream_vainilla", name: "Buttercream Suave de Vainilla" },
            { id: "buttercream_queso", name: "Buttercream de Queso Crema" },
            { id: "frutas_rojas", name: "Compota de Frutas Rojas" },
            { id: "crema_limon", name: "Crema de Limón (Lemon Curd)" }
        ],
        decorations: [ // Estas son las que están hardcodeadas en el HTML, pero podrían venir de aquí
            { id: "flores_naturales", name: "Flores Naturales" },
            { id: "topper_personalizado", name: "Topper Personalizado" },
            { id: "macarons", name: "Macarons" },
            { id: "frutas_extra", name: "Frutas Extra" }
        ]
    };

    // --- ELEMENTOS DEL DOM ---
    const form = document.getElementById('cake-customization-form');
    if (!form) {
        console.error("El formulario 'cake-customization-form' no se encontró en el DOM.");
        return; // Salir si el formulario no existe para evitar errores
    }

    const cakeStyleSelect = document.getElementById('cake-style');
    const cakeSizeSelect = document.getElementById('cake-size');
    const cakeFlavorSelect = document.getElementById('cake-flavor');
    const cakeFillingSelect = document.getElementById('cake-filling');
    const addMessageRadios = form.elements['add-message'];
    const cakeMessageGroup = document.getElementById('cake-message-group');
    const cakeMessageTextarea = document.getElementById('cake-message');
    const cakeDecorationsCheckboxes = form.elements['decorations']; // NodeList
    const cakeNotesTextarea = document.getElementById('cake-notes');

    // Resumen del pedido
    const summaryStyle = document.getElementById('summary-style');
    const summarySize = document.getElementById('summary-size');
    const summaryFlavor = document.getElementById('summary-flavor');
    const summaryFilling = document.getElementById('summary-filling');
    const summaryMessage = document.getElementById('summary-message');
    const summaryMessageTextContainer = document.getElementById('summary-message-text-container');
    const summaryMessageText = document.getElementById('summary-message-text');
    const summaryDecorationsList = document.getElementById('summary-decorations');
    const summaryNotes = document.getElementById('summary-notes');

    const submitButton = document.getElementById('submit-cake-order');
    const cakeStylesGallery = document.getElementById('cake-styles-gallery');

    // --- POBLAR FORMULARIOS ---
    function populateSelect(selectElement, options) {
        if (!selectElement) return;
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.id;
            opt.textContent = option.name;
            selectElement.appendChild(opt);
        });
    }

    function populateStylesGallery(galleryElement, styles) {
        if (!galleryElement) return;
        galleryElement.innerHTML = ''; // Limpiar placeholders
        styles.forEach(style => {
            const article = document.createElement('article');
            article.className = 'cake-style-item';
            article.innerHTML = `
                <img src="${style.image}" alt="${style.name}">
                <h3>${style.name}</h3>
                <p>${style.description}</p>
            `;
            // Opcional: hacer que al hacer clic en el estilo se seleccione en el dropdown
            article.addEventListener('click', () => {
                if(cakeStyleSelect) cakeStyleSelect.value = style.id;
                updateSummary(); // Actualizar resumen si se selecciona desde la galería
                 // Scroll suave al formulario
                if(form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
            galleryElement.appendChild(article);
        });
    }

    populateStylesGallery(cakeStylesGallery, cakeData.styles);
    populateSelect(cakeStyleSelect, cakeData.styles);
    populateSelect(cakeSizeSelect, cakeData.sizes);
    populateSelect(cakeFlavorSelect, cakeData.flavors);
    populateSelect(cakeFillingSelect, cakeData.fillings);

    // --- ESTADO DEL PEDIDO ---
    let currentOrder = {
        style: '',
        size: '',
        flavor: '',
        filling: '',
        addMessage: 'no',
        message: '',
        decorations: [],
        notes: ''
    };

    // --- ACTUALIZAR RESUMEN ---
    function updateSummary() {
        currentOrder.style = cakeStyleSelect ? cakeStyleSelect.options[cakeStyleSelect.selectedIndex]?.textContent : 'N/A';
        currentOrder.size = cakeSizeSelect ? cakeSizeSelect.options[cakeSizeSelect.selectedIndex]?.textContent : 'N/A';
        currentOrder.flavor = cakeFlavorSelect ? cakeFlavorSelect.options[cakeFlavorSelect.selectedIndex]?.textContent : 'N/A';
        currentOrder.filling = cakeFillingSelect ? cakeFillingSelect.options[cakeFillingSelect.selectedIndex]?.textContent : 'N/A';
        currentOrder.addMessage = Array.from(addMessageRadios).find(radio => radio.checked)?.value || 'no';
        currentOrder.message = cakeMessageTextarea?.value || '';
        currentOrder.notes = cakeNotesTextarea?.value || 'N/A';

        currentOrder.decorations = [];
        if (cakeDecorationsCheckboxes) {
            Array.from(cakeDecorationsCheckboxes).forEach(checkbox => {
                if (checkbox.checked) {
                    // Buscar el nombre legible de la decoración
                    const decoData = cakeData.decorations.find(d => d.id === checkbox.value);
                    currentOrder.decorations.push(decoData ? decoData.name : checkbox.value);
                }
            });
        }


        if(summaryStyle) summaryStyle.textContent = currentOrder.style === "Selecciona un estilo..." ? "N/A" : currentOrder.style;
        if(summarySize) summarySize.textContent = currentOrder.size === "Selecciona un tamaño..." ? "N/A" : currentOrder.size;
        if(summaryFlavor) summaryFlavor.textContent = currentOrder.flavor === "Selecciona un sabor..." ? "N/A" : currentOrder.flavor;
        if(summaryFilling) summaryFilling.textContent = currentOrder.filling === "Selecciona un relleno..." ? "N/A" : currentOrder.filling;

        if(summaryMessage) summaryMessage.textContent = currentOrder.addMessage === 'yes' ? 'Sí' : 'No';
        if (cakeMessageGroup) cakeMessageGroup.style.display = currentOrder.addMessage === 'yes' ? 'block' : 'none';

        if(summaryMessageTextContainer && summaryMessageText) {
            if (currentOrder.addMessage === 'yes' && currentOrder.message) {
                summaryMessageText.textContent = currentOrder.message;
                summaryMessageTextContainer.style.display = 'block';
            } else {
                summaryMessageTextContainer.style.display = 'none';
                summaryMessageText.textContent = '';
            }
        }


        if (summaryDecorationsList) {
            summaryDecorationsList.innerHTML = ''; // Limpiar
            if (currentOrder.decorations.length > 0) {
                currentOrder.decorations.forEach(deco => {
                    const li = document.createElement('li');
                    li.textContent = deco;
                    summaryDecorationsList.appendChild(li);
                });
            } else {
                const li = document.createElement('li');
                li.textContent = 'Ninguna';
                summaryDecorationsList.appendChild(li);
            }
        }
        if(summaryNotes) summaryNotes.textContent = currentOrder.notes || "N/A";
    }

    // --- MANEJO DE EVENTOS ---
    if(form) {
        form.addEventListener('change', updateSummary); // Actualiza con cualquier cambio en el form
        form.addEventListener('input', (event) => { // Específico para textareas y inputs de texto
            if (event.target.matches('#cake-message') || event.target.matches('#cake-notes')) {
                updateSummary();
            }
        });
    }


    // --- ENVIAR PEDIDO ---
    if (submitButton) {
        submitButton.addEventListener('click', () => {
            // Validación simple (podría ser más exhaustiva)
            if ((!cakeStyleSelect || cakeStyleSelect.value === "") ||
                (!cakeSizeSelect || cakeSizeSelect.value === "") ||
                (!cakeFlavorSelect || cakeFlavorSelect.value === "") ||
                (!cakeFillingSelect || cakeFillingSelect.value === "")) {
                alert('Por favor, completa todos los campos obligatorios (Estilo, Tamaño, Sabor, Relleno).');
                return;
            }
            if (currentOrder.addMessage === 'yes' && !currentOrder.message.trim()) {
                 alert('Por favor, escribe tu mensaje personalizado o selecciona "No" si no deseas un mensaje.');
                 cakeMessageTextarea?.focus();
                 return;
            }


            let messageBody = `¡Hola Boards & Cakes! 👋\n\nMe gustaría solicitar un presupuesto para la siguiente tarta personalizada:\n`;
            messageBody += `\n- *Estilo:* ${currentOrder.style}`;
            messageBody += `\n- *Tamaño:* ${currentOrder.size}`;
            messageBody += `\n- *Sabor del Bizcocho:* ${currentOrder.flavor}`;
            messageBody += `\n- *Relleno:* ${currentOrder.filling}`;

            if (currentOrder.addMessage === 'yes' && currentOrder.message) {
                messageBody += `\n- *Mensaje Personalizado:* "${currentOrder.message}"`;
            }

            if (currentOrder.decorations.length > 0) {
                messageBody += `\n- *Decoración Adicional:* ${currentOrder.decorations.join(', ')}`;
            }
            if (currentOrder.notes && currentOrder.notes !== "N/A") {
                 messageBody += `\n- *Notas Adicionales:* ${currentOrder.notes}`;
            }

            messageBody += `\n\nEspero su contacto. ¡Gracias! 😊`;

            const whatsappNumber = "34000000000"; // Reemplazar con el número real de Boards & Cakes
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageBody)}`;

            // console.log(messageBody); // Para depuración
            window.open(whatsappUrl, '_blank');
        });
    }

    // --- INICIALIZACIÓN ---
    updateSummary(); // Llamar una vez para inicializar el resumen
});
