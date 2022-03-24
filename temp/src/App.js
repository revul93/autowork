import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux';
import Login from './pages/Login';
import Home from './pages/Home';
import UserDashBoard from './pages/UserDashboard';
import NewDocument from './pages/NewDocument';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className='container-fluid p-0 h-100'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/home' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/user_dashboard' element={<UserDashBoard />} />
            <Route
              path='/new_document/:workflow_id'
              element={<NewDocument />}
            />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
};

export default App;