import getConfig from "../getConfig.js";

export default function handleWsMessage({
	socket, 
	raw
}) {


	const awesomenessConfig = getConfig();


	let msg;

	try {

		msg = JSON.parse(raw.toString());
	
	} catch (err) {

		socket.send(JSON.stringify({
			type: "error",
			error: "Invalid JSON",
			ts: Date.now()
		}));
		
		return;
	
	}

	if (awesomenessConfig.debug) {

		// Example: log which client sent the message
		console.log("client", socket.clientId, "sent", msg);
	
	}

	if (msg?.type === "ping") {

		socket.send(JSON.stringify({
			type: "pong",
			clientId: socket.clientId,
			echo: msg.data ?? null,
			ts: Date.now()
		}));
		
		return;
	
	}

	if(typeof awesomenessConfig.wsHandler === 'function'){

		awesomenessConfig.wsHandler({
			socket,
			message: msg,
		});
	
	} else {
		
		socket.send(JSON.stringify({
			type: msg.type ?? "echo",
			clientId: socket.clientId,
			echo: msg,
			ts: Date.now()
		}));

	}


}
