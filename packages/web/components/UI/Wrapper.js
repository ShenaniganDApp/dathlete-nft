import styled from 'styled-components'

const Wrapper = ({ children }) => {
	return <StyledWrapper>{children}</StyledWrapper>
}

export default Wrapper

const StyledWrapper = styled.div`
	width: 100%;
	max-width: 128rem;
	margin-left: auto;
	margin-right: auto;
	padding-left: 1.8rem;
	padding-right: 1.8rem;
`
