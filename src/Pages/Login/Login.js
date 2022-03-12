import React from 'react';
import { StyledButton, StyledForm, StyledFormDiv, StyledFormWrapper, StyledInput, StyledLabel, StyledLink } from '../../components/styled/Login.styled';
import { StyledTitle } from '../../components/styled/StyledTitle';


function Login() {
    return (
        <>
            <StyledFormWrapper>
                <StyledForm autoComplete="off">
                    <StyledTitle>Welcome!</StyledTitle>
                    <StyledFormDiv>
                        <StyledInput
                            type="search"
                            id="email"
                            placeholder=" "
                        />
                        <StyledLabel className="form__label" htmlFor="email">Email</StyledLabel>
                    </StyledFormDiv>
                    <StyledFormDiv>
                        <StyledInput
                            type="password"
                            id="password"
                            placeholder=" "
                        />
                        <StyledLabel className="form__label" htmlFor="password">Password</StyledLabel>
                    </StyledFormDiv>
                    <StyledButton type="submit">Login</StyledButton>
                    <p className='form__signup-para'>Don't have an account? </p>
                    <StyledLink to="/signup">Sign-up here!</StyledLink>
                </StyledForm>
            </StyledFormWrapper>
        </>
    );
}

export default Login;