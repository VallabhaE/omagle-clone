import './App.css'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import Loading from './components/loading'

function App() {

  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<Loading />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
