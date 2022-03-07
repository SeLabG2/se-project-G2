import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Acme&family=Bebas+Neue&display=swap');

    :root {
        --font-base: 'Acme', sans-serif;
        font-family: var(--font-base);

        --normal-font-size: 1rem;
        --small-font-size: 0.75rem;
        --fw-bold: 700;
        --fw-highlight: 500;

        --field-margin: 2.5em;
        --input-field-size: 2.5em;
        
        --primary-color: #F4F4F4;
        --secondary-color: #1A73E8;
        --dark-secondary-color: #1243EB;
        --input-color: #80868B;
        --black-color: #0D1821;
        --lightGray-color: #D3D3D3;
        --gray-color: #E4E5EA;
        --white-color: #FFFFFF;
    }

    *,::before,::after {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        caret-color: rgba(0,0,0,0);
    }

    body {
        background-color: var(--primary-color);
    }

    input:focus, textarea:focus {
        caret-color: rgba(0,0,0,1);
    }
`

export default GlobalStyles;