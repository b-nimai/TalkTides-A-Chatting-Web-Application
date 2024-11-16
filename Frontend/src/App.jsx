import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignupPage from './Pages/SignupPage'
import Chatpage from './Pages/Chatpage'
import bg from './assets/bg-2.jpg'
import ChatProvider from './components/Context/ChatProvider';

function App() {
  const backgroundStyle = {
    backgroundImage: `url(${bg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    width: '100%',
    height: '100vh',
  };
  return (
    <div style= {backgroundStyle}>
      <BrowserRouter>
        <ChatProvider>
          <Routes>
            <Route path='/' element= {<SignupPage />}/>
            <Route path='/chat' element= {<Chatpage />}/>
          </Routes>
        </ChatProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
