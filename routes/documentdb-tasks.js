var express = require("express");
//create time based uuid
const uuid = require("uuid/v1");
var router = express();


var DocumentDBClient = require('documentdb').DocumentClient;
var config = require("../env/documentdb-env.js")

var dbClient = new DocumentDBClient(config.host, {
    masterKey: config.authKey
});

var database = null;
var collection = null;

init = function() {
	config.getOrCreateDatabase(dbClient, config.databaseId, function(err, db){
		if(err) {
			return err;
		} else {

		 database = db;
		 collection = config.getOrCreateCollection(dbClient, database, config.databaseId, function(err, coll){
		 	if(err) {
				return err;
			} else {
				collection = coll;
			}
		 });

		}
	});

}

getTask = function(taskId, callback) {
        var querySpec = {
            query: 'SELECT * FROM root r WHERE r._id = @id',
            parameters: [{
                name: '@id',
                value: taskId
            }]
        };

        dbClient.queryDocuments(collection._self, querySpec).toArray(function (err, results) {
            if (err) {
                callback(err);

            } else {
                callback(null, results[0]);
            }
        });
    }


//Retrieve all tasks
router.get("/tasks", function(req, res, next){
	init();

	var querySpec = {
            query: 'SELECT * FROM root r'
        };
    dbClient.queryDocuments(collection._self, querySpec).toArray(function (err, results) {
            if (err) {
                res.json(err);
            } else {
                res.json(results);
            }
        });
});

//Retrieve task by id
router.get("/task/:id", function(req, res, next){

	getTask(req.params.id, function (err, results) {
        if (err) {
            res.json(err);

        } else {
            res.json(results);
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

		dbClient.createDocument(collection._self, task, function (err, doc) {
            if (err) {
                res.json(err);

            } else {
                res.json(doc);
            }
        });

	}
	
});

// Delete Task by id
router.delete("/task/:id", function(req, res, next){
	
	getTask(req.params.id, function(error, result){
		if(error) {
			res.json(error);
		} else {
			dbClient.deleteDocument(result._self, function(error, result) {
		        if(error) {
		            res.json(error);
		            return;
		        }
		        res.json(true);
		    });
		}
		

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
		getTask(req.params.id, function(error, result){
			
			if(error) {
				res.json(error);
			} else {
				result.isDone = true;
				dbClient.replaceDocument(result._self, result, function (err, replaced) {
		            if (err) {
		                res.json(err);

		            } else {
		                res.json(replaced);
		            }
		        });
			}

		});
		
	}

});



module.exports = router;