document.addEventListener('DOMContentLoaded', () => {
    // --- DATOS SIMULADOS DE LA GALERÍA (Esto vendría de un CMS) ---
    const galleryImages = [
        { id: 1, url: 'images/galeria-placeholder-tarta.jpg', title: 'Tarta de Chocolate Festiva', category: 'tarta', description: 'Drip cake de chocolate con frutos rojos y detalles dorados.' },
        { id: 2, url: 'images/galeria-placeholder-tabla.jpg', title: 'Tabla Mixta Clásica', category: 'tabla', description: 'Selección de quesos y charcutería con acompañamientos.' },
        { id: 3, url: 'images/galeria-placeholder-tarta.jpg', title: 'Naked Cake de Boda', category: 'tarta', description: 'Elegante naked cake con flores naturales para bodas.' },
        { id: 4, url: 'images/galeria-placeholder-tarta.jpg', title: 'Tarta Infantil Temática', category: 'tarta', description: 'Divertida tarta con temática de animales para cumpleaños.' },
        { id: 5, url: 'images/galeria-placeholder-tabla.jpg', title: 'Tabla de Quesos Premium', category: 'tabla', description: 'Variedad de quesos internacionales y nacionales.' },
        { id: 6, url: 'images/galeria-placeholder-tarta.jpg', title: 'Vintage Cake Floral', category: 'tarta', description: 'Delicada tarta vintage con decoración de buttercream floral.' },
        { id: 7, url: 'images/galeria-placeholder-tabla.jpg', title: 'Tabla de Charcutería Ibérica', category: 'tabla', description: 'Exquisitos embutidos ibéricos de bellota.' },
        { id: 8, url: 'images/galeria-placeholder-tarta.jpg', title: 'Letter Cake "A"', category: 'tarta', description: 'Number cake en forma de letra A, decorada con macarons y frutas.' },
        { id: 9, url: 'images/galeria-placeholder-tabla.jpg', title: 'Tabla de Brunch Completa', category: 'tabla', description: 'Todo lo necesario para un brunch delicioso y variado.' },
        { id: 10, url: 'images/galeria-placeholder-tarta.jpg', title: 'Mini Tartas Individuales', category: 'tarta', description: 'Pequeñas delicias para eventos o mesas dulces.' }
    ];

    // --- ELEMENTOS DEL DOM ---
    const galleryGrid = document.getElementById('gallery-grid');
    const filterButtonsContainer = document.getElementById('gallery-filters');
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');

    // --- RENDERIZAR GALERÍA ---
    function renderGallery(imagesToRender) {
        if (!galleryGrid) return;
        galleryGrid.innerHTML = ''; // Limpiar galería actual

        imagesToRender.forEach(image => {
            const item = document.createElement('div');
            item.className = 'gallery-item show'; // 'show' para animación fadeIn
            item.dataset.category = image.category;

            item.innerHTML = `
                <img src="${image.url}" alt="${image.title}">
                <div class="gallery-item-info">
                    <h3>${image.title}</h3>
                    <p>${image.description}</p>
                </div>
            `;

            // Event listener para el lightbox
            item.addEventListener('click', () => openLightbox(image));

            galleryGrid.appendChild(item);
        });
    }

    // --- FILTRAR GALERÍA ---
    function filterGallery(filter) {
        const allItems = galleryGrid ? Array.from(galleryGrid.children) : [];

        allItems.forEach(item => {
            item.classList.remove('show'); // Quitar para re-animar si es necesario
            item.classList.add('hide');
        });

        // Pequeño delay para que la animación de "hide" se note antes de "show"
        setTimeout(() => {
            let filteredImages;
            if (filter === 'all') {
                filteredImages = galleryImages;
            } else {
                filteredImages = galleryImages.filter(image => image.category === filter);
            }
            // En una implementación más compleja, no se re-renderizaría todo, solo se mostrarían/ocultarían
            // Pero para este ejemplo con pocos items, re-renderizar es más simple.
            // O, alternativamente, simplemente cambiar clases 'hide'/'show' en los items existentes.

            allItems.forEach(item => {
                const itemCategory = item.dataset.category;
                if (filter === 'all' || itemCategory === filter) {
                    item.classList.remove('hide');
                    item.classList.add('show');
                } else {
                    item.classList.remove('show');
                    item.classList.add('hide');
                }
            });
        }, 100); // Ajustar delay si es necesario

    }

    // --- LÓGICA PARA BOTONES DE FILTRO ---
    if (filterButtonsContainer) {
        const buttons = filterButtonsContainer.querySelectorAll('.filter-button');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                // Quitar clase 'active' de todos los botones
                buttons.forEach(btn => btn.classList.remove('active'));
                // Añadir 'active' al botón clickeado
                button.classList.add('active');

                const filterValue = button.dataset.filter;
                filterGallery(filterValue);
            });
        });
    }

    // --- LÓGICA DEL LIGHTBOX ---
    function openLightbox(image) {
        if (!lightboxModal || !lightboxImage || !lightboxCaption) return;
        lightboxImage.src = image.url;
        lightboxCaption.textContent = image.title + (image.description ? ` - ${image.description}` : '');
        lightboxModal.style.display = "block";
    }

    function closeLightbox() {
        if (!lightboxModal) return;
        lightboxModal.style.display = "none";
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    if (lightboxModal) {
        // Cerrar al hacer clic fuera de la imagen (en el fondo oscuro)
        lightboxModal.addEventListener('click', (event) => {
            if (event.target === lightboxModal) {
                closeLightbox();
            }
        });
        // Cerrar con la tecla Escape
        document.addEventListener('keydown', (event) => {
            if (event.key === "Escape" && lightboxModal.style.display === "block") {
                closeLightbox();
            }
        });
    }


    // --- INICIALIZACIÓN ---
    // Renderizar todos los items al cargar la página
    // En lugar de llamar a filterGallery('all'), que manipula clases en items existentes,
    // llamamos a renderGallery con todas las imágenes para la carga inicial.
    if (galleryImages && galleryImages.length > 0) {
        renderGallery(galleryImages);
    } else if(galleryGrid) {
        galleryGrid.innerHTML = "<p>No hay imágenes en la galería en este momento.</p>";
    }
});
