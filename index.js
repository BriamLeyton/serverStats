const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const express = require("express");
const osu = require('node-os-utils')

app.use(express.static('public'));
let users = 0
io.on('connection', (socket) => {
    users = users +1
    console.log(users, 'user(s) connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});


http.listen(3000, () => {
    console.log('listening on *:3000');
});

setInterval(() => {
    let cpu = osu.cpu
    let mem = osu.mem
    let drive = osu.drive
    let netstat = osu.netstat
    let os = osu.os

    let cpuusage = cpu.usage().then(info => { return { 'cpuusage': info } })
    let cpufree = cpu.free().then(info => { return { 'cpufree': info } })
    let cpucount = { 'cpucount': cpu.count() }
    let cpumodel = { 'cpumodel': cpu.model() }
    let platform = { 'platform': os.platform() }
    let uptime = { 'uptime': os.uptime() }
    let tdrive = drive.info().then(info => { return { 'drive': info } })
    let memory = mem.info().then(info => { return { 'memory': info } })
    let net = netstat.inOut().then(info => { return { 'net': info } })
    let ossystem = os.oos().then(info => { return { 'os': info } })

    Promise.all([cpuusage, cpufree, cpucount, cpumodel, memory, platform, uptime, tdrive, net, ossystem]).then(values => {
       let data = {}
        values.forEach(k => {
            Object.assign(data, k)
       })
        //console.log(data)
        io.emit("data", data)
    });

}, 3000)