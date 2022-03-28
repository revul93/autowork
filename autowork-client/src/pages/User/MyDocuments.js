import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { renameTitle } from '../../redux';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CreateIcon from '@mui/icons-material/Create';

const MyDocuments = (props) => {
  const { is_logged_in, token, renameTitle } = props;
  const navigate = useNavigate();

  const [documents, setDocuments] = useState();
  const [doneLoading, setDoneLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    if (!is_logged_in) {
      return navigate('/');
    }

    renameTitle('My Documents');

    const getDocuments = async () => {
      try {
        const response = await axios.get('/api/user/document/read_all', {
          headers: { 'x-auth-token': token },
        });
        if (response.status === 200) {
          setDocuments(response.data.payload.documents);
        }
      } catch (error) {
        console.error(error);
        setError(error.response.data.message);
      } finally {
        setDoneLoading(true);
      }
    };

    getDocuments();
  }, [is_logged_in, navigate, setDocuments, token, renameTitle]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'STARTED' || 'PENDING' || 'PROCESSING':
        return 'theme.primary';
      case 'REJECTED' || 'TERMINATED':
        return 'red';
      case 'APPROVED':
        return 'green';
      default:
        return 'theme.primary';
    }
  };

  return (
    <>
      <Button
        size='large'
        variant='contained'
        startIcon={<CreateIcon />}
        sx={{ mb: 3 }}
        onClick={() => navigate('/user/document/create')}>
        Create New Document
      </Button>
      {doneLoading && (
        <>
          {(error && (
            <Alert severity='info' sx={{ width: '100%' }}>
              {error}
            </Alert>
          )) || (
            <Grid container spacing={2}>
              {documents.map((document) => (
                <Grid item xs={12} key={document.id}>
                  <Paper elevation={3}>
                    <Card>
                      <CardActionArea
                        onClick={() =>
                          navigate(`/user/document/get_one/${document.id}`)
                        }>
                        <CardContent>
                          <Grid container direction='row'>
                            <Grid item xs={10} pl={3}>
                              <Grid container direction='column'>
                                <Grid item>
                                  <Typography variant='h5'>
                                    {document.Workflow.name}
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <Typography
                                    variant='body2'
                                    color='text.secondary'>
                                    Created:{' '}
                                    {new Date(
                                      document.created_at,
                                    ).toLocaleString()}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid xs={2} item alignSelf='center'>
                              <Typography
                                color={getStatusColor(document.status)}>
                                {document.status.toUpperCase()}
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  is_logged_in: state.auth.is_logged_in,
  token: state.auth.token,
});

const mapDispatchToProps = (dispatch) => ({
  renameTitle: (page_title) => dispatch(renameTitle(page_title)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyDocuments);
