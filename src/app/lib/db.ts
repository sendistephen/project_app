import { PrismaClient } from '@prisma/client';

/**
 * Declare a global variable so that it can be
 *  accessed across different files
 */
declare global {
	// eslint-disable-next-line no-var
	var cachedPrisma: PrismaClient;
}

let prisma: PrismaClient;

/**
 * If the application is running in production environment,
 * create a new instance of PrismaClient.
 */
if (process.env.NODE_ENV === 'production') {
	prisma = new PrismaClient();
} else {
	/**
	 * If the application is running in development environment,
	 * first check if the global cachedPrisma object is already
	 * created. If not, create a new instance of PrismaClient.
	 * Else, the global cachedPrisma object will be used for
	 * the current request.
	 */
	if (!global.cachedPrisma) {
		global.cachedPrisma = new PrismaClient();
	}
	prisma = global.cachedPrisma;
}
// Export the prism instance as a module"????";"
export const db = prisma;
