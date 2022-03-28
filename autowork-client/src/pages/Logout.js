import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux';

const Logout = (props) => {
  const { logout } = props;
  const navigate = useNavigate();
  useEffect(() => {
    logout();
    return navigate('/');
  }, [logout, navigate]);

  return null;
};

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout()),
});

export default connect(null, mapDispatchToProps)(Logout);
