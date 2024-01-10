const mongoose = require('mongoose');
const express = require('express');
const fs = require('fs');
const session = require('express-session');
const cors = require('cors');
const app = express();
const ejs = require('ejs');
app.set('view engine', 'ejs');
const bodyParser = require('body-parser');
require('dotenv').config();
const port = process.env.PORT;
const conn = process.env.MONGO_URL;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors());
mongoose.connect(conn);

const inputSchema = new mongoose.Schema({
    lName: String,
    fName: String,
    nationality: String,
    birthPlace: String,
    passNumber: String,
    pid: String,
    ped: String,
    pic: String,
    dob: String,
    gender: String,
    race: String,
    religion: String,
    ms: String,
    homeAdd: String,
    spouse: String,
    child: String,
    mail: String,
    tCon: String,
    mCon: String,
    bankDetails: String,
    pBank: String,
    addrBank: String,
    accNum: String,
    sortCode: String,
    bLocation: String,
    swiftCode: String,
    iban: String,
    bInfo: String,
    taxIdentity: String,
    emgName: String,
    emgRelation: String,
    contact: String,
    addr: String,
})

const InputData = mongoose.model('InputData',inputSchema);

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/public/offerForm.html');
})

app.get('/update',(req,res)=>{
    res.sendFile(__dirname+'/public/offerUpdate.html');
});


app.get('/contact',(req,res)=>{
  res.sendFile(__dirname+'/public/contact.html');
});

app.get('/upload',(req,res)=>{
  res.sendFile(__dirname+'/public/offerForm.html');
});

app.post('/update', async (req, res) => {
  let lName = req.body.lName1;
    let {fName,nationality,birthPlace,passNumber,pid,ped,pic,dob,gender,race,religion,ms,homeAdd,spouse,child,mail,tCon,mCon,bankDetails,pBank} = req.body;
    let {addrBank,accNum,sortCode,bLocation,swiftCode,iban,bInfo,taxIdentity,emgName,emgRelation,contact,addr} = req.body;
    try {
      const updatedUser = await InputData.findOneAndUpdate(
        {lName},
        {fName,nationality,birthPlace,passNumber,pid,ped,pic,dob,gender,race,religion,ms,homeAdd,spouse,child,mail,tCon,mCon,bankDetails,pBank,addrBank,accNum,sortCode,bLocation,swiftCode,iban,bInfo,taxIdentity,emgName,emgRelation,contact,addr},
        { new: true },
      );
      if (updatedUser) {
        //res.json(updatedUser);
        let z = fs.readFileSync("public/submit.html")
        res.send(z.toString())
      } else {
        res.json({ message: 'User not found' }); 
        console.log(lName);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

app.post('/getDetails', async (req, res) => {
    const lName = req.body.lName;  
    try {
      const user = await InputData.findOne({ lName });
      if (user) {
        res.json(user);
      } else {
        res.json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/search', (req, res) => {
    res.sendFile(__dirname + '/public/search.html');
  });
  
  app.post('/search', (req, res) => {
    const searchName = req.body.search_name;
  
    InputData.findOne({ lName: searchName }).exec()
      .then(result => {
        if (result) {
          res.render('result', { result: result });
        } else {
          res.render('result', { error: "No data found for the given name." });
        }
      })
      .catch(err => {
        console.log(searchName);
        res.render('Please check the spelling');
      });
  }); 

app.post('/upload',async(req,res)=>{
    let {lName,fName,nationality,birthPlace,passNumber,pid,ped,pic,dob,gender,race,religion,ms,homeAdd,spouse,child,mail,tCon,mCon,bankDetails,pBank} = req.body;
    let {addrBank,accNum,sortCode,bLocation,swiftCode,iban,bInfo,taxIdentity,emgName,emgRelation,contact,addr} = req.body;
    try{
        const inputData = new InputData({
            lName: lName,
            fName: fName,
            nationality: nationality,
            birthPlace: birthPlace,
            passNumber: passNumber,
            pid: pid,
            pic: pic,
            ped: ped,
            dob: dob,
            gender: gender,
            race: race,
            religion: religion,
            ms: ms,
            homeAdd: homeAdd,
            spouse: spouse,
            child: child,
            mail: mail,
            tCon: tCon,
            mCon: mCon,
            bankDetails: bankDetails,
            pBank: pBank,
            addrBank: addrBank,
            accNum: accNum,
            sortCode: sortCode,
            bLocation: bLocation,
            swiftCode: swiftCode,
            iban: iban,
            bInfo: bInfo,
            taxIdentity: taxIdentity,
            emgName: emgName,
            emgRelation: emgRelation,
            contact: contact,
            addr: addr, 
        });
        await inputData.save();
        let a3 = fs.readFileSync('public/submit.html')
        res.send(a3.toString());
    }
    catch(err){
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
})

app.listen(port,()=>{
    console.log(`server running at ${port}`)
})