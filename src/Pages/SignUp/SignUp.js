import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { StyledButton, StyledForm, StyledFormDiv, StyledFormWrapper, StyledInput, StyledLabel, StyledLink } from '../../components/styled/Login.styled';
import { StyledTitle } from '../../components/styled/StyledTitle';
import { reset, selectUser, selectUserStatus, signup } from '../../features/user/userSlice';
import { getAllDocsFrom, getColRef } from '../../firebase/firebase-firestore';


function SignUp() {
    const [allUniList, setAllUniList] = useState([]);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        university: '',
        role: ''
    });
    const { username, email, password, confirmPassword, university, role } = formData;
    const [formStep, setFormStep] = useState(0);
    const [isValidationComplete, setIsValidationComplete] = useState(false);

    const user = useSelector(selectUser);
    const { isLoading, isError, isSuccess, message } = useSelector(selectUserStatus);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        // gets all universities from database
        const getAllUniversities = async () => {
            try {
                const universityColRef = getColRef('universities');
                const allUniversities = await getAllDocsFrom(universityColRef);
                setAllUniList([...allUniversities]);
            } catch (error) {
                console.log(error.message);
            }
        };

        getAllUniversities();
    }, []);

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

        if (isSuccess) {
            navigate('/');
        }

        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);


    useEffect(() => {
        if (isValidationComplete) {
            // get id of university
            const univ = allUniList.filter((uni) => university === uni.name);
            const userData = {
                uni_id: univ[0].id,
                role,
                username,
                email,
                password
            };
            dispatch(signup(userData));
        }
    }, [isValidationComplete]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };


    const onClickOfNextButton = () => {

    };

    const onSubmit = async (e) => {
        e.preventDefault();
        // validate the form here


        // now just create new user and store them in firebase
        setIsValidationComplete(true);
    };

    return (
        <>
            <StyledFormWrapper>
                <StyledForm autoComplete="off" onSubmit={onSubmit}>
                    {formStep > 0 && (
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
                                onClick={() =>
                                    setFormStep((currStep) => currStep + 1)
                                }

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
                                    id="role"
                                    placeholder=" "
                                    name="role"
                                    value={role}
                                    onChange={onChange}
                                />
                                <StyledLabel
                                    className="form__label"
                                    htmlFor="role"
                                >
                                    Role
                                </StyledLabel>
                            </StyledFormDiv>
                            <StyledButton
                                onClick={() => setFormStep((currStep) => currStep + 1)}
                            >
                                Next
                            </StyledButton>
                        </section>
                    )}
                    {formStep === 2 && (
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