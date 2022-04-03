import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { StyledButton, StyledForm, StyledFormDiv, StyledFormWrapper, StyledInput, StyledLabel, StyledLink } from '../../components/styled/Login.styled';
import { StyledTitle } from '../../components/styled/StyledTitle';
import { login, reset, selectUser, selectUserStatus } from '../../features/user/userSlice';


function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const user = useSelector(selectUser);
    const { isLoading, isError, isSuccess, message } = useSelector(selectUserStatus);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formErrors, setFormErrors] = useState({});

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

    const onChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value.trim(),
        }));
    };

    const validate = (formData) => {
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        // setFormErrors(validate(formData));

        dispatch(login(formData));
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