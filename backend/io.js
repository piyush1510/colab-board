module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log('connection');
    socket.on('points',async (points)=>{
        socket.broadcast.emit('draw',points)
    })
    socket.on("disconnect", () => {
        console.log('disconnected');
    });
  });
};
