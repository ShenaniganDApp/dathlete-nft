import styled from 'styled-components'

const Button = ({ href, children }) => {
	return (
		<StyledButton href={href}>
			<Text>{children}</Text>
		</StyledButton>
	)
}

export default Button

const StyledButton = styled.a`
	display: inline-block;
	background-color: #6284ff;
	padding: 1.2rem 2.8rem;
	line-height: 1.2;
	outline: none;
	border: none;
	border-radius: 10px;
	background-image: linear-gradient(270deg, #ffc115 0%, #f15025 100%);
	background-size: 150%;
	background-position: 0% 50%;
	transition: background-position 0.2s;
	color: white;
	cursor: pointer;
	text-align: center;

	&:hover {
		background-position: 100% 50%;
		color: #fff;
		text-decoration: none;
	}
`

const Text = styled.span`
	font-size: clamp(1.6rem, 2vw, 1.8rem);
	margin: 0;
	font-family: Montserrat, sans-serif;
	text-shadow: 1px 1px #1b181b;
`
