import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { StyledButton, StyledForm, StyledFormDiv, StyledFormWrapper, StyledInput, StyledLabel, StyledLink } from '../../components/styled/Login.styled';
import { StyledTitle } from '../../components/styled/StyledTitle';
import { reset, selectUser, selectUserStatus, signup } from '../../features/user/userSlice';


function SignUp() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        university: ''
    });
    const { username, email, password, confirmPassword, university } = formData;
    const [formStep, setFormStep] = useState(0);

    const user = useSelector(selectUser);
    const { isLoading, isError, isSuccess, message } = useSelector(selectUserStatus);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (isError) {
            toast(message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }

        if (isSuccess || user) {
            navigate('/');
        }

        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);


    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        // validate the form here

        // now just create new user and store them in firebase
        const userData = {
            email,
            password
        };
        dispatch(signup(userData));
    };

    return (
        <>
            <StyledFormWrapper>
                <StyledForm autoComplete="off" onSubmit={onSubmit}>
                    {formStep === 1 && (
                        <section>
                            <StyledLeftBackIcon
                                onClick={() => setFormStep((currStep) => currStep - 1)}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </StyledLeftBackIcon>
                        </section>
                    )}
                    <StyledTitle>Sign-Up</StyledTitle>
                    {formStep === 0 && (
                        <section>
                            <StyledFormDiv>
                                <StyledInput
                                    type="text"
                                    id="university"
                                    placeholder=" "
                                    name="university"
                                    value={university}
                                    onChange={onChange}
                                />
                                <StyledLabel
                                    className="form__label"
                                    htmlFor="university"
                                >
                                    University
                                </StyledLabel>
                            </StyledFormDiv>
                            <StyledButton
                                onClick={() => setFormStep((currStep) => currStep + 1)}
                            >
                                Next
                            </StyledButton>
                        </section>
                    )}
                    {formStep === 1 && (
                        <section>
                            <StyledFormDiv>
                                <StyledInput
                                    type="text"
                                    id="username"
                                    placeholder=" "
                                    name="username"
                                    value={username}
                                    onChange={onChange}
                                />
                                <StyledLabel
                                    className="form__label"
                                    htmlFor="username"
                                >
                                    Username
                                </StyledLabel>
                            </StyledFormDiv>
                            <StyledFormDiv>
                                <StyledInput
                                    type="text"
                                    id="email"
                                    placeholder=" "
                                    name="email"
                                    value={email}
                                    onChange={onChange}
                                />
                                <StyledLabel
                                    className="form__label"
                                    htmlFor="Email"
                                >
                                    Email
                                </StyledLabel>
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
                                <StyledLabel
                                    className="form__label"
                                    htmlFor="password"
                                >
                                    Password
                                </StyledLabel>
                            </StyledFormDiv>
                            <StyledFormDiv>
                                <StyledInput
                                    type="password"
                                    id="confirmPassword"
                                    placeholder=" "
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={onChange}
                                />
                                <StyledLabel
                                    className="form__label"
                                    htmlFor="confirmPassword"
                                >
                                    Confirm Password
                                </StyledLabel>
                            </StyledFormDiv>
                            <StyledButton disabled={isLoading} type="submit">Sign-Up</StyledButton>
                        </section>
                    )}

                    <p className='form__login-para'>Already have an account? </p>
                    <StyledLink to="/login">Login here!</StyledLink>
                </StyledForm>
            </StyledFormWrapper>
        </>
    );
}

export default SignUp;

const StyledLeftBackIcon = styled.svg`
    width: 1.5em;
    cursor: pointer;
    margin-bottom: var(--field-margin);

    &:hover {
        color: var(--secondary-color);
    }
`