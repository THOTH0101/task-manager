import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '$env/static/private';

export const createToken = (userId: string) => {
	const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1d' });
	return token;
};

export const verifyToken = (token: string) => {
	const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
	return decoded.userId;
};
