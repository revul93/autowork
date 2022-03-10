import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
const Home = (props) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!props.logged_in) {
      navigate('/login', { replace: true });
    }
  });
  return <p>You are logged in</p>;
};

export default Home;
