#! /usr/bin/env node

import fs from "fs";
import { execSync, spawn } from "child_process";
const Watcher = (await import("/usr/local/lib/node_modules/watcher/dist/watcher.js")).default;

if(!fs.existsSync("/vue/node_modules")){
	console.log("Install all package.");
	execSync("npm install", {cwd: "/vue", stdio: "ignore"});
	execSync("chmod -R 777 /vue", {stdio: "ignore"});
}

class child{
	static start(){
		this.process = spawn("npm", ["run", "dev"], {stdio: "inherit", cwd: "/vue", detached: true});
		this.watcher = new Watcher("/vue/node_modules").on("unlinkDir", () => child.restart());
	}

	static stop(){
		this.watcher.close();
		try{
			process.kill(this.process.pid, "SIGINT");
		}catch{}
	}

	static restart(){
		this.stop();
		console.log("Starting reinstall all package");
		execSync("npm install", {stdio: "ignore", cwd: "/vue"});
		execSync("chmod -R 777 ./node_modules", {stdio: "ignore", cwd: "/vue"});
		this.start();
	}

	static process;
	static watcher;
}

child.start();
