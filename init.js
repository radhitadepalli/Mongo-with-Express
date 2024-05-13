const mongoose = require('mongoose');

main().then(() => {
    console.log("connection successful");
})
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');
}

const Chat = require("./models/chat.js");

let allChats=[
    {
        from: "neha",
        to:"preeti",
        msg:"send me notes for the exam",
        created_at:new Date(),
    },
    {
        from:"rohit",
        to:"mohit",
        msg:"teach me IS callbacks",
        created_at:new Date(),
    },
    {
        from:"amit",
        to:"rahul",
        msg:"hello",
        created_at:new Date(),
    },
    {
        from:"anitha",
        to:"rahul",
        msg:"love you 3000",
        created_at:new Date(),
    },
    {
        from:"tony",
        to:"peter",
        msg:"send me your exam sheets",
        created_at:new Date(),
    }
]

Chat.insertMany(allChats);
