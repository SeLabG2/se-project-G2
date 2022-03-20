import React, { useState } from 'react';
import { StyledButton, StyledForm, StyledFormDiv, StyledFormWrapper, StyledInput, StyledLabel, StyledLink } from '../../components/styled/Login.styled';
import { StyledTitle } from '../../components/styled/StyledTitle';


function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
    };

    const { email, password } = formData;

    return (
        <>
            <StyledFormWrapper>
                <StyledForm autoComplete="off" onSubmit={onSubmit}>
                    <StyledTitle>Welcome!</StyledTitle>
                    <StyledFormDiv>
                        <StyledInput
                            type="email"
                            id="email"
                            placeholder=" "
                            name="email"
                            value={email}
                            onChange={onChange}
                        />
                        <StyledLabel className="form__label" htmlFor="email">Email</StyledLabel>
                    </StyledFormDiv>
                    <StyledFormDiv>
                        <StyledInput
                            type="password"
                            id="password"
                            placeholder=" "
                            name="password"
                            value={password}
                            onChange={onChange}
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