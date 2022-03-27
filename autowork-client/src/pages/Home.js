import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { connect } from 'react-redux';

const Home = (props) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!props.is_logged_in) {
      navigate('/login', { replace: true });
    } else {
      navigate('/user', { replace: true });
    }
  }, [props.is_logged_in, navigate]);
  return <></>;
};

const mapStateToProps = (state) => ({
  is_logged_in: state.auth.is_logged_in,
});

export default connect(mapStateToProps, null)(Home);
