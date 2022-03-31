import { connect } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Navigation from '../../components/Navigation';
import { useEffect } from 'react';

const AdminDashboard = (props) => {
  const { is_logged_in } = props;
  const navigate = useNavigate();

  useEffect(() => {
    if (!is_logged_in) {
      navigate('/', { replace: true });
    }
  }, [is_logged_in, navigate]);

  return (
    <Box sx={{ display: 'flex' }}>
      <Navigation admin={true} />
      <Box
        component='main'
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}>
        <Toolbar />
        <Container sx={{ ml: 0, mt: 2, mb: 2 }}>
          <Grid container spacing={3}>
            <Box sx={{ m: 3, width: 1 }}>
              <Outlet />
            </Box>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

const mapStateToProps = (state) => ({
  is_logged_in: state.auth.is_logged_in,
});

export default connect(mapStateToProps, null)(AdminDashboard);
