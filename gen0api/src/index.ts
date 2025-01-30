import express from "express";
import bodyParser from 'body-parser'
 import dotenv from 'dotenv';
 import  authRouter  from "./routers/auth.router";
 import  groupRouter  from "./routers/group.router";
 import  contactRouter  from "./routers/contact.router";
import cors from 'cors';
import { debtRouter } from "./routers/debt.router";

const app = express();

dotenv.config();
app.use(bodyParser.json());
app.use(cors());

app.get('/hi',(req,res)=>{
    res.send("Hello");
})
 


app.use('/api/v0', authRouter);
app.use('/api/v0', groupRouter);
app.use('/api/v0', contactRouter);
app.use('/api/v0', debtRouter);


const PORT = process.env.PORT || 4000;

app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`);
    
})
