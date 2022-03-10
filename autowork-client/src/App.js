import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux';
import Login from './pages/Login';
import Home from './pages/Home';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className='container-fluid h-100'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/home' element={<Home />} />
            <Route path='/login' element={<Login />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
