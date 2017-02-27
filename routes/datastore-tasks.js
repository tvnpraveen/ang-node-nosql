var express = require("express");
//create time based uuid
const uuid = require("uuid/v1");
var router = express();

// Imports the Google Cloud client library
const Datastore = require('@google-cloud/datastore');
var conn = require("../env/datastore-env.js").connection

// Instantiates a client
const datastore = Datastore({
  projectId: conn.projectId,
  keyFilename: './env/datastore.json'
});

// The kind for the new entity
const kind = conn.kind;


//Retrieve all tasks
router.get("/tasks", function(req, res, next){
	const query = datastore.createQuery(kind);

  	datastore.runQuery(query)
    .then((results) => {
      res.json(results[0]);
    });
	

});

//Retrieve task by id
router.get("/task/:id", function(req, res, next){
	const key = datastore.key([kind, req.params.id]);
	datastore.get(key, (err, entity) => {
	    if (err) {
	      throw err;
	    }
	    else{
	    	res.json(entity);
	    }
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

		const taskKey = datastore.key([kind, task._id]);

		const taskObj = {	
		  key: taskKey,
		  data: task
		};


		datastore.save(taskObj)
		  .then(() => {
		    res.json(task);
		  });

	}
	
});

// Delete Task by id
router.delete("/task/:id", function(req, res, next){
	const key = datastore.key([kind, req.params.id]);
  	datastore.delete(key, function(err, result){
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
		const taskKey = datastore.key([kind, task._id]);

		const taskObj = {	
		  key: taskKey,
		  data: task
		};


		datastore.save(taskObj)
		  .then(() => {
		    res.json(task);
		  });
	}

});



module.exports = router;


