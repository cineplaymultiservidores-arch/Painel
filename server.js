require("dotenv").config();
const express=require("express");
const path=require("path");
const app=express();
const PORT=process.env.PORT||3000;
const API_URL=process.env.WASSMM_API_URL||"https://wassmm.online/api/v2";
const API_KEY=process.env.WASSMM_API_KEY;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

async function wassmm(params){
  if(!API_KEY) throw new Error("WASSMM_API_KEY não configurada.");
  const body=new URLSearchParams({key:API_KEY,...params});
  const r=await fetch(API_URL,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body});
  const text=await r.text();
  let data; try{data=JSON.parse(text)}catch{throw new Error("Resposta inválida da WasSMM: "+text.slice(0,300))}
  if(!r.ok) throw new Error(data.error||"Erro HTTP "+r.status);
  return data;
}
app.get("/api/services",async(req,res)=>{try{res.json(await wassmm({action:"services"}))}catch(e){res.status(500).json({error:e.message})}});
app.get("/api/balance",async(req,res)=>{try{res.json(await wassmm({action:"balance"}))}catch(e){res.status(500).json({error:e.message})}});
app.post("/api/order",async(req,res)=>{try{
  const {service,link,quantity,runs,interval}=req.body;
  if(!service||!link||!quantity)return res.status(400).json({error:"Informe serviço, link e quantidade."});
  const p={action:"add",service:String(service),link:String(link),quantity:String(quantity)};
  if(runs)p.runs=String(runs); if(interval)p.interval=String(interval);
  res.json(await wassmm(p));
}catch(e){res.status(500).json({error:e.message})}});
app.get("/api/order/:id",async(req,res)=>{try{res.json(await wassmm({action:"status",order:req.params.id}))}catch(e){res.status(500).json({error:e.message})}});
app.get("/api/health",(req,res)=>res.json({ok:true}));
app.listen(PORT,()=>console.log("Painel rodando na porta "+PORT));