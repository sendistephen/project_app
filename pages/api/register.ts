import { db } from '@lib/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
import { createJWT, hashPassword } from 'app/(dashboard)/project/[id]/auth';

export default async function register(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// Check if the request was a POST request
	if (req.method === 'POST') {
		// Create the new user using data from the request body
		const user = await db.user.create({
			data: {
				email: req.body.email,
				password: await hashPassword(req.body.password),
				firstName: req.body.firstName,
				lastName: req.body.lastName,
			},
		});
		// Create a JWT for the new user
		const jwt = await createJWT(user);
		// Set the cookie in the response with the JWT and correct settings
		res.setHeader(
			'Set-Cookie',
			serialize(process.env.COOKIE_NAME, jwt, {
				httpOnly: true,
				path: '/',
				maxAge: 60 * 60 * 24 * 365,
			})
		);
		res.status(201); // Created
		res.json({});
	}
}
