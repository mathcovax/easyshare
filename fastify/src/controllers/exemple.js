import { server } from "../../main.js";

server.get("/", (req, res) => {
	res.send("this is API");
});
