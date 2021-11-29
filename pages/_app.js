import Particles from 'react-tsparticles'
import '../styles/globals.css'


function MyApp({ Component, pageProps }) {
	return (
		<>
			<Particles
				id='tsparticles'
				style={{
					position: 'relative',
					zIndex: -1,
				}}
				options={{
					fpsLimit: 60,
					interactivity: {
						events: {
							onHover: {
								enable: true,
								mode: 'repulse',
							},
						},
						modes: {
							bubble: {
								distance: 400,
								duration: 2,
								opacity: 0.8,
								size: 40,
							},
							push: {
								quantity: 4,
							},
							repulse: {
								distance: 50,
								duration: 0.4,
							},
						},
					},
					particles: {
						color: {
							value: '#ffc115',
						},
						links: {
							color: '#D8F9FF',
							distance: 150,
							enable: true,
							opacity: 0.1,
							width: 1,
						},
						collisions: {
							enable: true,
						},
						move: {
							direction: 'none',
							enable: true,
							outMode: 'bounce',
							random: false,
							speed: 1,
							straight: false,
						},
						number: {
							density: {
								enable: true,
								value_area: 1000,
							},
							value: 80,
						},
						opacity: {
							value: 0.5,
						},
						shape: {
							type: 'triangle',
						},
						size: {
							random: true,
							value: 3,
						},
					},
					detectRetina: true,
				}}
			/>
			<div style={{ position: 'relative', zIndex: 2 }}>
				<Component {...pageProps} />
			</div>
		</>
	)
}

export default MyApp
