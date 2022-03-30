import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';

const Home = (props) => {
  const { employee_name, is_logged_in } = props;
  const navigate = useNavigate();

  useEffect(() => {
    if (is_logged_in) {
      if (employee_name === 'SYSTEM ADMIN') {
        return navigate('/admin/user/get_all');
      }
      return navigate('/user');
    } else {
      return navigate('/login');
    }
  }, [is_logged_in, navigate, employee_name]);

  return null;
};

const mapStateToProps = (state) => ({
  is_logged_in: state.auth.is_logged_in,
  employee_name: state.auth.employee_name,
});

export default connect(mapStateToProps, null)(Home);
