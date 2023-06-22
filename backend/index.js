const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var ObjectId = require('mongoose').Types.ObjectId;
const { mongoose } = require('./db.js');

var app = express();
var router = express.Router();
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:4200' }));

var { Table } = require('./modals/table');
app.listen(3000, () => console.log('Server started at port : 3000'));

// app.get('/', (req, res) => {
//     Table.find()
//     .then((documents) => {
//       console.log(documents);
//       // Handle the retrieved documents here
//     })
//     .catch((error) => {
//       console.error(error);
//       // Handle any errors here
//     });
// });

app.get('/tables', async (req, res) => {
    try {
      const tables = await Table.find({},{__v:0});
      res.send(tables)
    } catch (error) {
      console.error('Error retrieving users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/table',async(req,res)=>{
  try{
    const id=req.query.id
    if (!ObjectId.isValid(req.query.id))
        return res.status(400).send(`No record with given id : ${req.query.id}`);
    else{
        let item = await Table.find({_id: id},{__v:0});
        res.send(item)
    }
    // console.log("id: ",id);
    // const table=await Table.find({_id:id});
    // res.send(table)
  }catch(error){
    res.status(500).json({error:'Internal Server Error'});
  }
})

app.get('/page/:pageNumber/:pageSize',async(req,res)=>{
    const pageNumber = req.params.pageNumber?req.params.pageNumber:1; //2  //1
    const pageSize = req.params.pageSize?req.params.pageSize:5; //10   //5

    const skipItems = (pageNumber - 1) * pageSize;//1*10=10  //0
    const items = await Table.find({},{__v:0})
    .skip(skipItems)//10  //0
    .limit(pageSize)//10 //5
    .exec();
    res.send(items)
})

app.post('/add',async(req,res)=>{
  const { securityType, Description, Category } = req.body
  console.log("body: ",securityType);
  var post = new Table({
    securityType: securityType,
    Description: Description,
    Category: Category
  })
  console.log("post params: ",post);
  const result=post.save()
  result.then((val)=>{
    console.log("success: ",typeof val);
    res.status(200).send({ status:200, message: 'Successfully added new Security type' })
    // .json(val)
  }).catch((error)=>{
    console.log("error: ",error);
  })
})

app.put('/put',async(req,res)=>{
  const { _id,securityType, Description, Category } = req.body
  const update={
    securityType: securityType,
    Description: Description,
    Category: Category
  }
  console.log("put method");
  console.log("id: ",req.query.id);
  console.log("data: ",securityType);
  const result=Table.findByIdAndUpdate(req.query.id,update,{ new: true });
  result.then((val)=>{
    console.log("res: ",val);
    res.status(202).send({ status:202, message: 'Successfully updated Security type' })
  }).catch((error)=>{
    console.log("error: ",error);
  })
})

app.delete('/del',async(req,res)=>{
  console.log("id: ",req.query.id);
  const del =await Table.deleteOne({ _id: req.query.id });
  console.log("del: ",del);
  if(del.acknowledged==true){
    res.status(200).send({ status:200, message: 'Successfully deleted a Security type' })
  }
})

app.get('/sort',async(req,res)=>{
  let sort={}
  const { active, direction,pageNo,size } = req.query

  const pageNumber = pageNo
  const pageSize = size
  console.log("no: ",pageNumber," size: ",pageSize);

  const skipItems = (pageNumber - 1) * pageSize;
  console.log("data: ",req.query);

  console.log("query: ",active);
  sort[active] = direction
  console.log(sort);
  Table.find().sort(sort)
  .skip(skipItems)
  .limit(pageSize)
  .exec()
  .then(results => {
    console.log(results);
    res.send(results)
  })
  .catch(err => {
    console.error(err);
  });
})
