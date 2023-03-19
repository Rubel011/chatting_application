const express=require("express")
const {Server}=require("socket.io")
const http=require("http")
const app=express();
const httpServer=http.createServer(app);
httpServer.listen(8000);

const io=new Server(httpServer)
let name_obj={}
let count=0;
io.on("connection", (socket) => {
    console.log("client connected", socket.id);
    socket.on("new_user_added",(name)=>{
        name_obj[socket.id]=name;
        count++;
        socket.broadcast.emit("new_user_added",name)
        io.emit("user_online",count)
    })
    socket.on("message", (e) => {
        console.log(e);
        socket.broadcast.emit("message",{
            name:name_obj[socket.id],
            msg:e
        })
    })
    socket.on("disconnect",()=>{
        console.log("a user disconnected");
        count--;
        if(count<0)count=0;
        io.emit("user_online",count)
        socket.broadcast.emit("close",name_obj[socket.id])
    })

})

