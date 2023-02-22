import { TextEncoder } from 'util';
import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';

// Create a constant for use in checking for file extensions.
const PUBLIC_FILE = /\.(.*)$/;

// Function that verifies the given JWT token
const verifyJWT = async (jwt) => {
	// Obtain the payload of the JWT Token by decoding it using the Text Encoder and the process environment's JWT Secret.
	const { payload } = await jwtVerify(jwt, new TextEncoder().encode(process.env.JWT_SECRET));
	return payload; // Return the decoded payload
};

export default async function middleware(req, res) {
	// Get the pathname of the request
	const { pathname } = req.nextUrl;
	// Check if any of the pathnames starts with any of these string. If yes, then redirect.
	if (
		pathname.startsWith('/_next') ||
		pathname.startsWith('/api') ||
		pathname.startsWith('/static') ||
		pathname.startsWith('/signin') ||
		pathname.startsWith('/register') ||
		PUBLIC_FILE.test(pathname)
	) {
		// Redirect to the next page
		return NextResponse.next();
	}
	// Get the JWT cookie from the request
	const jwt = req.cookies.get(process.env.JWT_COOKIE_NAME);
	// If no JWT cookie is present, then redirect to the signin page
	if (!jwt) {
		req.nextUrl.pathname = '/signin';
		return NextResponse.redirect(req.nextUrl);
	}

	try {
		// Verify the JWT Token
		await verifyJWT(jwt);
		// Redirect to the next page
		return NextResponse.next();
	} catch (error) {
		console.error(error);
		// Redirect to the signin page
		req.nextUrl.pathname = '/signin';
		return NextResponse.redirect(req.nextUrl);
	}
}
