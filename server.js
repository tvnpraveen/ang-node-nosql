var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");


function grab(flag){
	var index = process.argv.indexOf(flag);
        return (index === -1) ? null : process.argv[index+1];
}

//Read environment 
var environment = grab("--env");

if(!environment){
	console.log("Specify the environment with --env argument. Ex: --env MarkLogic \n"+
		"Currently supported environments are : \n"+
		" - MarkLogic \n"+
		" - Couchbase \n"+
		" - Documentdb \n"+
		" - Redis \n"+
		" - MongoDB \n"+
		" - Datastore \n"+
		" - DynamoDB\n"
	);
} else {

	global.environment = environment;

	console.log("Application running on database - "+environment)

	var index = require("./routes/index");
	var tasks = require("./routes/"+environment.toLowerCase()+"-tasks");

	var port = 3000;

	var app = express();



	//Vew Engine
	app.set("views", path.join(__dirname,"client"));

	app.set("view engine","ejs");
	app.engine("html", require("ejs").renderFile);

	// Set Static Folder
	app.use(express.static(path.join(__dirname, "client")));

	// Body Parser MW
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: false}));



	app.use("/", index);
	app.use("/api",tasks);









	app.listen(port, function(){
		console.log("Server started on port "+port);
	});

}
