let tempChart;
let distData = [];
let timeData = [];

document.addEventListener('DOMContentLoaded', (event) => {
    const tempCtx = document.getElementById('distanciaChart').getContext('2d');

    function createChart() {
        return new Chart(tempCtx, {
            type: 'line',
            data: {
                labels: timeData,
                datasets: [{
                    label: 'Distância (cm)',
                    data: distData,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'minute'
                        },
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function updateCharts(data) {
        // Limpar os dados anteriores
        timeData.length = 0;
        distData.length = 0;
        data.forEach(entry => {
            const time = new Date(entry.created_at);
            const dist = parseFloat(entry.value);

            timeData.push(time);
            distData.push(dist);
        });

        // Se o gráfico já existir, destruí-lo
        if (tempChart) {
            tempChart.destroy();
        }

        // Criar um novo gráfico com os dados atualizados
        tempChart = createChart();
    }

    //função para fazer o get na API que resgata os dados
    window.fetchAndUpdateData = function () {
        fetch('/data?nomeRio=Xanxerê')
            .then(response => response.json())
            .then(data => {
                updateCharts(data);
            })
            .catch(error => {
                console.error('Erro ao buscar dados:', error);
            });
    };

    //intervalo entre as atualizações
    setInterval(fetchAndUpdateData, 30000); // 30000 ms = 30 segundos
    fetchAndUpdateData();
});

function sendSMS() {

    const nomeRio = "Xanxerê"
    const url = `/sendSMS?nomeRio=${nomeRio}`;
    document.getElementById('status').innerText = 'Enviando SMS...';
    fetch(url).then(response => {
        if (response.ok) {
            response.json().then(data => {
                if(data.success == true) {
                    document.getElementById('status').innerText = 'SMS enviado com sucesso';
                } else {
                    document.getElementById('status').innerText = data.message;
                }
            });
        } else {
            alert('Erro ao enviar SMS');
            document.getElementById('status').innerText = 'Erro ao enviar SMS';
        }
    });

}