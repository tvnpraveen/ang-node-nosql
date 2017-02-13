var express = require("express");
//create time based uuid
const uuid = require("uuid/v1");
var router = express();

console.log("Task running on Environment : "+global.environment);
var db;
var qb;
var bn;
var N1qlQuery;
var env = global.environment;

var marklogicEnvName = "MarkLogic";
var couchbaseEnvName = "Couchbase";

if(env == marklogicEnvName) {

	var marklogic = require("marklogic");
	var conn = require("../env/marklogic-env.js").connection;

	db = marklogic.createDatabaseClient(conn);
	qb = marklogic.queryBuilder;
} else if(env == couchbaseEnvName){
	var couchbase = require("couchbase");
	var conn = require("../env/couchbase-env.js").connection
	var myCluster = new couchbase.Cluster(conn.cluster);
	//Make sure that there is bucket - default
	db = myCluster.openBucket(conn.bucket);
	// To use N1ql please run the following query on default bucket
	//CREATE PRIMARY INDEX ON `default` USING GSI;
	N1qlQuery = require('couchbase').N1qlQuery;
	db.operationTimeout = 120 * 1000;
	bn = conn.bucket;
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
	} else if(env == couchbaseEnvName){
		var statement = "SELECT * FROM `" + bn + "` ";
    	var query = N1qlQuery.fromString(statement).consistency(N1qlQuery.Consistency.REQUEST_PLUS);
	    db.query(query, function(error, response) {
	        if(error) {
	        	console.log("Please check if the primary index is created. If not create please use the query \n CREATE PRIMARY INDEX ON `default` USING GSI;")
	            return res.json(error);
	        }
	        var results = [];
	        for(var i =0; i< response.length; i++){
        		results.push(response[i].default);
	        }
	        res.json(results);
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
	} else if(env == couchbaseEnvName) {
		db.get(req.params.id, function(err, result) {
		    if (err) {
		            console.log('Some other error occurred: %j', err);
		    } else {
		        res.json(result.value);
		    }
		});
	}
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
		if(env == marklogicEnvName){
			db.documents.write(
			  {
			      uri: "/" + task._id + ".json",
			      contentType: "application/json",
			      collections: ["test data"],
			      content: task
			    }
			).
			  result(function(response){
			    res.json(task)
			  });

		} else if(env == couchbaseEnvName) {
			
			db.upsert(task._id, task, function(error, result) {
		        if(error) {
		            res.json(error);
		            return;
		        }
		        res.json(task);
		    });
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
	} else if(env == couchbaseEnvName) {
		db.remove(req.params.id, function(error, result) {
	        if(error) {
	            res.json(error);
	            return;
	        }
	        res.json(result);
	    });
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
		} else if(env == couchbaseEnvName) {
			db.upsert(task._id, task, function(error, result) {
		        if(error) {
		            res.json(error);
		            return;
		        }
		        res.json(result);
		    });
		}
	}

});



module.exports = router;