import fastify from "fastify";

const server = fastify();

server.get("/", (req, res) => {
	res.send("this is API");
});

server.listen({port: 80, host: "0.0.0.0"}, (err, address) => {
	if(err)throw err;
	console.log("fastify is ready.");
});
