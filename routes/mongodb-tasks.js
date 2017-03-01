var express = require("express");
//create time based uuid
const uuid = require("uuid/v1");
var router = express();




var mongodb = require("mongodb");
var conn = require("../env/mongodb-env.js").connection;

var client = mongodb.MongoClient;
var collection;
client.connect(conn.host+":"+conn.port+"/"+conn.database, function(err, db){
	collection = db.collection("tasks");
});



//Retrieve all tasks
router.get("/tasks", function(req, res, next){
  collection.find({}).toArray(function(err, docs) {
  	res.json(docs);
  });
});

//Retrieve task by id
router.get("/task/:id", function(req, res, next){
  collection.find({_id: req.params.id}).toArray(function(err, docs) {
  	res.json(docs);
  });
});

//Create task
router.post("/task", function(req, res, next){
	var task = req.body;
	console.log(task);
	if(!task.title){
		res.status(400);
		res.json({
			"error" : "Bad Data"
		});
	} else {
		task._id = uuid();
  		// Insert some documents 
  		collection.insertOne(task, function(err, result) {
  			res.json(result.ops[0]);
 		});
	}
});

// Delete Task by id
router.delete("/task/:id", function(req, res, next){
  collection.deleteOne({ _id: req.params.id}, function(err, result) {
   res.json(result);
  });
});

// Update Task by id
router.put("/task/:id", function(req, res, next){
	var task = req.body;
	if(!task) {
		res.status(400);
		res.json({
			"error":"Bad Data"
		});
	} else {
		
		collection.updateOne({ _id:  task._id}
    	, { $set: task }, function(err, result) {
			res.json(result);
  		});  
	}

});



module.exports = router;