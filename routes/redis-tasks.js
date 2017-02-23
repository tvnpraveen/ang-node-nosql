var express = require("express");

//create time based uuid
const uuid = require("uuid/v1");
var router = express();


var redis = require('redis');
var async = require("async");

var conn = require("../env/redis-env.js").connection;
var client = redis.createClient(conn.port, conn.host);

//Prefix the id with tasks so that the keys are different with respect to this app
function getId(id) {
	return "tasks."+id;
}

/**
* Persisting in redis converts the boolean to string
* function to convert the known keys from string to boolean 
*
**/
function parseJSON(json){
	if(json != null) {
		var jsonObj = JSON.parse(JSON.stringify(json));
		if(jsonObj != null && jsonObj.isDone == "true"){
			jsonObj.isDone = true;
		} else if(jsonObj != null && jsonObj.isDone == "false"){
			jsonObj.isDone = false;
		}
		return jsonObj;
	}
}

//create a function to retrieve object per key, this will be used in async call
var getTask = function (key, callback){
					client.hgetall(key, function(err, object) {
						return callback(null, parseJSON(object));
					});
					
				}


//Retrieve all tasks
router.get("/tasks", function(req, res, next){
	// Since there is no direct function/command redis current supports to get all objects, first we need to retrieve keys and then retrieve objects
	//async js library is used to handle async callback along with iteration
	client.keys("tasks.*", function (err, keys) {

		async.map(keys, 
			getTask, function(err, results){
				res.json(results);
		});
	});
});

//Retrieve task by id
router.get("/task/:id", function(req, res, next){

	client.hgetall(getId(req.params.id), function(err, object) {
    	res.json(parseJSON(object));
	});
});

//Create task
router.post("/task", function(req, res, next){
	var task = req.body;
	if(!task.title){
		res.status(400);
		res.json({
			"error" : "Bad Data"
		});
	} else {
		task._id = uuid();
		client.hmset(getId(task._id), task);
		res.json(task);
	}
	
});

// Delete Task by id
router.delete("/task/:id", function(req, res, next){

	client.del(getId(req.params.id));
	res.json(true);
	

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
		client.hmset(getId(task._id), task);
		res.json(task);
	}

});



module.exports = router;