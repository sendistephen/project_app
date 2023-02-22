import { comparePassword, createJWT } from '@src/app/(dashboard)/project/[id]/auth';
import { db } from '@src/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

export default async function signin(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'POST') {
		//  find user by email address from the database
		const user = await db.user.findUnique({
			where: {
				email: req.body.email,
			},
		});
		// Compare the submitted user password with the one in the database
		const isUserFound = await comparePassword(req.body.password, user?.password);
		if (isUserFound) {
			// Create a json web token
			const jwt = await createJWT(user);
			res.setHeader(
				'Set-Cookie',
				serialize(process.env.COOKIE_NAME, jwt, {
					httpOnly: true,
					path: '/',
					secure: process.env.NODE_ENV === 'production',
					maxAge: 1000 * 60 * 60 * 24 * 7,
				})
			);
			res.status(201);
			res.end();
		} else {
			res.status(402);
			res.end();
		}
	}
}
