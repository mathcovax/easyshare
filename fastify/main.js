import fastify from "fastify";
import fs from "fs";
import { resolve } from "path";

export const server = fastify();

function find(path, arr){
	for(const file of fs.readdirSync(path)){
		if(fs.lstatSync(resolve(path, file)).isDirectory() === true)find(resolve(path, file), arr);
		else if(file.endsWith(".js") === true)arr.push(import("file://" + resolve(path, file)));
	}
}

const imp = [];
find("./src", imp);
Promise.all(imp).then(() => {
	server.listen({port: 80, host: "0.0.0.0"}, (err, address) => {
		if(err)throw err;
		console.log("fastify is ready.");
	});
});
