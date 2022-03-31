import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import UserDashboard from './pages/User/Dashboard';
import MyDocuments from './pages/User/MyDocuments';
import CreateDocument from './pages/User/CreateDocument';
import MyApprovals from './pages/User/MyApprovals';
import MyTasks from './pages/User/MyTasks';
import AdminLogin from './pages/Login/AdminLogin';
import AdminDashboard from './pages/Admin/Dashboard';
import ManageUsers from './pages/Admin/ManageUsers';
import ManageDivisions from './pages/Admin/ManageDivisions';
import ManageRoles from './pages/Admin/ManageRoles';
import Document from './pages/User/Document';

import { store } from './redux';

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/logout' element={<Logout />} />
        <Route path='/admin_login' element={<AdminLogin />} />
        <Route path='/admin' element={<AdminDashboard />}>
          <Route path='user/get_all' element={<ManageUsers />} />
          <Route path='role/get_all' element={<ManageRoles />} />
          <Route path='division/get_all' element={<ManageDivisions />} />
          <Route path='group/get_all' element={<>Manage Groups</>} />
          <Route path='workflow/get_all' element={<>Manage Workflows</>} />
        </Route>
        <Route path='/user' element={<UserDashboard />}>
          <Route path='document/get_all' element={<MyDocuments />} />
          <Route path='document/create' element={<CreateDocument />} />
          <Route path='document/get_one/:document_id' element={<Document />} />
          <Route path='task/get_all' element={<MyTasks />} />
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
