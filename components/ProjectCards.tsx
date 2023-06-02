import { Prisma } from '@prisma/client';
import { FC } from 'react';

const projectWithTasks = Prisma.validator<Prisma.ProjectArgs>()({
	include: { tasks: true },
});

type ProjectWithTasks = Prisma.ProjectGetPayload<typeof projectWithTasks>;

const formData = (date) => {
	new Date(date).toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});

	const ProjectCard: FC<{ project: ProjectWithTasks }> = ({ project }) => {};
};
