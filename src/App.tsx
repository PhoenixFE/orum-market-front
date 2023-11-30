import { Outlet } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import { Container } from '@mui/material';
import { BreadcrumbsNavBar } from './components/BreadcrumbsNavBar';

function App() {
  return (
    <Container>
      <Header />
      <BreadcrumbsNavBar />
      <Outlet />
    </Container>
  );
}

export default App;
