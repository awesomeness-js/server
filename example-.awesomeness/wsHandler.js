export default async ({
	socket,
	message,
})=>{

	socket.send(JSON.stringify({
		type: message.type ?? "echo",
		clientId: socket.clientId,
		echo: message,
		ts: Date.now()
	}));

};
