document.addEventListener('DOMContentLoaded', function () {
    const pqrsCheckbox = document.getElementById('pqrs-checkbox');
    const pqrsField = document.querySelector('.pqrs-field');
    const pqrsSelect = document.getElementById('pqrs-type');
    const contactForm = document.getElementById('contactForm');

    // --- Campos adicionales ---
    const tipoUsuario = document.getElementById('tipo_usuario');
    const empresaField = document.getElementById('empresaField');

    tipoUsuario.addEventListener('change', () => {
        if (tipoUsuario.value === 'Empresa') {
            empresaField.style.display = 'flex';
            empresaField.querySelector('input').setAttribute('required', 'required');
        } else {
            empresaField.style.display = 'none';
            empresaField.querySelector('input').removeAttribute('required');
        }
    });

    // --- Mostrar/ocultar campo PQRS ---
    function togglePqrsField() {
        if (pqrsCheckbox.checked) {
            pqrsField.style.display = 'flex';
            pqrsSelect.setAttribute('required', 'required');

            setTimeout(() => {
                pqrsField.style.opacity = '1';
                pqrsField.style.transform = 'translateY(0)';
            }, 10);
        } else {
            pqrsField.style.opacity = '0';
            pqrsField.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                pqrsField.style.display = 'none';
                pqrsSelect.removeAttribute('required');
            }, 300);
        }
    }

    pqrsCheckbox.addEventListener('change', togglePqrsField);

    // --- Ocultar PQRS de forma inmediata (para reset) ---
    function hidePqrsImmediately() {
        pqrsField.style.transition = 'none';
        pqrsField.style.opacity = '0';
        pqrsField.style.transform = 'translateY(-10px)';
        pqrsField.style.display = 'none';
        pqrsSelect.removeAttribute('required');
        pqrsCheckbox.checked = false;

        setTimeout(() => pqrsField.style.transition = '', 10);
    }

    // --- Envío del formulario ---
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!this.checkValidity()) {
            this.reportValidity();
            return;
        }

        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;

        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());

        enviarEmail(data)
            .then(() => {
                mostrarMensaje('¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.', 'success');
                contactForm.reset();
                hidePqrsImmediately();

                // Ocultar campo empresa después del reset
                empresaField.style.display = 'none';
                empresaField.querySelector('input').removeAttribute('required');
            })
            .catch(error => {
                console.error('Error:', error);
                mostrarMensaje('Error al enviar el mensaje. Por favor, intente nuevamente.', 'error');
            })
            .finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
    });

    // --- Función para enviar con EmailJS ---
    async function enviarEmail(data) {
        emailjs.init("xAutAm-M1MLuByih8");

        return emailjs.send("service_579ug0o", "template_hl1npbl", {
            nombre: data.nombre,
            documento: data.CC,
            email: data.email,
            telefono: data.telefono || "No proporcionado",
            es_pqrs: data.es_pqrs ? "Sí" : "No",
            tipo_pqrs: data.tipo_pqrs || "No aplica",
            tipo_usuario: data.tipo_usuario,
            empresa: data.empresa || "No aplica",
            tipo_servicio: data.tipo_servicio,
            mensaje: data.mensaje || ""
        });
    }

    // --- Mostrar mensajes de feedback ---
    function mostrarMensaje(mensaje, tipo) {
        document.querySelectorAll('.form-message').forEach(msg => msg.remove());

        const mensajeElement = document.createElement('div');
        mensajeElement.className = `form-message ${tipo}`;
        mensajeElement.textContent = mensaje;
        mensajeElement.style.cssText = `
            padding: 15px;
            margin: 15px 0;
            border-radius: 8px;
            font-weight: 500;
            text-align: center;
        `;

        if (tipo === 'success') {
            mensajeElement.style.backgroundColor = '#d4edda';
            mensajeElement.style.color = '#155724';
            mensajeElement.style.border = '1px solid #c3e6cb';
        } else {
            mensajeElement.style.backgroundColor = '#f8d7da';
            mensajeElement.style.color = '#721c24';
            mensajeElement.style.border = '1px solid #f5c6cb';
        }

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        contactForm.insertBefore(mensajeElement, submitBtn);

        setTimeout(() => mensajeElement.remove(), 5000);
    }
});
