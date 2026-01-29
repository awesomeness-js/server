import Busboy from 'busboy';

// ---------- helper for JSON ----------
const parseBody = (req, limit) => {

	return new Promise((resolve, reject) => {

		let body = '';
		let receivedLength = 0;

		req.on('data', (chunk) => {

			receivedLength += chunk.length;

			if (receivedLength > limit) {

				reject(new Error('Payload too large'));
				req.destroy();
				
				return;
			
			}

			body += chunk;
		
		});

		req.on('end', () => resolve(body));
		req.on('error', (err) => reject(err));
	
	});

};

// ---------- multipart with Busboy (in memory, preserves field structure) ----------
const parseMultipart = (req, limit = 10 * 1024 * 1024) => {

	return new Promise((resolve, reject) => {

		const busboy = Busboy({
			headers: req.headers,
			limits: { fileSize: limit } 
		});
		const body = {};

		busboy.on('field', (name, value) => {

			// handle "name[]" style fields as arrays
			if (name.endsWith('[]')) {

				const clean = name.slice(0, -2);

				body[clean] ??= [];
				body[clean].push(value);
			
			} else if (body[name] !== undefined) {

				// already exists → turn into array
				if (!Array.isArray(body[name])) body[name] = [ body[name] ];
				body[name].push(value);
			
			} else {

				body[name] = value;
			
			}
		
		});

		busboy.on('file', (name, file, info) => {

			const {
				filename, encoding, mimeType 
			} = info;
			const chunks = [];
			let totalSize = 0;

			file.on('data', (chunk) => {

				totalSize += chunk.length;

				if (totalSize > limit) {

					reject(new Error('File too large'));
					req.destroy();
					
					return;
				
				}

				chunks.push(chunk);
			
			});

			file.on('end', () => {

				const fileObj = {
					filename,
					mimeType,
					encoding,
					buffer: Buffer.concat(chunks),
				};

				// name[] → array
				if (name.endsWith('[]')) {

					const clean = name.slice(0, -2);

					body[clean] ??= [];
					body[clean].push(fileObj);
				
				} else if (body[name] !== undefined) {

					if (!Array.isArray(body[name])) body[name] = [ body[name] ];
					body[name].push(fileObj);
				
				} else {

					body[name] = fileObj;
				
				}
			
			});
		
		});

		busboy.on('finish', () => resolve(body));
		busboy.on('error', (err) => reject(err));

		req.pipe(busboy);
	
	});

};



// ---------- middleware ----------
const jsonBodyParser = async (ctx, next) => {

	const method = ctx.method;
	const isJson =
    [ 'POST', 'PUT', 'PATCH' ].includes(method) && ctx.is('application/json');
	const isMultipart =
    [ 'POST', 'PUT', 'PATCH' ].includes(method) && ctx.is('multipart/form-data');


	try {

		if (isJson) {

			const body = await parseBody(ctx.req, 10 * 1024 * 1024);

			ctx.request.body = JSON.parse(body);
		
		} else if (isMultipart) {

			ctx.request.body = await parseMultipart(ctx.req);
		
		}
	
	} catch (err) {

		ctx.throw(413, new Error('Payload too large'));
	
	}

	await next();

};

export { jsonBodyParser };
