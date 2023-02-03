#! /usr/bin/env node

import fs from "fs";
import { execSync, spawn } from "child_process";
const Watcher = (await import("/usr/local/lib/node_modules/watcher/dist/watcher.js")).default;

if(!fs.existsSync("/fastify/node_modules")){
	console.log("Install all package.");
	execSync("npm install", {cwd: "/fastify", stdio: "ignore"});
	execSync("chmod -R 777 /fastify", {stdio: "ignore"});
}

class child{
	static process;
	static watcher1;
	static watcher2;

	static start(){
		this.process = spawn("node", ["main.js"], {stdio: "inherit", cwd: "/fastify", detached: true});
		this.watcher1 = new Watcher("/fastify/node_modules").on("unlinkDir", () => child.restart());
		this.watcher2 = new Watcher("/fastify", {recursive: true, ignore: path=>!path.startsWith("/fastify") || path.indexOf("node_modules") > -1}).on("change", () => child.restart());
	}

	static stop(){
		this.watcher1.close();
		this.watcher2.close();
		try{
			process.kill(this.process.pid, "SIGINT");
		}catch{}
	}

	static restart(){
		this.stop();

		if(!fs.existsSync("/fastify/node_modules")){
			console.log("Starting reinstall all package");
			execSync("npm install", {stdio: "ignore", cwd: "/fastify"});
			execSync("chmod -R 777 ./node_modules", {stdio: "ignore", cwd: "/fastify"});
		}

		this.start();
	}
}

child.start();
