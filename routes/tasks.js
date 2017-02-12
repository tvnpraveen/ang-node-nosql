var express = require("express");
//create time based uuid
const uuid = require("uuid/v1");
var router = express();

console.log("Task running on Environment : "+global.environment);
var db;
var qb;
var env = global.environment;

var marklogicEnvName = "MarkLogic";

if(env == marklogicEnvName) {
	var marklogic = require("marklogic");
	var conn = require("../env/marklogic-env.js").connection;

	db = marklogic.createDatabaseClient(conn);
	qb = marklogic.queryBuilder;
}
//Retrieve all tasks
router.get("/tasks", function(req, res, next){

	if(env == marklogicEnvName){
		db.documents.query(
		    qb.where(qb.parsedFrom(''))
		).result( function(results) {
			var content = [];
			for(var i = 0; i < results.length; i++){
				content.push(results[i].content);
			}
			res.json(content);
		});
	}
});

//Retrieve task by id
router.get("/task/:id", function(req, res, next){


	if(env == marklogicEnvName){
		db.documents.query(
		    qb.where(qb.value("_id", req.params.id))
		).result( function(results) {
			res.json(results[0].content);
		});
	}
});

//Create task
router.post("/task", function(req, res, next){
	var tasks = req.body;
	for(var i = 0; i < tasks.length; i++) {
		if(!tasks[i].title){
			res.status(400);
			res.json({
				"error" : "Bad Data"
			});
		} else {
			tasks[i]._id = uuid();
			if(env == marklogicEnvName){
				db.documents.write(
				  {
				      uri: "/" + tasks[i]._id + ".json",
				      contentType: "application/json",
				      collections: ["test data"],
				      content: tasks[i]
				    }
				).
				  result(function(response){
				    res.json(JSON.stringify(response))
				  });

			}

		}
	}
});

// Delete Task by id
router.delete("/task/:id", function(req, res, next){
	if(env == marklogicEnvName){
		db.documents.remove('/'+ req.params.id +'.json').result(
		    function(response) {
		      res.json(JSON.stringify(response));
		    } 
		);
	}

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
		if(env == marklogicEnvName){
			db.documents.write(
			  {
			      uri: "/" + task._id + ".json",
			      contentType: "application/json",
			      collections: ["Updated"],
			      content: task
			    }
			).
			  result(function(response){
			    res.json(task)
			  });
		}
	}

});



module.exports = router;