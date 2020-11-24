console.log("starting")

let i = 1
var serverStats = {}
let label = []
var socket = io();
var cpu = document.getElementById('cpu').getContext('2d');
var ram = document.getElementById('ram').getContext('2d');
var cpuGen = document.getElementById('cpuGen').getContext('2d');
var ramGen = document.getElementById('ramGen').getContext('2d');
var driveGen = document.getElementById('driveGen').getContext('2d');

let options = {
    scales: {
        yAxes: [{
            ticks: {
                max: 100,
                min: 0,
                stepSize: 20,
                
            }
        }],
        xAxes: [{ ticks: { autoSkip: true, maxTicksLimit: 20 } }]
    }
}

var cpu = new Chart(cpu, {
    type: 'line',
    data: {
        labels: [label],
        datasets: [{
            label: 'Cpu Usage History',
            backgroundColor: 'rgb(130, 99, 132)',
            borderColor: 'rgb(130, 99, 132)',
            data: [0]
        }
        ]
    },
    options: options
});

var ram = new Chart(ram, {
    type: 'line',
    data: {
        labels: [label],
        datasets: [{
            label: 'Ram Usage  History',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [0]
        }]
    },
    options: options
});

var cpuGeneral = new Chart(cpuGen, {
    type: 'bar',
    data: {
        datasets: [{
            label: 'CPU Usage ',
            backgroundColor: 'rgb(130, 99, 132)',
            data: [0]
        }]
    },
    options: options
});

var ramGeneral = new Chart(ramGen, {
    type: 'bar',
    data: {
        datasets: [{
            label: 'RAM Usage',
            backgroundColor: 'rgb(255, 99, 132)',
            data: [0]
        }]
    },
    options: options
});

var driveGeneral = new Chart(driveGen, {
    type: 'pie',
    data: {
        datasets: [{
            
            backgroundColor: ['rgb(92, 184, 92)','rgb(2, 117, 216)'],
            data: [0]
        }],
        labels: ['Used','Free']
    },
    //options: options
});


function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);

    });

    chart.update();
}

let update = (serverStats) => {
    //console.log(JSON.stringify(serverStats));
    
    document.getElementById("cpucount").innerHTML = serverStats.cpucount
    document.getElementById("cpumodel").innerHTML = serverStats.cpumodel
    document.getElementById("platform").innerHTML = serverStats.platform
    document.getElementById("os").innerHTML = serverStats.os
    document.getElementById("uptime").innerHTML = serverStats.uptime + "ms"
    document.getElementById("cpuStats").innerHTML = serverStats.cpuusage + "%"
    document.getElementById("ramStats").innerHTML = (100 - serverStats.memory.freeMemPercentage) + "%"
    
    document.getElementById("driveTotal").innerHTML = Math.round(serverStats.drive.totalGb)+ "Gb"
    document.getElementById("driveFree").innerHTML = Math.round(serverStats.drive.freeGb)+ "Gb"
    document.getElementById("driveUsed").innerHTML = Math.round(serverStats.drive.totalGb - serverStats.drive.freeGb) + "Gb"


    addData(cpu, i++, serverStats.cpuusage)
    addData(ram, i++, 100 - serverStats.memory.freeMemPercentage)
    
    cpuGeneral.data.datasets[0].data = [serverStats.cpuusage]
    cpuGeneral.update()

    ramGeneral.data.datasets[0].data = [100 - serverStats.memory.freeMemPercentage]
    ramGeneral.update()

    driveGeneral.data.datasets[0].data = [Math.round((serverStats.drive.totalGb-serverStats.drive.freeGb)), Math.round(serverStats.drive.freeGb)]
    driveGeneral.update()


}



socket.on('data', (msg) => {
   update(msg)
});
