var WebSocket = require('ws');
var WebSocketJSONStream = require('@teamwork/websocket-json-stream');
var shareDBServer = require('./sharedb-server');
var uuid = require('uuid/v1');

var wssd = new WebSocket.Server({ //sharedb socket server
    noServer: true
});

// var wssc = new WebSocket.Server({ //cursor socket server
//     noServer: true
// });

wssd.on('connection', function(ws1, req) {
    ws1.isAlive = true;
    ws1.id = uuid();
    console.log(`Socket connected at Id : ${ws1.id}`);
    var stream = new WebSocketJSONStream(ws1);
    shareDBServer.listen(stream);
    ws1.on('pong', function(data, flags) {
        ws1.isAlive = true;
    });
    // ws1.once('message', async function(data){
    //    let roomid = JSON.parse(data).d;
    //    let comments = await Comment.find({docid: roomid});
    //    ws1.send(JSON.stringify({comments}));
    // })
    ws1.on('error', function(error) {
        console.log(`Socket error at Id : ${ws1.id}`);
    });
});

// wssc.on('connection', function(ws2, req) {   
//     ws2.id = uuid();
//     ws2.isAlive = true;
//     console.log(`Cursor connected at ${ws2.id}`);
//     ws2.on('message',async function(data) {
//         let d = JSON.parse(data);
//         if(!ws2.roomid)
//             ws2.roomid = d.roomid;
        
//         wssc.clients.forEach(function each(client) {
//             if (client.readyState === WebSocket.OPEN && client.roomid===ws2.roomid){
//                 client.send(JSON.stringify(d));
//             }
//         });
//     }); 
//     ws2.on('close', function(code, reason) {
//         console.log(`Cursor closed at ${ws2.id}`);
//     });
//     ws2.on('error', function(error) {
//         console.log(`Cursor error at ${ws2.id}`);
//     });
//     ws2.on('pong', function(data) {
//         ws2.isAlive = true;
//     });
// });

// Sockets Ping, Keep Alive

// setInterval(function() {
//     wssc.clients.forEach(function(ws2) {
//         if (ws2.isAlive === false) return ws2.terminate();

//         ws2.isAlive = false;
//         ws2.ping();
//     });
// }, 30000);

setInterval(function() {
    wssd.clients.forEach(function(ws1) {
        if (ws1.isAlive === false) return ws1.terminate();

        ws1.isAlive = false;
        ws1.ping();
    });
}, 30000);
  
module.exports =  {wssShareDB: wssd};
// module.exports =  {wssShareDB: wssd, wssCursors: wssc};