import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import UserDashboard from './pages/User/Dashboard';
import MyDocuments from './pages/User/MyDocuments';
import CreateDocument from './pages/User/CreateDocument';
import MyApprovals from './pages/User/MyApprovals';
import { store } from './redux';

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/logout' element={<Logout />} />
        <Route path='/admin_login' element={<>Admin Login</>} />
        <Route path='/user' element={<UserDashboard />}>
          <Route path='document/get_all' element={<MyDocuments />} />
          <Route path='document/create' element={<CreateDocument />} />
          <Route path='document/get_one/:document_id' element={<>Document</>} />
          <Route path='task/get_all' element={<>All Tasks</>} />
          <Route path='approval/get_all' element={<MyApprovals />} />
          <Route path='reset_password' element={<>Reset Password*</>} />
        </Route>
        <Route path='/help' element={<>Help</>} />
        <Route path='/logout' element={<>Logout</>} />
        <Route path='*' element={<>Not found</>} />
      </Routes>
    </BrowserRouter>
  </Provider>
);

export default App;
