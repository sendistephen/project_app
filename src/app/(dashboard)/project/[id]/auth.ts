import { db } from '@src/lib/db';
import bcrypt from 'bcrypt';
import { SignJWT, jwtVerify } from 'jose';

// Hashes a given password with bcrypt.
export const hashPassword = (password) => bcrypt.hash(password, 10);

// Verifies a given password with bcrypt.
export const comparePassword = (plainTextPassword, hashedPassword) =>
	bcrypt.compare(plainTextPassword, hashedPassword);

/**
 * Creates a Json Web Token (JWT) that contains the user's Id and Email
 * as its payload and sets the expiry date of the token to one year
 * @param user
 * @returns
 */
export const createJWT = (user) => {
	// Get the current UNIX timestamp in seconds
	const iat = Math.floor(Date.now() / 1000);
	// Set the expiry of the token to one year from now
	const exp = iat + 60 * 60 * 24 * 365;

	return new SignJWT({ payload: { id: user.id, email: user.email } })
		.setProtectedHeader({
			alg: 'HS256',
			typ: 'JWT',
		})
		.setExpirationTime(exp) // Set the expiration time to one year
		.setIssuedAt(iat)
		.setNotBefore(iat)
		.sign(new TextEncoder().encode(process.env.JWT_SECRET)); // Sign the JWT with the secret key in the environment variable
};

/**
 *
 * @param jwt
 * @returns
 * This function validates the JWT sent by the client and returns the payload associated with it.
 * It also decodes the secret key present in the env to confirm the validity of the token...
 */
export const validateJWT = async (jwt) => {
	const { payload } = await jwtVerify(jwt, new TextEncoder().encode(process.env.JWT_SECRET));
	return payload.payload as any;
};

export const getUserFromCookie = async (cookies) => {
	// Get the JWT from the cookie
	const jwt = cookies.get(process.env.COOKIE_NAME);
	// Validate the JWT and extract the user id
	const { id } = await validateJWT(jwt);
	// Get the user from the db based on their id
	const user = await db.user.findUnique({
		where: {
			id,
		},
	});
	return user;
};
