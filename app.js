const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const sweetalert = require("sweetalert");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/fifaDB", {
  useNewUrlParser: true
});

/************************* stats collection ******************************/

const statSchema = new mongoose.Schema({
  s_id: String,
  dribbling: String,
  penalties: String,
  goals: String
});

const Stat = mongoose.model('Stat', statSchema);

/************************* clubs collection ******************************/

const clubSchema = new mongoose.Schema({
  c_id: String,
  club: String,
  nationality: String,
  coach: String
});

const Club = mongoose.model('Club', clubSchema);

/************************* wages collection ******************************/

const wageSchema = new mongoose.Schema({
  w_id: String,
  wage: String,
  networth: String
});

const Wage = mongoose.model('Wage', wageSchema);

/************************* healths collection ******************************/

const healthSchema = new mongoose.Schema({
  h_id: String,
  stamina: String,
  strength: String,
  injuries: String
});

/************************* fifas collection ******************************/

const fifaSchema = new mongoose.Schema({
  _id: String,
  image: String,
  name: String,
  age: String,
  nationality: String,
  stats: statSchema,
  club: clubSchema,
  wage: wageSchema,
  health: healthSchema
});

const Fifa = mongoose.model('Fifa', fifaSchema);

const Health = mongoose.model('Health', healthSchema);

app.get("/", function(req, res) {
  res.render("home")
});

app.get("/search", function(req, res) {
  res.render("search")
});

app.get("/update/:playerId", function(req, res) {
  const requestedId = req.params.playerId;
  // res.render("update",{playerId: requestedId})
  Fifa.findOne({
    _id: requestedId
  }, function(err, info) {
    res.render("update",{
      playerId: requestedId,
      info: info
    });
  });
});

app.post("/update/:playerId", function(req, res) {
  Fifa.findByIdAndUpdate({_id: req.body.playerId},{
  _id: req.body.playerId,
  image: req.body.playerImage,
  name: req.body.playerName,
  age: req.body.playerAge,
  nationality: req.body.playerNationality,
  stats: {
    s_id: req.body.playerId,
    dribbling: req.body.playerDribbling,
    penalties: req.body.playerPenalties,
    goals: req.body.playerGoals
  },
  club: {
    c_id: req.body.playerId,
    club: req.body.playerClub,
    nationality: req.body.playerNationality,
    coach: req.body.playerCoach
  },
  wage: {
    w_id: req.body.playerId,
    wage: req.body.playerWage,
    networth: req.body.playerNetworth
  },
  health: {
    h_id: req.body.playerId,
    stamina: req.body.playerStamina,
    strength: req.body.playerStrength,
    injuries: req.body.playerInjuries
  }
}, function(err,result){
  if(err){
         console.log(err);
     }
     else{

         res.redirect("/player");
     }
});
});

app.get("/player", function(req, res) {
  Fifa.find({}, function(err, players) {
    res.render("player", {
      pdetails: players
    })
  });
});

app.get("/insert", function(req, res) {
  res.render("insert")
});

app.post("/insert", function(req, res) {
  const football = new Fifa({
    _id: req.body.playerId,
    image: req.body.playerImage,
    name: req.body.playerName,
    age: req.body.playerAge,
    nationality: req.body.playerNationality,
    stats: {
      s_id: req.body.playerId,
      dribbling: req.body.playerDribbling,
      penalties: req.body.playerPenalties,
      goals: req.body.playerGoals
    },
    club: {
      c_id: req.body.playerId,
      club: req.body.playerClub,
      nationality: req.body.playerNationality,
      coach: req.body.playerCoach
    },
    wage: {
      w_id: req.body.playerId,
      wage: req.body.playerWage,
      networth: req.body.playerNetworth
    },
    health: {
      h_id: req.body.playerId,
      stamina: req.body.playerStamina,
      strength: req.body.playerStrength,
      injuries: req.body.playerInjuries
    }
  });

  football.save(function(err) {
    if (!err) {
      console.log("successfully Inserted player");
      setTimeout(function(){res.redirect("/player");},1500);
    }
  })
});

app.get("/delete", function(req, res) {
  res.render("delete")
});

app.get("/player/:playerId", function(req, res) {
  const requestedId = req.params.playerId;

  Fifa.findOne({
    _id: requestedId
  }, function(err, info) {
    res.render("playerPage", {
      info: info
    });
  });
});

app.post("/delete", function(req,res){
   const deletedFifaId = req.body.submit;
   Fifa.findByIdAndRemove(deletedFifaId, function(err){
     if(!err){
       console.log("successfully deleted player");
       setTimeout(function(){res.redirect("/player");},1500);

     }
   });
 });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
