document.addEventListener('DOMContentLoaded', () => {
    // --- DATOS SIMULADOS DE FAQs (Esto vendría de un CMS) ---
    const faqsData = [
        {
            question: "¿Con cuánta antelación debo realizar mi pedido?",
            answer: "<p>Para tartas personalizadas, recomendamos un mínimo de <strong>7 días de antelación</strong>. Para tablas gourmet, <strong>3-4 días</strong> suelen ser suficientes.</p><p>Siempre puedes consultarnos para pedidos urgentes; haremos todo lo posible por ayudarte según nuestra disponibilidad.</p>"
        },
        {
            question: "¿Realizan envíos a domicilio? ¿Zonas y costes?",
            answer: "<p>Sí, realizamos envíos en <strong>Barcelona Ciudad y Área Metropolitana</strong>. El coste de envío varía según la distancia y se calculará al confirmar tu pedido.</p><p>También ofrecemos la opción de recogida en nuestro taller ubicado en [Dirección del Taller - Placeholder]. Por favor, coordina la recogida con antelación.</p>"
        },
        {
            question: "¿Qué métodos de pago aceptan?",
            answer: "<p>Aceptamos pagos mediante <strong>transferencia bancaria y Bizum</strong>. Para confirmar tu pedido, solicitamos un pago por adelantado del 50% del total. El resto se abona antes de la entrega o en el momento de la recogida.</p>"
        },
        {
            question: "¿Puedo solicitar ingredientes específicos o informar sobre alergias?",
            answer: "<p>¡Por supuesto! Es muy importante para nosotros. Al realizar tu pedido, por favor, indícanos cualquier preferencia de ingredientes, alergias o intolerancias alimentarias (gluten, lactosa, frutos secos, etc.). Haremos todo lo posible por adaptar nuestras creaciones a tus necesidades de forma segura.</p>"
        },
        {
            question: "¿Cómo debo conservar mi tarta o tabla una vez recibida?",
            answer: "<p><strong>Tartas:</strong> La mayoría de nuestras tartas deben conservarse refrigeradas. Recomendamos sacarlas del frigorífico unos 20-30 minutos antes de consumir para que el bizcocho y las cremas estén a la temperatura ideal para apreciar todos sus sabores y texturas.</p><p><strong>Tablas Gourmet:</strong> Se disfrutan mejor a temperatura ambiente. Si no se van a consumir de inmediato, refrigéralas. Sácalas del frigorífico al menos 30-60 minutos antes de servir para que los quesos y embutidos expresen todo su sabor.</p><p>Te proporcionaremos instrucciones específicas de conservación con tu pedido.</p>"
        },
        {
            question: "¿Ofrecen opciones vegetarianas, veganas o sin gluten?",
            answer: "<p>Sí, podemos adaptar muchas de nuestras creaciones. Disponemos de opciones para tablas vegetarianas y podemos preparar tartas y algunos elementos de tablas sin gluten o veganos bajo pedido.</p><p>Por favor, especifica tus requerimientos al hacer tu consulta o pedido para que podamos informarte sobre las posibilidades y asegurar que todo se prepare con el cuidado necesario para evitar contaminación cruzada en caso de alergias severas.</p>"
        }
    ];

    // --- ELEMENTOS DEL DOM ---
    const faqContainer = document.getElementById('faq-container');

    // --- RENDERIZAR FAQs ---
    function renderFAQs() {
        if (!faqContainer) return;
        faqContainer.innerHTML = ''; // Limpiar

        faqsData.forEach(faq => {
            const faqItem = document.createElement('div');
            faqItem.className = 'faq-item';

            const questionButton = document.createElement('button');
            questionButton.className = 'faq-question';
            questionButton.setAttribute('aria-expanded', 'false'); // Para accesibilidad
            questionButton.innerHTML = `
                <span>${faq.question}</span>
                <span class="faq-icon">+</span>
            `;

            const answerDiv = document.createElement('div');
            answerDiv.className = 'faq-answer';
            answerDiv.innerHTML = faq.answer; // El HTML ya está en los datos

            faqItem.appendChild(questionButton);
            faqItem.appendChild(answerDiv);
            faqContainer.appendChild(faqItem);

            // Event listener para el acordeón
            questionButton.addEventListener('click', () => {
                const isActive = faqItem.classList.contains('active');

                // Opcional: cerrar todas las demás al abrir una (descomentar si se desea este comportamiento)
                // if (!isActive) {
                //     faqContainer.querySelectorAll('.faq-item.active').forEach(activeItem => {
                //         activeItem.classList.remove('active');
                //         activeItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                //         activeItem.querySelector('.faq-answer').style.maxHeight = null;
                //         activeItem.querySelector('.faq-icon').textContent = '+';
                //     });
                // }

                faqItem.classList.toggle('active');
                questionButton.setAttribute('aria-expanded', !isActive);

                if (faqItem.classList.contains('active')) {
                    answerDiv.style.maxHeight = answerDiv.scrollHeight + "px";
                    questionButton.querySelector('.faq-icon').textContent = '-';
                } else {
                    answerDiv.style.maxHeight = null;
                    questionButton.querySelector('.faq-icon').textContent = '+';
                }
            });
        });
    }

    // --- INICIALIZACIÓN ---
    if (faqsData && faqsData.length > 0) {
        renderFAQs();
    } else if (faqContainer) {
        faqContainer.innerHTML = "<p>No hay preguntas frecuentes disponibles en este momento.</p>";
    }
});
