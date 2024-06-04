import { Outlet } from 'react-router-dom';
import { Navbar } from './components/navbar'
import  { ThemeProvider  } from 'styled-components';

function App() {
  const theme = {
    colors: {
     orange: '#ff8900',
     blue: '#4b457f',
     gray: '#7b7b7b',
    }
  }
  return (
    <ThemeProvider theme={theme} >
      <Navbar />
      <Outlet />
    </ThemeProvider>
  )
}

export default App
