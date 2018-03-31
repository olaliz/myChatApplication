// Elizabeth Emmanuel
// 02/01/2018

module.exports = function(io, Global, _){

    const clients = new Global();
    
    io.on('connection', (socket) => {
        socket.on('global room', (global) => {
            socket.join(global.room);
            
            clients.EnterRoom(socket.id, global.name, global.room, global.img);
            
            const nameProp = clients.GetRoomList(global.room);
            const arr = _.uniqBy(nameProp, 'name');                       //remove duplicate due to refresh
            
            io.to(global.room).emit('loggedInUser', arr);
        });
        
        socket.on('disconnect', () => {
            const user = clients.RemoveUser(socket.id);
            
            if(user){
                const userData = clients.GetRoomList(user.room);
                const arr = _.uniqBy(userData, 'name');                 //remove a specific user
                const removeData = _.remove(arr, {'name': user.name})  //remove userdata once the user disconnect using loadash
                io.to(user.room).emit('loggedInUser', arr);
            }
        })
    });
}