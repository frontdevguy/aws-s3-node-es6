import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const { AWS_S3_ACCESS_KEY_ID, AWS_S3_SECRET_ACCESS_KEY, AWS_S3_BUKECT_NAME } = process.env;

const s3 = new AWS.S3({
	accessKeyId: AWS_S3_ACCESS_KEY_ID,
	secretAccessKey: AWS_S3_SECRET_ACCESS_KEY,
});

export const UploadToS3 = (file) => {
	const params = {
		Bucket: AWS_S3_BUKECT_NAME,
		Key: `${new Date().getTime()}.${file.name.toLowerCase().replace(/ /g, '_')}`,
		Body: file.data,
		ContentType: file.mimetype,
		ACL: 'public-read',
	};

	return new Promise ((resolve, reject) => (
		s3.upload(params, (err, data) => {
		if (err) return reject(err);
			return resolve({
				path: data.Location,
				filename: file.name,
				size: file.size,
				encoding: file.encoding,
				mimetype: file.mimetype,
			});
		}))
	);
};