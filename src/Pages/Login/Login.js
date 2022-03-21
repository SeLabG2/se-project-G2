import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { StyledButton, StyledForm, StyledFormDiv, StyledFormWrapper, StyledInput, StyledLabel, StyledLink } from '../../components/styled/Login.styled';
import { StyledTitle } from '../../components/styled/StyledTitle';
import { login, selectUser } from '../../features/user/userSlice';
import { loginUser, useAuth } from '../../firebase/firebase';


function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const currentUser = useAuth();
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        console.log('current user : ', currentUser);
        console.log('global user before login : ', user);
        try {
            const userCredentials = await loginUser(email, password);
            console.log('user logged in : ', userCredentials.user);
            dispatch(login({
                email: userCredentials.user.email,
                uid: userCredentials.user.uid,
            }));
            console.log('global user after login : ', user);
            navigate('/');
        } catch (err) {
            console.log(err.message);
        }
        setIsLoading(false);
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
                    <StyledButton disabled={isLoading} type="submit">Login</StyledButton>
                    <p className='form__signup-para'>Don't have an account? </p>
                    <StyledLink to="/signup">Sign-up here!</StyledLink>
                </StyledForm>
            </StyledFormWrapper>
        </>
    );
}

export default Login;