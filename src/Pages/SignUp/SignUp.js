import React, { useState } from 'react';
import styled from 'styled-components';
import { StyledButton, StyledForm, StyledFormDiv, StyledFormWrapper, StyledInput, StyledLabel } from '../../components/styled/Login.styled';
import { StyledTitle } from '../../components/styled/StyledTitle';

const StyledLeftBackIcon = styled.svg`
    width: 1.5em;
    cursor: pointer;
    margin-bottom: var(--field-margin);

    &:hover {
        color: var(--secondary-color);
    }
`

function SignUp() {
    const [formStep, setFormStep] = useState(0);

    return (
        <>
            <StyledFormWrapper>
                <StyledForm>
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
                                    id="email"
                                    placeholder=" "
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
                                    id="confirm-password"
                                    placeholder=" "
                                />
                                <StyledLabel
                                    className="form__label"
                                    htmlFor="confirm-password"
                                >
                                    Confirm Password
                                </StyledLabel>
                            </StyledFormDiv>
                            <StyledButton type="submit">Sign-Up</StyledButton>
                        </section>
                    )}
                </StyledForm>
            </StyledFormWrapper>
        </>
    );
}

export default SignUp;