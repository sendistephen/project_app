import ' styles/global.css';
import GlassPane from '@components/GlassPane';
import Head from '../head';
import Sidebar from '@components/Sidebar';

export default function DashboardRootLayout({ children }) {
	return (
		<html lang='en'>
			<Head />
			<body className='h-screen w-screen rainbow-mesh p-6'>
				<GlassPane className='w-full h-full flex items-center justify-center gap-4'>
					<Sidebar />
					{children}
				</GlassPane>
			</body>
		</html>
	);
}
