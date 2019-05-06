var socket = io();
var initial = performance.now();
var final;
var ranklist = [];
var players_pos = [];
var points = [];
var world;
var size_canvas;
var canvas;
var ctx;
var my_rank;
var my_points;
var my_kills;
//loadDB
//const User = require('../db_schema/gameData.js');


socket.on("world", (data) => {
    world = data;
    console.log("You are at",world);
});
socket.on("world_data", (data) => {
    players_pos = data.players;
    points = data.points;
    update(players_pos);
});
socket.on("playerInfo", (data) => {
    players_pos = data[world].players;
    points = data[world].points;
    update(players_pos);
}); 
socket.on('rank',function(data){
    ranklist = data[world];
});
socket.on('redirect',function(data){
    var final = performance.now();
    // var joinlist = ["/?rank=", my_rank,"&time=",(final-initial)/1000,"&points=",my_points,"&kills=",my_kills];
    // var final = joinlist.join("");
    var time  = (final - initial)/1000
    var time = time.toFixed(1);
    var form = $('<form action="' + '/' + '" method="post">' +
    '<input type="text" name="rank" value="' + my_rank + '" />' + 
    '<input type="text" name="time" value="' + time + '" />' + 
    '<input type="text" name="points" value="' + my_points + '" />' + 
    '<input type="text" name="kills" value="' + my_kills + '" />' + 
  '</form>');
    $('body').append(form);
    form.submit();
    // window.location.href = final;
});




// update postion of players
var canvas = document.getElementById('canvas');
canvas.width = 1000;
canvas.height = 635;
var ctx = canvas.getContext('2d');

function update(player){
    ctx.clearRect(0, 0 , canvas.width, canvas.height);
    for(var i = 0; i < player.length; i++){ 
        if(player[i].id == socket.id){
            my_points = player[i].size;
            my_kills = player[i].players_killed;
        }     
        ctx.fillStyle = player[i].color;
        ctx.font = "15px Arial";
        ctx.textAlign = "center"; 
        ctx.fillText(player[i].name, player[i].pos[0],player[i].pos[1]+(player[i].size) + 20);
        ctx.beginPath();
        ctx.arc(player[i].pos[0],player[i].pos[1], player[i].size, 0, 2 * Math.PI);
        ctx.strokeStyle=player[i].color;
        ctx.stroke();
        ctx.fill();
    };
    updateP(points);    
};

function updateP(plist){
    for(var i = 0; i < plist.length; i++){
        ctx.fillStyle = "black";
        ctx.fillRect(plist[i][0],plist[i][1],5,5);
    };
    drawRank();
};

function drawRank(){
    ctx.fillStyle = 'rgba(225,225,204,0.5)';
    ctx.fillRect(0,0,250,250);
    ranking();
}

function ranking(){
    for(var x = 0; x<ranklist.length;x++){
        if(x < 5) {
            ctx.fillStyle = "black";
            ctx.font = "20px Georgia";
            var i = x+1;
            ctx.textAlign = "left"; 
            ctx.fillText(i + '.  ' + ranklist[x].name + "  " + ranklist[x].size,20,45 + 30*(x));
        }
        if(ranklist[x].id==socket.id){
            ctx.fillStyle = "red";
            ctx.font = "20px Georgia";
            var i = x+1;
            my_rank = i;
            ctx.textAlign = "left"; 
            ctx.fillText(i + '.  ' + "YOU" + "  " + ranklist[x].size,20,45 + 30*(5));
        }
    }
}


document.addEventListener("keydown", (event) => {
    socket.emit("Pressed", {id: socket.id , key: event.key, world: world});
});
