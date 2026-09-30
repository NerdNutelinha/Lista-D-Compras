javascript
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

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF();

    let texto = "🛒 LISTA DE COMPRAS\n\n";
    let totalLista = 0;

    const linhas = document.querySelectorAll('table tr');

    let itens = [];

    linhas.forEach(linha => {

        const colunas = linha.querySelectorAll('td');

        if (colunas.length === 3) {

            const nome = colunas[0].textContent.trim();
            const checkbox = colunas[1].querySelector('input');
            const inputValor = colunas[2].querySelector('input');

            if (checkbox && checkbox.checked) {

                const valor = Number(inputValor.value) || 0;

                itens.push({
                    nome: nome,
                    valor: valor
                });

                totalLista += valor;
            }
        }
    });

    /* CABEÇALHO */

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.text("LISTA DE COMPRAS", 105, 25, {
        align: "center"
    });

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");

    const data = new Date().toLocaleDateString("pt-BR");

    pdf.text("Data: " + data, 20, 35);

    /* LINHA */

    pdf.setDrawColor(22, 101, 52);
    pdf.setLineWidth(1);
    pdf.line(20, 40, 190, 40);

    /* CABEÇALHO DA TABELA */

    let y = 52;

    pdf.setFillColor(22, 101, 52);
    pdf.rect(20, y - 7, 170, 10, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);

    pdf.text("ITEM", 25, y);
    pdf.text("VALOR", 165, y);

    y += 12;

    pdf.setTextColor(30, 41, 59);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);

    /* ITENS */

    itens.forEach(item => {

        if (y > 270) {
            pdf.addPage();
            y = 20;
        }

        pdf.text("✓ " + item.nome, 25, y);

        pdf.text(
            "R$ " + item.valor.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }),
            165,
            y
        );

        pdf.setDrawColor(220, 226, 232);
        pdf.setLineWidth(0.2);
        pdf.line(20, y + 3, 190, y + 3);

        y += 10;
    });

    /* TOTAL */

    y += 10;

    pdf.setFillColor(240, 247, 242);
    pdf.roundedRect(20, y - 7, 170, 18, 3, 3, "F");

    pdf.setTextColor(22, 101, 52);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);

    pdf.text("TOTAL PREVISTO", 27, y + 4);

    pdf.text(
        "R$ " + totalLista.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }),
        165,
        y + 4
    );

    /* RODAPÉ */

    pdf.setTextColor(120, 120, 120);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);

    pdf.text(
        "Lista de compras gerada pelo site",
        105,
        290,
        { align: "center" }
    );

    /* DOWNLOAD */

    pdf.save("lista-de-compras.pdf");
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
