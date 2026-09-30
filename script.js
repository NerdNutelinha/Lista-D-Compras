console.log("LISTA BAIXADA COM SUCESSO");

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

function baixarLista() {
let texto = "🛒 LISTA DE COMPRAS\n\n";
let totalLista = 0;

const linhas = document.querySelectorAll('table tr');

linhas.forEach(linha => {
    const colunas = linha.querySelectorAll('td');

    if (colunas.length === 3) {
        const nome = colunas[0].textContent.trim();
        const checkbox = colunas[1].querySelector('input');
        const inputValor = colunas[2].querySelector('input');

        if (checkbox && checkbox.checked) {
            const valor = Number(inputValor.value) || 0;

            texto += `☑ ${nome} — R$ ${valor.toFixed(2).replace('.', ',')}\n`;

            totalLista += valor;
        }
    }
});

texto += `\nTOTAL: R$ ${totalLista.toFixed(2).replace('.', ',')}`;

const arquivo = new Blob([texto], {
    type: 'text/plain;charset=utf-8'
});

const link = document.createElement('a');

link.href = URL.createObjectURL(arquivo);
link.download = 'lista-de-compras.txt';

link.click();

URL.revokeObjectURL(link.href);


}

function limparLista() {
valores.forEach(input => {
input.value = '';
});

const caixas = document.querySelectorAll('input[type="checkbox"]');

caixas.forEach(checkbox => {
    checkbox.checked = false;
});

calcularTotal();


}
