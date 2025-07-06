document.addEventListener('DOMContentLoaded', () => {
    // --- DATOS SIMULADOS (Esto vendría de un CMS) ---
    const boardData = {
        types: [
            { id: "quesos", name: "Solo Quesos", description: "Una selección variada de quesos.", image: "images/tabla-tipo-placeholder.jpg", showCheeses: true, showCharcuterie: false },
            { id: "charcuteria", name: "Solo Charcutería", description: "Embutidos y cortes selectos.", image: "images/tabla-tipo-placeholder.jpg", showCheeses: false, showCharcuterie: true },
            { id: "mixta", name: "Tabla Mixta", description: "Quesos, charcutería y más.", image: "images/tabla-tipo-placeholder.jpg", showCheeses: true, showCharcuterie: true },
            { id: "brunch", name: "Tabla de Brunch", description: "Delicias para empezar el día.", image: "images/tabla-tipo-placeholder.jpg", showCheeses: true, showCharcuterie: true } // Ejemplo, podría tener otras opciones
        ],
        sizes: [
            { id: "s", name: "Pequeña (S)", description: "Ideal para 2-3 personas." },
            { id: "m", name: "Mediana (M)", description: "Perfecta para 4-6 personas." },
            { id: "l", name: "Grande (L)", description: "Para 7-10 personas o más." }
        ],
        cheeses: [
            { id: "brie", name: "Brie Cremoso" },
            { id: "manchego_curado", name: "Manchego Curado (6 meses)" },
            { id: "gouda_trufado", name: "Gouda Trufado" },
            { id: "queso_azul", name: "Queso Azul Suave (ej: Roquefort)" },
            { id: "cabra_ceniza", name: "Rulo de Cabra a la Ceniza" },
            { id: "cheddar_maduro", name: "Cheddar Maduro Inglés" },
            { id: "parmesano", name: "Parmigiano Reggiano DOP" }
        ],
        charcuterie: [
            { id: "jamon_iberico", name: "Jamón Ibérico de Bellota" },
            { id: "lomo_iberico", name: "Lomo Ibérico de Bellota" },
            { id: "chorizo_iberico", name: "Chorizo Ibérico Cular" },
            { id: "salchichon_iberico", name: "Salchichón Ibérico Cular" },
            { id: "fuet_artesano", name: "Fuet Artesano de Vic" },
            { id: "mortadela_italiana", name: "Mortadela Italiana con Pistachos" },
            { id: "prosciutto_crudo", name: "Prosciutto Crudo Italiano" }
        ],
        accompaniments: [
            { id: "frutas_frescas", name: "Frutas Frescas de Temporada" },
            { id: "frutos_secos", name: "Frutos Secos Variados (nueces, almendras)" },
            { id: "picos_regañas", name: "Picos, Regañás y Panecillos" },
            { id: "mermelada_higo", name: "Mermelada de Higo Casera" },
            { id: "mermelada_pimiento", name: "Mermelada de Pimiento Caramelizado" },
            { id: "aceitunas_aliñadas", name: "Aceitunas Aliñadas Especiales" },
            { id: "tomates_cherry_confitados", name: "Tomates Cherry Confitados" }
        ]
    };

    // --- ELEMENTOS DEL DOM ---
    const form = document.getElementById('board-customization-form');
    if (!form) {
        console.error("El formulario 'board-customization-form' no se encontró.");
        return;
    }

    const boardTypeSelect = document.getElementById('board-type');
    const boardSizeSelect = document.getElementById('board-size');

    const cheesesOptionsContainer = document.getElementById('board-options-quesos');
    const cheesesCheckboxesContainer = document.getElementById('board-cheeses');
    const charcuterieOptionsContainer = document.getElementById('board-options-charcuteria');
    const charcuterieCheckboxesContainer = document.getElementById('board-charcuterie');
    const accompanimentsCheckboxesContainer = document.getElementById('board-accompaniments');
    const boardNotesTextarea = document.getElementById('board-notes');

    // Resumen del pedido
    const summaryBoardType = document.getElementById('summary-board-type');
    const summaryBoardSize = document.getElementById('summary-board-size');
    const summaryBoardCheesesContainer = document.getElementById('summary-board-cheeses-container');
    const summaryBoardCheesesList = document.getElementById('summary-board-cheeses');
    const summaryBoardCharcuterieContainer = document.getElementById('summary-board-charcuterie-container');
    const summaryBoardCharcuterieList = document.getElementById('summary-board-charcuterie');
    const summaryBoardAccompanimentsList = document.getElementById('summary-board-accompaniments');
    const summaryBoardNotes = document.getElementById('summary-board-notes');

    const submitButton = document.getElementById('submit-board-order');
    const boardTypesGallery = document.getElementById('board-types-gallery');

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

    function populateCheckboxes(containerElement, options, groupName) {
        if (!containerElement) return;
        containerElement.innerHTML = ''; // Limpiar
        options.forEach(option => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = groupName;
            checkbox.value = option.id;
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(` ${option.name}`));
            containerElement.appendChild(label);
        });
    }

    function populateBoardTypesGallery(galleryElement, types) {
        if (!galleryElement) return;
        galleryElement.innerHTML = ''; // Limpiar placeholders
        types.forEach(type => {
            const article = document.createElement('article');
            // Reutilizamos la clase de CSS de tartas para la galería de estilos
            article.className = 'cake-style-item';
            article.innerHTML = `
                <img src="${type.image}" alt="${type.name}">
                <h3>${type.name}</h3>
                <p>${type.description}</p>
            `;
            article.addEventListener('click', () => {
                if(boardTypeSelect) boardTypeSelect.value = type.id;
                // Disparar evento change manualmente para que se actualice la visibilidad y el resumen
                const event = new Event('change', { bubbles: true });
                boardTypeSelect.dispatchEvent(event);
                if(form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
            galleryElement.appendChild(article);
        });
    }

    populateBoardTypesGallery(boardTypesGallery, boardData.types);
    populateSelect(boardTypeSelect, boardData.types);
    populateSelect(boardSizeSelect, boardData.sizes);
    populateCheckboxes(cheesesCheckboxesContainer, boardData.cheeses, 'board-cheeses');
    populateCheckboxes(charcuterieCheckboxesContainer, boardData.charcuterie, 'board-charcuterie');
    populateCheckboxes(accompanimentsCheckboxesContainer, boardData.accompaniments, 'board-accompaniments');

    // --- ESTADO DEL PEDIDO ---
    let currentBoardOrder = {
        type: '',
        typeName: '',
        size: '',
        sizeName: '',
        cheeses: [],
        charcuterie: [],
        accompaniments: [],
        notes: ''
    };

    // --- LÓGICA PARA MOSTRAR/OCULTAR SECCIONES DE QUESOS/CHARCUTERÍA ---
    function toggleIngredientSections() {
        const selectedTypeId = boardTypeSelect.value;
        const selectedTypeData = boardData.types.find(t => t.id === selectedTypeId);

        if (selectedTypeData) {
            if(cheesesOptionsContainer) cheesesOptionsContainer.style.display = selectedTypeData.showCheeses ? 'block' : 'none';
            if(charcuterieOptionsContainer) charcuterieOptionsContainer.style.display = selectedTypeData.showCharcuterie ? 'block' : 'none';
        } else {
            if(cheesesOptionsContainer) cheesesOptionsContainer.style.display = 'none';
            if(charcuterieOptionsContainer) charcuterieOptionsContainer.style.display = 'none';
        }
    }


    // --- ACTUALIZAR RESUMEN ---
    function updateBoardSummary() {
        const selectedTypeOption = boardTypeSelect ? boardTypeSelect.options[boardTypeSelect.selectedIndex] : null;
        currentBoardOrder.type = selectedTypeOption ? selectedTypeOption.value : '';
        currentBoardOrder.typeName = selectedTypeOption ? selectedTypeOption.textContent : 'N/A';

        const selectedSizeOption = boardSizeSelect ? boardSizeSelect.options[boardSizeSelect.selectedIndex] : null;
        currentBoardOrder.size = selectedSizeOption ? selectedSizeOption.value : '';
        currentBoardOrder.sizeName = selectedSizeOption ? selectedSizeOption.textContent : 'N/A';

        currentBoardOrder.notes = boardNotesTextarea?.value || 'N/A';

        currentBoardOrder.cheeses = [];
        if (cheesesCheckboxesContainer && cheesesOptionsContainer && cheesesOptionsContainer.style.display !== 'none') {
            cheesesCheckboxesContainer.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
                const cheeseData = boardData.cheeses.find(c => c.id === cb.value);
                currentBoardOrder.cheeses.push(cheeseData ? cheeseData.name : cb.value);
            });
        }

        currentBoardOrder.charcuterie = [];
        if (charcuterieCheckboxesContainer && charcuterieOptionsContainer && charcuterieOptionsContainer.style.display !== 'none') {
            charcuterieCheckboxesContainer.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
                 const charcuterieData = boardData.charcuterie.find(c => c.id === cb.value);
                currentBoardOrder.charcuterie.push(charcuterieData ? charcuterieData.name : cb.value);
            });
        }

        currentBoardOrder.accompaniments = [];
        if (accompanimentsCheckboxesContainer) {
            accompanimentsCheckboxesContainer.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
                const accompanimentData = boardData.accompaniments.find(a => a.id === cb.value);
                currentBoardOrder.accompaniments.push(accompanimentData ? accompanimentData.name : cb.value);
            });
        }

        // Actualizar DOM del resumen
        if(summaryBoardType) summaryBoardType.textContent = currentBoardOrder.typeName === "Selecciona un tipo..." ? "N/A" : currentBoardOrder.typeName;
        if(summaryBoardSize) summaryBoardSize.textContent = currentBoardOrder.sizeName === "Selecciona un tamaño..." ? "N/A" : currentBoardOrder.sizeName;

        function updateListSummary(listElement, items, containerElement) {
            if (!listElement || !containerElement) return;
            listElement.innerHTML = '';
            if (items.length > 0) {
                items.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    listElement.appendChild(li);
                });
                containerElement.style.display = 'block';
            } else {
                const li = document.createElement('li');
                li.textContent = 'Ninguno seleccionado';
                listElement.appendChild(li);
                // Opcionalmente ocultar la sección si no hay nada seleccionado y no es obligatorio
                 const selectedTypeData = boardData.types.find(t => t.id === currentBoardOrder.type);
                 if (selectedTypeData) {
                    if (listElement === summaryBoardCheesesList && !selectedTypeData.showCheeses) {
                        containerElement.style.display = 'none';
                    } else if (listElement === summaryBoardCharcuterieList && !selectedTypeData.showCharcuterie) {
                        containerElement.style.display = 'none';
                    } else {
                        containerElement.style.display = 'block'; // Mostrar si la sección es relevante
                    }
                 } else {
                    containerElement.style.display = 'none';
                 }
            }
        }

        updateListSummary(summaryBoardCheesesList, currentBoardOrder.cheeses, summaryBoardCheesesContainer);
        updateListSummary(summaryBoardCharcuterieList, currentBoardOrder.charcuterie, summaryBoardCharcuterieContainer);
        updateListSummary(summaryBoardAccompanimentsList, currentBoardOrder.accompaniments, accompanimentsCheckboxesContainer); // Este último container no es el del resumen, es para simplificar

        // Para Acompañantes, siempre mostrar la sección en el resumen, incluso si dice "Ninguno"
        if(summaryBoardAccompanimentsList && summaryBoardAccompanimentsList.parentElement) { // Asumiendo que el parent es el contenedor que se muestra/oculta
            summaryBoardAccompanimentsList.parentElement.style.display = 'block';
             if (currentBoardOrder.accompaniments.length === 0) {
                summaryBoardAccompanimentsList.innerHTML = '<li>Ninguno seleccionado</li>';
            }
        }


        if(summaryBoardNotes) summaryBoardNotes.textContent = currentBoardOrder.notes || "N/A";
    }

    // --- MANEJO DE EVENTOS ---
    if(form) {
        form.addEventListener('change', () => {
            toggleIngredientSections(); // Primero ajustar visibilidad
            updateBoardSummary();     // Luego actualizar resumen
        });
        form.addEventListener('input', (event) => {
            if (event.target.matches('#board-notes')) {
                updateBoardSummary();
            }
        });
    }


    // --- ENVIAR PEDIDO ---
    if (submitButton) {
        submitButton.addEventListener('click', () => {
            if ((!boardTypeSelect || boardTypeSelect.value === "") ||
                (!boardSizeSelect || boardSizeSelect.value === "")) {
                alert('Por favor, selecciona el Tipo de Tabla y el Tamaño.');
                return;
            }

            let messageBody = `¡Hola Boards & Cakes! 👋\n\nMe gustaría solicitar un presupuesto para la siguiente tabla gourmet:\n`;
            messageBody += `\n- *Tipo de Tabla:* ${currentBoardOrder.typeName}`;
            messageBody += `\n- *Tamaño:* ${currentBoardOrder.sizeName}`;

            const selectedTypeData = boardData.types.find(t => t.id === currentBoardOrder.type);
            if (selectedTypeData) {
                if (selectedTypeData.showCheeses && currentBoardOrder.cheeses.length > 0) {
                    messageBody += `\n- *Quesos Seleccionados:* ${currentBoardOrder.cheeses.join(', ')}`;
                }
                if (selectedTypeData.showCharcuterie && currentBoardOrder.charcuterie.length > 0) {
                    messageBody += `\n- *Charcutería Seleccionada:* ${currentBoardOrder.charcuterie.join(', ')}`;
                }
            }

            if (currentBoardOrder.accompaniments.length > 0) {
                messageBody += `\n- *Acompañantes:* ${currentBoardOrder.accompaniments.join(', ')}`;
            } else {
                messageBody += `\n- *Acompañantes:* Ninguno seleccionado`;
            }

            if (currentBoardOrder.notes && currentBoardOrder.notes !== "N/A") {
                 messageBody += `\n- *Notas Adicionales:* ${currentBoardOrder.notes}`;
            }

            messageBody += `\n\nEspero su contacto. ¡Gracias! 😊`;

            const whatsappNumber = "34000000000"; // Reemplazar con el número real
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageBody)}`;

            // console.log(messageBody); // Para depuración
            window.open(whatsappUrl, '_blank');
        });
    }

    // --- INICIALIZACIÓN ---
    toggleIngredientSections(); // Para el estado inicial del formulario
    updateBoardSummary();
});
