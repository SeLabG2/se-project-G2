import Login from './Pages/Login/Login';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './Pages/SignUp/SignUp';

const theme = {

}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
