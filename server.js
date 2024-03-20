
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')
const bp = require('body-parser')

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bp.urlencoded({ extended: true }))

app.get('/', async (req, res)  =>{
 await res.sendFile(__dirname + '/public/login.html')
  // res.redirect(`/${uuidV4()}`)
})

app.post('/adm', async (req, res)  =>{
  let name = req.body.n1;
  let meeting=req.body.pass;
  console.log(name);
   res.redirect(`/${meeting}&${name}`)
 })

 app.get('/:room&:name',async (req, res) => {
  let name=await req.params.name ;
  let room=await req.params.room;
  console.log("--",name,room);
  res.render('room', { room:room,na:name})
})
app.get('/:room', (req, res) => {
  res.render('room', { room: req.params.room,na:"akshat"})
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId, userName) => { // Added userName parameter
      socket.join(roomId);
      socket.to(roomId).broadcast.emit('user-connected', userId, userName); // Emitting userName
  
      socket.on('disconnect', () => {
        socket.to(roomId).broadcast.emit('user-disconnected', userId);
      });
  
      socket.on('toggle-mute', isMuted => {
  socket.to(roomId).broadcast.emit('peer-toggle-mute', { userId, isMuted }); // Broadcasting mute action
});

socket.on('toggle-pause', isPaused => {
  socket.to(roomId).broadcast.emit('peer-toggle-pause', { userId, isPaused }); // Broadcasting pause action
});

    });
  });

server.listen(3000)
