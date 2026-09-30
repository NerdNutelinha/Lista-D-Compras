const valores = document.querySelectorAll('input[type="number"]');
const total = document.getElementById('total');

valores.forEach(input => {
input.addEventListener('input', calcularTotal);
});

function calcularTotal() {
let soma = 0;

valores.forEach(input => {
    soma += Number(input.value) || 0;
});

total.textContent = soma.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

}
