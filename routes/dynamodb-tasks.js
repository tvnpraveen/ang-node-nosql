var express = require("express");
//create time based uuid
const uuid = require("uuid/v1");
var router = express();


var AWS = require("aws-sdk");
var config = require("../env/dynamodb-env.js");


AWS.config.update({
  //endpoint: config.endpoint, Note: Uncomment if you are using local installation of DynamoDB
  region: config.region
});

var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();


config.init(dynamodb);

//Retrieve all tasks
router.get("/tasks", function(req, res, next){
        var params = {
            TableName: config.tableName
        };

        docClient.scan(params, function(err, data) {
            if (err) {
                console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Scan succeeded.");
                 /* data.Items.forEach(function(tasks) {
                    console.log(
                        tasks);
                });*/
               

            // continue scanning if we have more movies, because
            // scan can retrieve a maximum of 1MB of data
                if (typeof data.LastEvaluatedKey != "undefined") {
                    console.log("Scanning for more...");
                    params.ExclusiveStartKey = data.LastEvaluatedKey;
                    docClient.scan(params, onScan);
                }
                 res.json(data.Items);
            }

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
        var params = {
            TableName:config.tableName,
            Item:{
                "title":task.title,
                "_id":task._id,
                "isDone":task.isDone
            }
        };

        docClient.put(params, function(err, data) {
            if (err) {
                console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Added item:", JSON.stringify(data, null, 2));
                res.json(task);
            }
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
        var params = {
                TableName:config.tableName,
                Key:{
                    "_id": task._id
                   
                },                
                UpdateExpression: "set isDone=:r",
                ExpressionAttributeValues:{
                    ":r":task.isDone
                },
                ReturnValues:"UPDATED_NEW"
        };
        console.log("Updating the item...");
        docClient.update(params, function(err, data) {
            if (err) {
                console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                res.json(data);
            }
        });
    }

});


// Delete Task by id
router.delete("/task/:id", function(req, res, next){
  
    var params = {
        TableName:config.tableName,
        Key:{
            "_id":req.params.id
                     
        }
    };
    console.log("Attempting a conditional delete...");
    docClient.delete(params, function(err, data) {
        if (err) {
            console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
            res.json(data);
        }
    });

});

module.exports = router;