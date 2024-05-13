const express = require('express');
const app = express();

const mongoose = require('mongoose');

const path = require("path");

const Chat = require("./models/chat.js");

const methodOverride = require("method-override");// requiring method overriding for put and delete routes

const ExpressError = require("./ExpressError");


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")))// from where static files are served like css and js
app.use(express.urlencoded({ extended: true }));// to parse data which we get from requests like get and post

app.use(methodOverride('_method'));// for using method-override



main().then(() => {
    console.log("connection successful");
})
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');
}


app.get("/", (req, res) => {
    res.send("root is working");
});

//INDEX Route
app.get("/chats", async (req, res) => {
    let chats = await Chat.find();
    // console.log(chats);
    // res.send("working");
    res.render("index.ejs", { chats });
})
//NEW route
app.get("/chats/new", (req, res) => {
    throw new ExpressError(404, "page not found");
    res.render("form.ejs");
})
//Create route
app.post("/chats", (req, res) => {
    let { from, msg, to } = req.body;
    let newChat = new Chat({
        from: from,
        to: to,
        msg: msg,
        created_at: new Date(),
    })
    newChat.save().then(res => {
        console.log("chat was saved");
    }).catch(err => {
        console.log(err);
    })

    res.redirect("/chats");
})
//edit route
app.get("/chats/:id/edit", async (req, res) => {
    let { id } = req.params;
    let chat = await Chat.findById(id)
    res.render("edit.ejs", { chat });
})
//update route
app.put("/chats/:id", async (req, res) => {
    let id = req.params.id;
    let newMsg = req.body;
    let updatedchat = await Chat.findByIdAndUpdate(id, { msg: newMsg.msg }, { runValidators: true, new: true });
    console.log(updatedchat);
    console.log();
    res.redirect("/chats");
})
//delete route
app.delete("/chats/:id", async (req, res) => {
    // res.send("route working");
    let id = req.params.id;
    let deletedChat = await Chat.findByIdAndDelete(id);
    // console.log(updatedchat);
    res.redirect("/chats");
});

//new- show route
app.get("/chats/:id", async (req, res, next) => {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", { chat });
});


//error handling middleware
app.use((err, req, res, next) => {
    let { status = 500, message = "some error message" } = err;
    res.status(status).send(message);
});

app.listen(8080, () => {
    console.log("server is listening on port 8080");
});