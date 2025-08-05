const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Permitir solicitudes desde cualquier origen para facilitar las pruebas localmente.
app.use(cors());

/**
 * Calcula el salario neto mensual a partir de un salario bruto mensual.
 *
 * @param {number} salarioBruto - Salario bruto mensual.
 * @returns {object} Un objeto con el desglose de deducciones y el salario neto.
 */
function calcularSalarioNeto(salarioBruto) {
  const socialSecurityRate = 0.0975; // 9.75% aporte del trabajador
  const educationRate = 0.0125;      // 1.25% aporte del trabajador

  // Deducciones mensuales
  const deduccionCSS = salarioBruto * socialSecurityRate;
  const deduccionSeguroEducativo = salarioBruto * educationRate;

  // Calcular ISR anual según las tablas vigentes
  const salarioAnual = salarioBruto * 12;
  let impuestoAnual = 0;
  if (salarioAnual > 50000) {
    impuestoAnual = (50000 - 11000) * 0.15 + (salarioAnual - 50000) * 0.25;
  } else if (salarioAnual > 11000) {
    impuestoAnual = (salarioAnual - 11000) * 0.15;
  }
  const impuestoMensual = impuestoAnual / 12;

  // Salario neto mensual
  const salarioNeto = salarioBruto - deduccionCSS - deduccionSeguroEducativo - impuestoMensual;

  return {
    salarioBruto,
    deduccionCSS,
    deduccionSeguroEducativo,
    impuestoISR: impuestoMensual,
    salarioNeto
  };
}

// Ruta API para calcular salario neto
app.get('/api/salario-neto', (req, res) => {
  const salarioBrutoParam = req.query.salario_bruto;
  const salarioBruto = parseFloat(salarioBrutoParam);
  if (Number.isNaN(salarioBruto) || salarioBruto <= 0) {
    return res.status(400).json({ error: 'Parámetro salario_bruto inválido' });
  }
  const resultado = calcularSalarioNeto(salarioBruto);
  res.json(resultado);
});

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor de calculadoras-panama escuchando en el puerto ${PORT}`);
});

// Exportar la función para uso en pruebas o cálculo local
module.exports = { calcularSalarioNeto };
