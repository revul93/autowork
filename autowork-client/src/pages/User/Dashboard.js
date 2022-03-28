import { connect } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Navigation from '../../components/Navigation';
import { renameTitle } from '../../redux';
import { useEffect } from 'react';

const Dashboard = (props) => {
  const { is_logged_in, renameTitle } = props;
  const navigate = useNavigate();

  useEffect(() => {
    if (!is_logged_in) {
      navigate('/', { replace: true });
    }

    renameTitle('Dashboard');
  }, [renameTitle, is_logged_in, navigate]);

  return (
    <Box sx={{ display: 'flex' }}>
      <Navigation />
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

const mapDispatchToProps = (dispatch) => ({
  renameTitle: (page_title) => dispatch(renameTitle(page_title)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
