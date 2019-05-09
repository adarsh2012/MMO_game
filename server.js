//Load dependencies
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const cookieParser = require('cookie-parser'); 
const request = require('request'); 

//make server
const app = express();
const server = http.Server(app);
const io = socketIO(server);
app.use('/', express.static(path.join(__dirname)));
    
//initialize game
var username;
var CLIST = ["red","yellow","orange","black"];
var room = 1;
var rname = "room" + room;
function p(pos,id,size,color,name){
    this.pos = pos;
    this.id = id;
    this.size = size;
    this.color = color;
    this.name = name;
    this.players_killed = 0;
}
function world(players_list){
    this.players = players_list;
    this.points = creatP();
};
function creatP(){
    var points = [];
    for(var i = 0; i<25;i++){
        ppos = [Math.floor(1000*Math.random()),Math.floor(635*Math.random())];
        points.push(ppos);
    };
    return points;
};
worlds = {};
worlds[rname] = new world([]);

//load passport
require('./config/passport')(passport);

//health check
const options = { 
    url: '<loadLB_ip>', 
    headers: { 
    'origin': '<my_ip>' 
    } 
    } 
    const sendGET = setInterval(function () { 
    var req = request.post(options, function (res) { 
    console.log('Request send.') 
    }); 
    }, 1000);
    

//connect to db
const db = require('./config/keys').mongoURI;
mongoose
  .connect(
    db,
    { useNewUrlParser: true }  
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

mongoose.set('useFindAndModify', false);
//EJS layouts and change render engines 
app.use(expressLayouts);
app.set('view engine', 'ejs');

//body parser and session
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

//Initialization passport
app.use(passport.initialize());
app.use(passport.session());

//flash
app.use(flash());

//Making global variables
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//routes
app.post('/play/game', (req,res) => {
    username = req.body.username;
    res.sendFile(path.join(__dirname,'/views/gamepage.html'));
});
app.get('/play/game', (req,res) => {
    res.redirect('/');
});
app.use('/', require('./routes/index.js'));
app.use('/req', require('./routes/req.js'));


//Start listen
server.listen(3000, () => {
    console.log("Listening to port 3000");
});

io.on('connection', function(socket){
  newpos = [Math.floor(550*Math.random()),Math.floor(550*Math.random())];
  var rand = CLIST[Math.floor(Math.random() * CLIST.length)]; //color
  default_size = 10;
  if(worlds[rname].players.length >= 1000){
      room += 1;
      rname = "room" + room;
      worlds[rname] = new world([]);
  };
  worlds[rname].players.push(new p(newpos,socket.id,default_size,rand,username));
  socket.join(rname);
  socket.emit("world",rname);
  io.to(rname).emit("world_data",worlds[rname]);
  socket.on("Pressed", (data) => {
      for(var x = 0; x < worlds[data.world].players.length; x++){
          if(data.id == worlds[data.world].players[x].id){
              var move = 100/worlds[data.world].players[x].size;
              if(data.key == 'w' || data.key == 'W'){
                  worlds[data.world].players[x].pos[1] -= move;   
              }
              if(data.key == 'a' || data.key == 'A'){
                  worlds[data.world].players[x].pos[0] -= move;
              }
              if(data.key == 's' || data.key == 'S'){
                  worlds[data.world].players[x].pos[1] += move;
              }
              if(data.key == 'd' || data.key == 'D'){
                  worlds[data.world].players[x].pos[0] += move;
              }
          }
      };
  });
  socket.on("disconnect", () => {
      findNremove(socket.id);
  });
});

setInterval(() => {
  point_clash();
  player_clash();
  ranking();
  io.sockets.emit("playerInfo", worlds);
}, 15);





function findNremove(id){
  for(keys in worlds){
      for(var p = 0; p < worlds[keys].players.length; p++){
          if(worlds[keys].players[p].id == id){
              worlds[keys].players.splice(p,1);
              return;
          };
      };
  }
};

function newPoint(){
  return [Math.floor(1000*Math.random()),Math.floor(635*Math.random())]
}

function point_clash(){
  for(keys in worlds){
      players = worlds[keys].players;
      points = worlds[keys].points;
      for(var p = 0; p < players.length; p++){
          var px = players[p].pos[0];
          var py = players[p].pos[1];
          var r = players[p].size;
          for(var point = 0; point < points.length; point++){
              var x = Math.abs(px - points[point][0]);
              var y = Math.abs(py - points[point][1]);
              var distance = Math.sqrt((x*x) + (y*y)) - r;
              if(distance < 4){
                  points.splice(point,1);
                  players[p].size += 1;
                  points.push(newPoint());
                  worlds[keys].points = points;
                  worlds[keys].players = players;
              };
          };
      };
  };
};

function player_clash(){
  for(keys in worlds){
      for(var ref = 0; ref<worlds[keys].players.length; ref++){
          for(var other = 0; other<worlds[keys].players.length; other++){
              if(ref == other){break;}
              var distance = dist(worlds[keys].players[ref],worlds[keys].players[other]);
              if(worlds[keys].players[ref].size > worlds[keys].players[other].size){
                  distance -= worlds[keys].players[ref].size;
                  if(distance < 5){
                      worlds[keys].players[ref].size += worlds[keys].players[other].size;
                      worlds[keys].players[ref].players_killed += 1;
                      io.to(worlds[keys].players[other].id).emit("redirect", "/");
                      worlds[keys].players.splice(other,1);
                      break;
                  };
              }
              if(worlds[keys].players[ref].size < worlds[keys].players[other].size){
                  distance -= worlds[keys].players[other].size;
                  if(distance < 5){
                      worlds[keys].players[other].size += worlds[keys].players[ref].size;
                      worlds[keys].players[other].players_killed += 1;
                      io.to(worlds[keys].players[ref].id).emit("redirect", "/");
                      worlds[keys].players.splice(ref,1);
                      break;
                  };
              }
          };
      };
  };
};


function dist(player1,player2){
  var x = player1.pos[0] - player2.pos[0];
  var y = player1.pos[1] - player2.pos[1];
  return Math.sqrt((x*x) + (y*y))
};

function ranking(){
  var ranked = {};
  for(keys in worlds){
      var list = worlds[keys].players;
      list.sort(function(a, b){
          return b.size - a.size;
      });
      ranked[keys] = list;
  };
  io.sockets.emit("rank",ranked);
};

// Only registered users can get the data!
