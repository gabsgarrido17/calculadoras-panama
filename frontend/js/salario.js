// salario.js
// Lógica de la calculadora de salario neto

function calcularSalarioNetoLocal(salarioBruto) {
  const css = 0.0975;
  const seguroEducativo = 0.0125;

  const deduccionCSS = salarioBruto * css;
  const deduccionSeguroEducativo = salarioBruto * seguroEducativo;

  const salarioAnual = salarioBruto * 12;
  let impuestoAnual = 0;

  if (salarioAnual > 50000) {
    impuestoAnual = (50000 - 11000) * 0.15 + (salarioAnual - 50000) * 0.25;
  } else if (salarioAnual > 11000) {
    impuestoAnual = (salarioAnual - 11000) * 0.15;
  }

  const impuestoMensual = impuestoAnual / 12;
  const salarioNeto = salarioBruto - deduccionCSS - deduccionSeguroEducativo - impuestoMensual;

  return {
    salarioBruto,
    deduccionCSS,
    deduccionSeguroEducativo,
    impuestoISR: impuestoMensual,
    salarioNeto
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('salary-form');
  const resultDiv = document.getElementById('result');
  const alertDiv = document.getElementById('alert');
  const shareSection = document.getElementById('share-buttons');
  let ultimoResultado = null;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alertDiv.style.display = 'none';
    resultDiv.style.display = 'none';
    shareSection.style.display = 'none';

    const salarioBruto = parseFloat(document.getElementById('salary').value);
    if (isNaN(salarioBruto) || salarioBruto <= 0) {
      alertDiv.textContent = 'Por favor ingresa un salario bruto válido.';
      alertDiv.style.display = 'block';
      return;
    }

    const data = calcularSalarioNetoLocal(salarioBruto);
    mostrarResultado(data);
  });

  function mostrarResultado(data) {
    ultimoResultado = data;
    resultDiv.innerHTML = `
      <h4>Resultado</h4>
      <p><strong>Bruto:</strong> ${data.salarioBruto.toFixed(2)}</p>
      <p><strong>CSS (9.75%):</strong> ${data.deduccionCSS.toFixed(2)}</p>
      <p><strong>Seguro Educativo (1.25%):</strong> ${data.deduccionSeguroEducativo.toFixed(2)}</p>
      <p><strong>ISR mensual:</strong> ${data.impuestoISR.toFixed(2)}</p>
      <p><strong>Salario Neto:</strong> ${data.salarioNeto.toFixed(2)}</p>
    `;
    resultDiv.style.display = 'block';
    shareSection.style.display = 'block';
  }

  document.getElementById('share-whatsapp').addEventListener('click', () => {
    if (!ultimoResultado) return;
    const neto = ultimoResultado.salarioNeto.toFixed(2);
    const mensaje = encodeURIComponent(`Mi salario neto mensual es ${neto} según calculadoras.com.pa`);
    window.open(`https://wa.me/?text=${mensaje}`, '_blank');
  });

  document.getElementById('copy-link').addEventListener('click', () => {
    const copyConfirmation = document.getElementById('copy-confirmation');
    navigator.clipboard.writeText(window.location.href).then(() => {
      copyConfirmation.style.display = 'inline';
      setTimeout(() => copyConfirmation.style.display = 'none', 2000);
    });
  });
});
