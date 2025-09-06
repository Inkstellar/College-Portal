import { useState } from 'react'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import './App.css'
import { Card } from './components/display';
import { Registration } from './components/forms';

function App() {
  const [count, setCount] = useState(0)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <>
       Remote App Running Standalone
       <Registration/>
      </>
    </ThemeProvider>
  )
}

export default App
