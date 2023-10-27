import express, { response } from 'express';
import fetch from 'node-fetch';
import { config } from 'dotenv';
const PORT = process.env.PORT || 5000;

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

app.get("/webhook", (req, res)=>{
  let mode = req.query["hub.mode"];
  let challenge = req.query["hub.challenge"];
  let token2 = req.query["hub.verify_token"];

  const mytoken="webhook_nodejs_token";

  if (mode && token2){

    if (mode === "subcribe" && token2 === mytoken){
      res.status(200).send(JSON.stringify(challenge));
    }
    else{
      res.status(403);
    }
  }
})

app.post("/webhook", (req, res)=>{
  let body_param=req.body;
  // console.log(JSON. stringify(body_param,null,2));
  
  if(body_param.object){
    if(body_param.entry &&
      body_param.entry[0].changes &&
      body_param.entry[8].changes[0].value.message &&
      body_param.entry[0].changes[0].value.message[0]
    ){

      let phon_no_id = body_param.entry[0].changes[0].value.metadata.phone_number_id;
      let from = body_param.entry[0].changes[0].value.messages[0].from;
      let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;

      const data = {
        messaging_product :"whatsapp",
        to: from,
        text :{
          body :"Hello from webhook api...."
        }
      }

        fetch("https://www.facebook.com/v18.0/" + phon_no_id + "/messages?access_token=" + token, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
      })
      .then((resp) => resp.json())
      .then((response) => {
        res.status(200).send(JSON.stringify(response));
      })
      .catch((err) => {
        res.status(404).send(err);
      })
    }
  }
})
  

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});
