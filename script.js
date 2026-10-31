/* ==========================================================================
   LÓGICA JAVASCRIPT - PROYECTO SENA: MEDIDOR DE CALORÍAS
   Interactividad: Calculadora de plato, Calculadora TDEE, Menú y Navegación
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // -------------------------------------------------------------------------
  // 1. MENÚ MÓVIL RESPONSIVO
  // -------------------------------------------------------------------------
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      navToggle.innerHTML = isOpen ? '✕' : '☰';
    });

    // Cerrar menú al hacer clic en cualquier enlace
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.innerHTML = '☰';
      });
    });
  }

  // -------------------------------------------------------------------------
  // 2. TABS INTERACTIVOS (Calculadora de Plato vs Gasto Diario)
  // -------------------------------------------------------------------------
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });

  // -------------------------------------------------------------------------
  // 3. BASE DE DATOS DE ALIMENTOS TÍPICOS (Valores por cada 100g crudos/cocidos)
  // -------------------------------------------------------------------------
  const foodDatabase = [
    { id: 'pollo', name: 'Pechuga de Pollo cocida', kcal: 165, prot: 31, carb: 0, fat: 3.6 },
    { id: 'arroz', name: 'Arroz blanco cocido', kcal: 130, prot: 2.7, carb: 28, fat: 0.3 },
    { id: 'huevo', name: 'Huevo entero (1 unid aprox 50g = 100g base)', kcal: 155, prot: 13, carb: 1.1, fat: 11 },
    { id: 'aguacate', name: 'Aguacate Hass', kcal: 160, prot: 2, carb: 8.5, fat: 14.7 },
    { id: 'platano', name: 'Plátano maduro cocido', kcal: 122, prot: 1.3, carb: 32, fat: 0.4 },
    { id: 'frijol', name: 'Fríjoles cocidos', kcal: 127, prot: 8.7, carb: 22.8, fat: 0.5 },
    { id: 'papa', name: 'Papa cocida', kcal: 87, prot: 1.9, carb: 20.1, fat: 0.1 },
    { id: 'arepa', name: 'Arepa de maíz blanco', kcal: 175, prot: 3.5, carb: 36, fat: 1.8 },
    { id: 'aceite', name: 'Aceite de Oliva / Vegetal', kcal: 884, prot: 0, carb: 0, fat: 100 },
    { id: 'avena', name: 'Hojuelas de avena en seco', kcal: 389, prot: 16.9, carb: 66, fat: 6.9 },
    { id: 'manzana', name: 'Manzana fresca', kcal: 52, prot: 0.3, carb: 14, fat: 0.2 },
    { id: 'carne', name: 'Carne de res magra cocida', kcal: 217, prot: 26, carb: 0, fat: 12 }
  ];

  // Llenar el selector de alimentos
  const foodSelect = document.getElementById('foodSelect');
  if (foodSelect) {
    foodDatabase.forEach(item => {
      const option = document.createElement('option');
      option.value = item.id;
      option.textContent = `${item.name} (${item.kcal} kcal / 100g)`;
      foodSelect.appendChild(option);
    });
  }

  // -------------------------------------------------------------------------
  // 4. CALCULADORA DE PLATO (ESTADO Y CÁLCULOS)
  // -------------------------------------------------------------------------
  let currentPlate = [
    { name: 'Pechuga de Pollo cocida', grams: 150, kcal: 247.5, prot: 46.5, carb: 0, fat: 5.4 },
    { name: 'Arroz blanco cocido', grams: 180, kcal: 234, prot: 4.9, carb: 50.4, fat: 0.5 },
    { name: 'Aguacate Hass', grams: 50, kcal: 80, prot: 1, carb: 4.25, fat: 7.35 }
  ];

  const plateListEl = document.getElementById('plateList');
  const totalKcalEl = document.getElementById('totalKcal');
  const totalProtEl = document.getElementById('totalProt');
  const totalCarbEl = document.getElementById('totalCarb');
  const totalFatEl = document.getElementById('totalFat');

  const barProt = document.getElementById('barProt');
  const barCarb = document.getElementById('barCarb');
  const barFat = document.getElementById('barFat');

  // Función para recalcular y renderizar el plato
  function renderPlate() {
    if (!plateListEl) return;

    plateListEl.innerHTML = '';

    let totalKcal = 0;
    let totalProt = 0;
    let totalCarb = 0;
    let totalFat = 0;

    if (currentPlate.length === 0) {
      plateListEl.innerHTML = `
        <div style="text-align: center; padding: 25px; color: var(--text-muted); font-size: 0.9rem;">
          Tu plato está vacío. Selecciona un alimento y cantidad arriba para comenzar a medir.
        </div>
      `;
    } else {
      currentPlate.forEach((item, index) => {
        totalKcal += item.kcal;
        totalProt += item.prot;
        totalCarb += item.carb;
        totalFat += item.fat;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'plate-item';
        itemDiv.innerHTML = `
          <div class="plate-item-info">
            <strong>${item.name} (${item.grams}g)</strong>
            <span>${item.kcal.toFixed(1)} kcal | P: ${item.prot.toFixed(1)}g · C: ${item.carb.toFixed(1)}g · G: ${item.fat.toFixed(1)}g</span>
          </div>
          <button class="btn-remove" data-index="${index}" title="Eliminar alimento">✕</button>
        `;
        plateListEl.appendChild(itemDiv);
      });
    }

    // Actualizar números en la tarjeta
    if (totalKcalEl) totalKcalEl.textContent = Math.round(totalKcal);
    if (totalProtEl) totalProtEl.textContent = `${totalProt.toFixed(1)}g`;
    if (totalCarbEl) totalCarbEl.textContent = `${totalCarb.toFixed(1)}g`;
    if (totalFatEl) totalFatEl.textContent = `${totalFat.toFixed(1)}g`;

    // Porcentaje calórico de cada macronutriente
    // Proteína: 4 kcal/g, Carbohidratos: 4 kcal/g, Grasa: 9 kcal/g
    const kcalFromProt = totalProt * 4;
    const kcalFromCarb = totalCarb * 4;
    const kcalFromFat = totalFat * 9;
    const calculatedSum = kcalFromProt + kcalFromCarb + kcalFromFat || 1;

    const pctProt = Math.round((kcalFromProt / calculatedSum) * 100);
    const pctCarb = Math.round((kcalFromCarb / calculatedSum) * 100);
    const pctFat = Math.round((kcalFromFat / calculatedSum) * 100);

    if (barProt) barProt.style.width = `${pctProt}%`;
    if (barCarb) barCarb.style.width = `${pctCarb}%`;
    if (barFat) barFat.style.width = `${pctFat}%`;

    // Asignar eventos de eliminación
    document.querySelectorAll('.btn-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.getAttribute('data-index'), 10);
        currentPlate.splice(idx, 1);
        renderPlate();
      });
    });
  }

  // Evento: Agregar alimento al plato
  const btnAddFood = document.getElementById('btnAddFood');
  const foodGramsInput = document.getElementById('foodGrams');

  if (btnAddFood && foodSelect && foodGramsInput) {
    btnAddFood.addEventListener('click', (e) => {
      e.preventDefault();
      const foodId = foodSelect.value;
      const grams = parseFloat(foodGramsInput.value);

      if (!foodId) {
        alert('Por favor selecciona un alimento.');
        return;
      }

      if (isNaN(grams) || grams <= 0) {
        alert('Por favor ingresa una cantidad válida en gramos (ej. 100).');
        return;
      }

      const selectedFood = foodDatabase.find(f => f.id === foodId);
      if (selectedFood) {
        const factor = grams / 100;
        currentPlate.push({
          name: selectedFood.name,
          grams: grams,
          kcal: selectedFood.kcal * factor,
          prot: selectedFood.prot * factor,
          carb: selectedFood.carb * factor,
          fat: selectedFood.fat * factor
        });

        foodGramsInput.value = '';
        renderPlate();
      }
    });
  }

  // Evento: Limpiar plato completo
  const btnClearPlate = document.getElementById('btnClearPlate');
  if (btnClearPlate) {
    btnClearPlate.addEventListener('click', () => {
      if (currentPlate.length > 0 && confirm('¿Deseas vaciar todos los alimentos de tu plato?')) {
        currentPlate = [];
        renderPlate();
      }
    });
  }

  // Render inicial del plato
  renderPlate();

  // -------------------------------------------------------------------------
  // 5. CALCULADORA DE REQUERIMIENTO ENERGÉTICO (TDEE / BMR)
  // Fórmula Mifflin - St Jeor (La más precisa clínicamente)
  // -------------------------------------------------------------------------
  const tdeeForm = document.getElementById('tdeeForm');
  if (tdeeForm) {
    tdeeForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const gender = document.getElementById('tdeeGender').value;
      const age = parseInt(document.getElementById('tdeeAge').value, 10);
      const weight = parseFloat(document.getElementById('tdeeWeight').value);
      const height = parseFloat(document.getElementById('tdeeHeight').value);
      const activity = parseFloat(document.getElementById('tdeeActivity').value);

      if (!gender || isNaN(age) || isNaN(weight) || isNaN(height) || isNaN(activity)) {
        alert('Por favor completa todos los campos con valores numéricos válidos.');
        return;
      }

      // Ecuación Mifflin-St Jeor:
      // Hombres: (10 × peso en kg) + (6.25 × altura en cm) - (5 × edad) + 5
      // Mujeres: (10 × peso en kg) + (6.25 × altura en cm) - (5 × edad) - 161
      let bmr = (10 * weight) + (6.25 * height) - (5 * age);
      if (gender === 'male') {
        bmr += 5;
      } else {
        bmr -= 161;
      }

      const tdee = Math.round(bmr * activity);
      const deficit = Math.round(tdee - 450); // Pérdida de grasa saludable
      const surplus = Math.round(tdee + 350); // Ganancia de masa muscular

      // Mostrar resultados
      document.getElementById('resBMR').textContent = `${Math.round(bmr)} kcal`;
      document.getElementById('resTDEE').textContent = `${tdee} kcal`;
      document.getElementById('resDeficit').textContent = `${deficit} kcal`;
      document.getElementById('resSurplus').textContent = `${surplus} kcal`;

      const resultsWrapper = document.getElementById('tdeeResults');
      if (resultsWrapper) {
        resultsWrapper.style.display = 'block';
        resultsWrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  // -------------------------------------------------------------------------
  // 6. FORMULARIO DE CONTACTO (Feedback visual amigable)
  // -------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const contactAlert = document.getElementById('contactAlert');

  if (contactForm && contactAlert) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      contactAlert.className = 'form-alert success';
      contactAlert.textContent = '¡Gracias por tu mensaje! Tu consulta ha sido enviada exitosamente en este entorno de prueba SENA.';
      contactForm.reset();

      setTimeout(() => {
        contactAlert.style.display = 'none';
      }, 5000);
    });
  }

  // -------------------------------------------------------------------------
  // 7. ACTUALIZAR AÑO EN EL FOOTER
  // -------------------------------------------------------------------------
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

});
