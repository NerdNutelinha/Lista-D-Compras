console.log("LISTA BAIXADA COM SUCESSO");


const valores = document.querySelectorAll('.valor');
const quantidades = document.querySelectorAll('.quantidade');

const total = document.getElementById('total');
const totalFinal = document.getElementById('totalFinal');

const quantidadeSelecionada =
    document.getElementById('quantidadeSelecionada');


/* ================================
   CÁLCULO AUTOMÁTICO
================================ */

valores.forEach(input => {
    input.addEventListener('input', calcularTotal);
});

quantidades.forEach(input => {
    input.addEventListener('input', calcularTotal);
});


const caixas = document.querySelectorAll(
    '.produto input[type="checkbox"]'
);

caixas.forEach(checkbox => {
    checkbox.addEventListener('change', calcularTotal);
});


function calcularTotal() {

    let soma = 0;

    let selecionados = 0;


    const itens = document.querySelectorAll('.item');


    itens.forEach(item => {

        const checkbox =
            item.querySelector('input[type="checkbox"]');

        const quantidade =
            item.querySelector('.quantidade');

        const valor =
            item.querySelector('.valor');

        const subtotal =
            item.querySelector('.subtotal');


        const qtd = Number(quantidade.value) || 0;

        const preco = Number(valor.value) || 0;


        const valorItem = qtd * preco;


        subtotal.textContent =
            valorItem.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });


        if (checkbox.checked) {

            soma += valorItem;

            selecionados++;

        }

    });


    total.textContent =
        soma.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });


    totalFinal.textContent =
        soma.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });


    quantidadeSelecionada.textContent =
        selecionados;
}


/* ================================
   BAIXAR LISTA EM PDF
================================ */

