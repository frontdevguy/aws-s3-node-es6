import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv';
import { UploadToS3 } from './utils';

dotenv.config({ path: path.join(__dirname, '../.env') });

const { PORT } = process.env;

const app = express();

// enable files upload
app.use(
	fileUpload({
		createParentPath: true,
	}),
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.sendFile('views/index.html', { root: __dirname });
});

const uploadFiles = (indetifier) => async (req, res, next) => {
	const resource = req.files[indetifier];
	if (Array.isArray(resource)) {
		let promises = [];
		resource.map((file) => {
			let promise = UploadToS3(file);
			promises.push(promise);
		});
		try {
			req.uploadeFiles = await Promise.all(promises);
		} catch (error) {
			//log error
		}
		next();
	} else {
		try {
			req.uploadeFiles = [ await UploadToS3(resource) ];
		} catch (error) {
			//log error
		}
		next();
	}
};

app.post('/upload-file', uploadFiles('file'), async (req, res) => {
	const { uploadeFiles } = req;
	res.json(uploadeFiles);
});

app.listen(PORT, () => {
	console.log(`Server is listening to port ${PORT}`);
});
