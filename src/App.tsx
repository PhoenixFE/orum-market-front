import { Outlet } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import { Container } from '@mui/material';

function App() {
  return (
    <Container>
      <Header />
      <Outlet />
    </Container>
  );
}

export default App;
