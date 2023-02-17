// import { hashPassword } from '@src/app/lib/auth';
import { db } from '@src/lib/db';
import { TASK_STATUS } from '@prisma/client';

// Generates a random task status
const getRandomTaskStatus = () => {
	const statuses = [TASK_STATUS.COMPLETED, TASK_STATUS.NOT_STARTED, TASK_STATUS.STARTED];
	return statuses[Math.floor(Math.random() * statuses.length)];
};

// Main function that creates random user with 5 projects and 10 tasks per project
async function main() {
	const user = await db.user.upsert({
		where: { email: 'user@email.com' },
		update: {},
		create: {
			email: 'user@email.com',
			firstName: 'User',
			lastName: 'Person',
			password: 'password',
			projects: {
				create: new Array(5).fill(1).map((_, i) => ({
					name: `Project ${i}`,
					due: new Date(2022, 11, 25),
				})),
			},
		},
		include: {
			projects: true,
		},
	});

	// Creates 10 tasks for each project in the database
	const tasks = await Promise.all(
		user.projects.map((project) =>
			db.task.createMany({
				data: new Array(10).fill(1).map((_, i) => {
					return {
						name: `Task ${i}`,
						ownerId: user.id,
						projectId: project.id,
						description: `Everything that describes Task ${i}`,
						status: getRandomTaskStatus(),
					};
				}),
			})
		)
	);

	console.log({ user, tasks });
}
main()
	.then(async () => {
		await db.$disconnect(); // Disconnect db when complete
	})
	.catch(async (e) => {
		// Exit with 1 if error
		console.error(e);
		await db.$disconnect();
		process.exit(1);
	});
