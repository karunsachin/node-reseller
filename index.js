import express from 'express';
import fetch from 'node-fetch';
import { config } from 'dotenv';
const PORT = 3000;

config(); // Load the environment variables from the .env file

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const token = process.env.TOKEN;
const Id = process.env.ID;

//create route
app.get("/sendMessage", (req, res) => {

    const num = req.query.num;
    const template = req.query.template;
    const lang = req.query.lang;

    const data = {
        messaging_product: "whatsapp",
        to: `${num}`,
        type: "template",
        template: {
          name: `${template}`,
          language: {
            code: `${lang}`,
          },
        },
    };

    fetch(`https://graph.facebook.com/v17.0/${Id}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(response => {
        res.send("Message sent successfully.")
    })
    .catch(err => console.error(err));
})

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});