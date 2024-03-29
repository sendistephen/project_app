import Greetings from '@components/Greetings';
import GreetingsSkeleton from '@components/GreetingsSkeleton';
import { delay } from '@lib/async';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Suspense } from 'react';

export default async function Page() {
	return (
		<div className='h-full overflow-y-auto pr-6 w-full'>
			<div className=' h-full items-stretch justify-center min-h-[content]'>
				<div className='flex-1 grow flex'>
					{
						<Suspense fallback={<GreetingsSkeleton />}>
							<Greetings />
						</Suspense>
					}
				</div>
				<div className='flex flex-2 grow items-center flex-wrap mt-3 -m-3 '>
					{/** projects map here */}
					<div className='w-1/3 p-3'>{/* new project here */}</div>
				</div>
				<div className='mt-6 flex-2 grow w-full flex'>
					<div className='w-full'>{/* tasks here */}</div>
				</div>
			</div>
		</div>
	);
}
