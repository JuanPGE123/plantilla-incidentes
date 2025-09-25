// Opciones para el autocompletado del agrupador
const opcionesAgrupador = [
  "1. Aplicativo no carga / Lentitud / Intermitencia",
  "2. Capacitacion Aplicativo",
  "3. Informacion clientes (No carga / No arrastra / Errada)",
  "4. No permite cotizar",
  "5. No habilita campos / botones",
  "6. Error Descargar PDF",
  "7. Error consulta de polizas",
  "8. Error conversion de Poliza",
  "9. Solicitud en estado ACEPTADA",
  "10. No permite enviar solicitud electrónica",
  "11. Error en coberturas de la poliza",
  "12. Error en calculos de prima",
  "13. Intermitencia en Servicios del Cotizador",
  "14. Error en ingreso de asegurados / beneficiarios",
  "15. Error en valores de la poliza",
  "16. Excepciones de Negocio",
  "17. Error obtener detalles de la poliza",
  "18. Falta informacion importante por diligenciar",
  "19. Validacion  de Sarlaft",
  "21. Polizas duplicadas arrendamiento",
  "26. Viajes FV - Poliza Pendiente de Expedir",
  "30. Arrendamiento FV Envio de Comunicados CCM",
  "32. Descuento de Ley SOAT",
  "33. Error en la tarifa",
  "34. Alerta aplicativos",
];

// Autocompletado para agrupador_error
const inputAgrupador = document.getElementById("agrupador_error");
const listaSugerencias = document.getElementById("autocomplete");

inputAgrupador.addEventListener("input", function () {
  const valor = this.value.toLowerCase();
  listaSugerencias.innerHTML = "";
  if (!valor) return;
  const filtradas = opcionesAgrupador.filter(op => op.toLowerCase().includes(valor));
  filtradas.forEach(opcion => {
    const item = document.createElement("div");
    item.classList.add("autocomplete-item");
    item.textContent = opcion;
    item.addEventListener("click", function () {
      inputAgrupador.value = opcion;
      listaSugerencias.innerHTML = "";
      actualizarExternalTicket();
    });
    listaSugerencias.appendChild(item);
  });
});

document.addEventListener("click", function (e) {
  if (!e.target.closest(".campo")) {
    listaSugerencias.innerHTML = "";
  }
});

// Función auxiliar para obtener valor de un campo
function getValue(id) {
  return document.getElementById(id)?.value?.trim() || "";
}

// Función auxiliar para establecer valor de un campo
function setValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value;
}

// Validación de campos obligatorios
function validarCampos(campos) {
  for (const campo of campos) {
    const valor = getValue(campo.id);
    const elemento = document.getElementById(campo.id);
    if (campo.id === "agrupador_error" && !opcionesAgrupador.includes(valor)) {
      Swal.fire({
        icon: 'warning',
        title: 'Valor inválido',
        text: 'Por favor selecciona una opción válida del campo "Agrupador del Error".',
        confirmButtonText: 'Entendido'
      }).then(() => {
        setValue(campo.id, "");
        elemento.focus();
      });
      return false;
    }
    if (!valor) {
      mostrarToast(`Falta el campo "${campo.label}".`);
      elemento.focus();
      return false;
    }
  }
  return true;
}

// Genera el texto de solución usando template literals
function generarTexto() {
  const campos = [
    { id: "agrupador_error", label: "Agrupador del Error" },
    { id: "proceso_error", label: "Proceso del Error" },
    { id: "estado_raizal", label: "Estado Raizal" },
    { id: "responsable_solucion", label: "Responsable Solución" },
    { id: "descripcion_solucion", label: "Descripción de Solución" },
    { id: "causa_raiz", label: "Causa Raíz" },
    { id: "diagnostico", label: "Diagnóstico" },
    { id: "accion_ejecutada", label: "Acción Ejecutada" }
  ];
  if (!validarCampos(campos)) return;
  const texto = `
* Agrupador del Error: ${getValue("agrupador_error")}
* Proceso del Error: ${getValue("proceso_error")}
* HU Raizal / Mejora: ${getValue("hu_raizal")}
* Estado Raizal: ${getValue("estado_raizal")}
* Responsable Solución: ${getValue("responsable_solucion")}
* Diagnóstico: ${getValue("diagnostico")}
* Acción Ejecutada: ${getValue("accion_ejecutada")}
* Descripción de Solución: ${getValue("descripcion_solucion")}
* Confirmar operatividad del usuario Afectado: ${getValue("confirmacion_usuario")}
* ID Formulario de Solicitud de Credenciales: ${getValue("formulario_credenciales")}
* OC Acceso a PAM - (PAM): ${getValue("oc_pam")}
* Causa Raíz (Identificada/Sin Identificar): ${getValue("causa_raiz")}
  `;
  document.getElementById("resultado").textContent = texto;
}

// Actualización automática del campo "External Ticket"
function actualizarExternalTicket() {
  const aplicativo = getValue("aplicativo_afectado");
  const proceso = getValue("proceso_aplicativo");
  const agrupador = getValue("agrupador_error");
  // Solo usar agrupador si es válido
  const agrupadorValido = opcionesAgrupador.includes(agrupador) ? agrupador : "";
  const externo = [
    aplicativo ? aplicativo + "." : "",
    proceso ? proceso + " " : "",
    agrupadorValido
  ].join("").trim();
  document.getElementById("external_ticket").value = externo;
}

// Copiar texto generado al portapapeles
function copiarAlPortapapeles() {
  const texto = document.getElementById("resultado").textContent;
  navigator.clipboard.writeText(texto).then(() => {
    alert("Texto copiado al portapapeles 📋");
  }).catch(err => {
    alert("Error al copiar: " + err);
  });
}

// Copiar ticket externo al portapapeles
function copiarTicket() {
  const texto = document.getElementById("external_ticket").value;
  navigator.clipboard.writeText(texto).then(() => {
    mostrarToast("External Ticket copiado 📋");
  }).catch(err => {
    alert("Error al copiar ticket: " + err);
  });
}

// Actualización automática del campo "External Ticket"
document.getElementById("aplicativo_afectado")?.addEventListener("change", actualizarExternalTicket);
document.getElementById("proceso_aplicativo")?.addEventListener("change", actualizarExternalTicket);
document.getElementById("agrupador_error")?.addEventListener("input", actualizarExternalTicket);

// Toast para mensajes cortos
function mostrarToast(mensaje) {
  const toast = document.getElementById("toast");
  toast.textContent = mensaje;
  toast.className = "toast show";
  setTimeout(() => {
    toast.className = toast.className.replace("show", "");
  }, 3500);
}

// Limpiar todos los campos del formulario
function limpiarCampos() {
  const campos = document.querySelectorAll("#formulario input, #formulario select, #formulario textarea");
  campos.forEach(campo => {
    if (campo.type === "select-one") {
      campo.selectedIndex = 0;
    } else {
      campo.value = "";
    }
  });
  document.getElementById("resultado").textContent = "";
  document.getElementById("external_ticket").value = "";
}

// Validación prohibida para HU Raizal
document.getElementById("hu_raizal")?.addEventListener("input", function () {
  const valor = this.value.trim().toLowerCase();
  const prohibidos = ["n/a", "na", "no aplica"];
  if (prohibidos.includes(valor)) {
    Swal.fire({
      icon: 'warning',
      title: 'Valor inválido',
      text: 'No se permite ingresar "N/A", "NA" o "No aplica" en el campo HU Raizal / Mejora.',
      confirmButtonText: 'Entendido'
    }).then(() => {
      this.value = "";
      this.focus();
    });
  }
});
