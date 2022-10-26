import './App.css';
import { Header } from './components/header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './routes/main';
import SeprateWeather from './routes/weather';
import { NotFoundComponent } from './components/not-found';
import { Footer } from './components/footer';
// 1668ec30414f43a5a55121411221310
function App() {
  return (
    <BrowserRouter>
     <div className='App pt-5 md:pd-0 sm:pb-60 padding-top-bottom'>
         {/* Header */}
         <Header />
        <Routes> 
           <Route exact path='/' element={< Main />}></Route>
           <Route exact path='/weather/:name' element={< SeprateWeather />}></Route>
           <Route path='*' exact element={< NotFoundComponent />} ></Route>
         </Routes>
         <Footer />
     </div>
    </BrowserRouter>
    
  );
}

export default App;
