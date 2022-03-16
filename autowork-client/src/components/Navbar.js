import { connect } from 'react-redux';
import { logout } from '../redux';

import logo from '../images/logo.png';

const Navbar = (props) => {
  const handleLogout = (event) => {
    event.preventDefault();
    props.logout();
  };

  return (
    <nav className='navbar navbar-expand-sm navbar-light bg-light py-0 px-lg-5'>
      <img
        src={logo}
        className='navbar-brand'
        style={{ width: '180px', height: '60px' }}
        alt=''
      />
      <ul
        style={{
          right: '0',
          position: 'absolute',
          overflow: 'hidden',
        }}
        className='navbar-nav h-100 align-items-center '>
        <li className='nav-item nav-link'>{props.employee_name}</li>
        <li className='nav-item h-100 d-flex'>
          <button
            className='btn'
            onMouseEnter={(event) => {
              event.target.classList.toggle('btn-danger');
            }}
            onMouseLeave={(event) => {
              event.target.classList.toggle('btn-danger');
            }}
            onClick={(event) => handleLogout(event)}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

const mapStateToProps = (state) => ({
  employee_name: state.auth.employee_name,
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);