import { WebSocketServer } from "ws";
import { handleWsMessage } from "./handlers.js";

export function attachWs(server, path = "/ws") {

	// noServer mode so we own upgrades
	const wss = new WebSocketServer({ noServer: true });

	wss.on("connection", (socket, req) => {

		const clientId = Math.random().toString(36).slice(2, 8);

		socket.clientId = clientId;

		socket.send(JSON.stringify({
			type: "welcome",
			clientId,
			ts: Date.now()
		}));

		socket.on("message", (raw) => handleWsMessage({
			socket,
			raw,
		}));
	
	});

	server.on("upgrade", (req, socket, head) => {

		const { url } = req;

		if (url === path) {

			wss.handleUpgrade(req, socket, head, (ws) => {

				wss.emit("connection", ws, req);
			
			});
		
		} else {

			socket.destroy();
		
		}
	
	});

	return wss;

}
