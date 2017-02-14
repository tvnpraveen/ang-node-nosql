var express = require("express");
//create time based uuid
const uuid = require("uuid/v1");
var router = express();


var couchbase = require("couchbase");
var conn = require("../env/couchbase-env.js").connection
var myCluster = new couchbase.Cluster(conn.cluster);
//Make sure that there is bucket - default
var db = myCluster.openBucket(conn.bucket);
// To use N1ql please run the following query on default bucket
//CREATE PRIMARY INDEX ON `default` USING GSI;
var N1qlQuery = require('couchbase').N1qlQuery;
db.operationTimeout = 120 * 1000;
var bn = conn.bucket;

//Retrieve all tasks
router.get("/tasks", function(req, res, next){

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

});

//Retrieve task by id
router.get("/task/:id", function(req, res, next){

	db.get(req.params.id, function(err, result) {
	    if (err) {
	            console.log('Some other error occurred: %j', err);
	    } else {
	        res.json(result.value);
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
		db.upsert(task._id, task, function(error, result) {
	        if(error) {
	            res.json(error);
	            return;
	        }
	        res.json(task);
	    });

	}
	
});

// Delete Task by id
router.delete("/task/:id", function(req, res, next){
	db.remove(req.params.id, function(error, result) {
        if(error) {
            res.json(error);
            return;
        }
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
		db.upsert(task._id, task, function(error, result) {
	        if(error) {
	            res.json(error);
	            return;
	        }
	        res.json(result);
	    });
	}

});



module.exports = router;