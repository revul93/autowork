import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';

const Home = (props) => {
  const { is_logged_in } = props;
  const navigate = useNavigate();

  useEffect(() => {
    if (is_logged_in) {
      return navigate('/user');
    } else {
      return navigate('/login');
    }
  }, [is_logged_in, navigate]);

  return null;
};

const mapStateToProps = (state) => ({
  is_logged_in: state.auth.is_logged_in,
});

export default connect(mapStateToProps, null)(Home);
