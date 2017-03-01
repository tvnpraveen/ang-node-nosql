
var config = {};

config.region = "us-east-1";
//config.endpoint = "http://localhost:11000"; Uncomment this and change the port accordingly if you are using
//local installation of Dynamodb
config.tableName = "Tasks";



config.init=function(dynamodb) {


    var checkParams = {
        TableName: config.tableName
    };

    var params = {
        TableName : config.tableName,
        KeySchema: [       
             { AttributeName: "_id", KeyType: "HASH" }  //Partition key
        ],
        AttributeDefinitions: [       
            { AttributeName: "_id", AttributeType: "S" }
            
        ],
        ProvisionedThroughput: {       
            ReadCapacityUnits: 10, 
            WriteCapacityUnits: 10
        }
    };



    dynamodb.describeTable(checkParams, function(err, data){
        if (err) {
            dynamodb.createTable(params, function(err, data) {
                if (err) {
                    console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
                } 
            });
      } 
    });
}




module.exports = config;