function baixarLista() {

    const { jsPDF } = window.jspdf;


    const itens = document.querySelectorAll('.item');


    let totalLista = 0;

    let itensSelecionados = [];


    itens.forEach(item => {

        const checkbox =
            item.querySelector('input[type="checkbox"]');

        const nome =
            item.querySelector('.produto span').textContent.trim();

        const quantidade =
            item.querySelector('.quantidade');

        const valor =
            item.querySelector('.valor');


        if (checkbox.checked) {

            const qtd = Number(quantidade.value) || 0;

            const preco = Number(valor.value) || 0;

            const subtotal = qtd * preco;


            itensSelecionados.push({
                nome: nome,
                quantidade: qtd,
                valor: preco,
                subtotal: subtotal
            });


            totalLista += subtotal;
        }

    });


    if (itensSelecionados.length === 0) {

        alert(
            "Selecione pelo menos um item antes de baixar a lista."
        );

        return;
    }


    const pdf = new jsPDF();


    /* ================================
       CONFIGURAÇÕES
    ================================= */

    const margem = 20;

    let y = 25;


    /* ================================
       CABEÇALHO
    ================================= */

    pdf.setFillColor(22, 101, 52);

    pdf.roundedRect(
        margem,
        15,
        170,
        25,
        5,
        5,
        "F"
    );


    pdf.setTextColor(255, 255, 255);

    pdf.setFont("helvetica", "bold");

    pdf.setFontSize(20);

    pdf.text(
        "LISTA DE COMPRAS",
        105,
        31,
        {
            align: "center"
        }
    );


    pdf.setTextColor(80, 80, 80);

    pdf.setFont("helvetica", "normal");

    pdf.setFontSize(9);


    const data = new Date().toLocaleDateString(
        "pt-BR"
    );


    pdf.text(
        "Data: " + data,
        20,
        48
    );


    y = 58;


    /* ================================
       PERCORRER CATEGORIAS
    ================================= */

    const categorias =
        document.querySelectorAll('.categoria-bloco');


    categorias.forEach(categoria => {

        const itensCategoria =
            categoria.querySelectorAll('.item');


        let selecionadosCategoria = [];


        itensCategoria.forEach(item => {

            const checkbox =
                item.querySelector(
                    'input[type="checkbox"]'
                );


            if (checkbox.checked) {

                const nome =
                    item.querySelector(
                        '.produto span'
                    ).textContent.trim();


                const quantidade =
                    Number(
                        item.querySelector(
                            '.quantidade'
                        ).value
                    ) || 0;


                const valor =
                    Number(
                        item.querySelector(
                            '.valor'
                        ).value
                    ) || 0;


                selecionadosCategoria.push({

                    nome: nome,

                    quantidade: quantidade,

                    valor: valor,

                    subtotal:
                        quantidade * valor

                });

            }

        });


        if (selecionadosCategoria.length === 0) {
            return;
        }


        /* NOVA PÁGINA SE NECESSÁRIO */

        if (y > 260) {

            pdf.addPage();

            y = 20;

        }


        /* NOME DA CATEGORIA */

        const nomeCategoria =
            categoria.querySelector(
                '.categoria-titulo h2'
            ).textContent.trim();


        pdf.setFillColor(
            22,
            101,
            52
        );


        pdf.roundedRect(
            margem,
            y,
            170,
            10,
            2,
            2,
            "F"
        );


        pdf.setTextColor(
            255,
            255,
            255
        );


        pdf.setFont(
            "helvetica",
            "bold"
        );


        pdf.setFontSize(11);


        pdf.text(
            nomeCategoria,
            25,
            y + 7
        );


        y += 17;


        /* ITENS */

        selecionadosCategoria.forEach(item => {


            if (y > 275) {

                pdf.addPage();

                y = 20;

            }


            pdf.setTextColor(
                40,
                40,
                40
            );


            pdf.setFont(
                "helvetica",
                "bold"
            );


            pdf.setFontSize(10);


            pdf.text(
                item.nome,
                25,
                y
            );


            pdf.setFont(
                "helvetica",
                "normal"
            );


            pdf.setFontSize(9);


            const quantidadeTexto =
                formatarQuantidade(
                    item.quantidade
                );


            const valorTexto =
                formatarMoeda(
                    item.valor
                );


            const subtotalTexto =
                formatarMoeda(
                    item.subtotal
                );


            pdf.setTextColor(
                100,
                100,
                100
            );


            pdf.text(
                quantidadeTexto +
                " × " +
                valorTexto,
                25,
                y + 6
            );


            pdf.setTextColor(
                22,
                101,
                52
            );


            pdf.setFont(
                "helvetica",
                "bold"
            );


            pdf.text(
                subtotalTexto,
                165,
                y + 3,
                {
                    align: "right"
                }
            );


            pdf.setDrawColor(
                225,
                225,
                225
            );


            pdf.setLineWidth(
                0.2
            );


            pdf.line(
                20,
                y + 10,
                190,
                y + 10
            );


            y += 17;

        });


        y += 7;

    });


    /* ================================
       TOTAL
    ================================= */

    if (y > 260) {

        pdf.addPage();

        y = 25;

    }


    pdf.setFillColor(
        220,
        252,
        231
    );


    pdf.roundedRect(
        margem,
        y,
        170,
        25,
        4,
        4,
        "F"
    );


    pdf.setTextColor(
        22,
        101,
        52
    );


    pdf.setFont(
        "helvetica",
        "bold"
    );


    pdf.setFontSize(13);


    pdf.text(
        "TOTAL DA COMPRA",
        27,
        y + 10
    );


    pdf.setFontSize(16);


    pdf.text(
        formatarMoeda(totalLista),
        165,
        y + 11,
        {
            align: "right"
        }
    );


    /* ================================
       RODAPÉ
    ================================= */

    pdf.setTextColor(
        130,
        130,
        130
    );


    pdf.setFont(
        "helvetica",
        "normal"
    );


    pdf.setFontSize(8);


    pdf.text(
        "Lista de compras",
        105,
        290,
        {
            align: "center"
        }
    );


    /* ================================
       DOWNLOAD
    ================================= */

    pdf.save(
        "lista-de-compras.pdf"
    );
}


/* ================================
   FORMATAR MOEDA
================================ */

function formatarMoeda(valor) {

    return valor.toLocaleString(
        'pt-BR',
        {
            style: 'currency',
            currency: 'BRL'
        }
    );
}


/* ================================
   FORMATAR QUANTIDADE
================================ */

function formatarQuantidade(valor) {

    return valor.toLocaleString(
        'pt-BR',
        {
            maximumFractionDigits: 2
        }
    );
}


/* ================================
   LIMPAR LISTA
================================ */

function limparLista() {

    const itens =
        document.querySelectorAll('.item');


    itens.forEach(item => {

        const checkbox =
            item.querySelector(
                'input[type="checkbox"]'
            );


        const quantidade =
            item.querySelector(
                '.quantidade'
            );


        const valor =
            item.querySelector(
                '.valor'
            );


        checkbox.checked = false;

        quantidade.value = 0;

        valor.value = '';


    });


    calcularTotal();
}


/* ================================
   CÁLCULO INICIAL
================================ */

calcularTotal();
