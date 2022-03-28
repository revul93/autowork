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
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { TextField } from '@mui/material';

const MyApprovals = (props) => {
  const { is_logged_in, token, renameTitle, employee_id } = props;
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [allDocuments, setAllDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState();
  const [submitting, setSubmitting] = useState(false);
  const [approved, setApproved] = useState(null);
  const [notes, setNotes] = useState({});
  const [doneLoading, setDoneLoading] = useState(false);
  const [submittingError, setSubmittingError] = useState('');
  const [error, setError] = useState();
  const [done, setDone] = useState();

  useEffect(() => {
    renameTitle('My Approvals');
    if (!is_logged_in) {
      return navigate('/');
    }

    const getAwaitingDocuments = async () => {
      setDoneLoading(false);
      try {
        const response = await axios.get(
          '/api/user/document/read_awaiting_approvals_from_auth_user',
          {
            headers: { 'x-auth-token': token },
          },
        );
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

    const getAllDocuments = async () => {
      setDoneLoading(false);
      try {
        const response = await axios.get(
          '/api/user/document/read_all_approvals_of_auth_user',
          {
            headers: { 'x-auth-token': token },
          },
        );
        if (response.status === 200) {
          setAllDocuments(response.data.payload.documents);
        }
      } catch (error) {
        console.error(error);
        setError(error.response.data.message);
      } finally {
        setDoneLoading(true);
      }
    };

    if (done) {
      navigate('/user/approval/get_all');
    }
    getAwaitingDocuments();
    getAllDocuments();

    const update_approval = async () => {
      try {
        const response = await axios.put(
          '/api/user/document/update_approval',
          {
            document_id: selectedDocument.id,
            is_approved: approved,
          },
          {
            headers: {
              'x-auth-token': token,
            },
          },
        );
        if (response.status === 200) {
          setDone(true);
        }
      } catch (error) {
        console.error(error);
        setError(error.response.data.message);
      } finally {
        setApproved(null);
        setSubmitting(false);
      }

      return;
    };

    if (!submittingError && submitting) {
      update_approval(approved);
    }
  }, [
    is_logged_in,
    navigate,
    setDocuments,
    token,
    renameTitle,
    done,
    selectedDocument,
    submittingError,
    submitting,
    approved,
  ]);

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
      {doneLoading && (
        <>
          <Typography variant='h5' margin={'normal'}>
            Documents Awaiting Approvals
          </Typography>
          {(error && (
            <Alert severity='info' sx={{ width: '100%' }}>
              {error}
            </Alert>
          )) || (
            <>
              {submittingError && (
                <Alert severity='error' sx={{ width: '100%' }}>
                  {submittingError}
                </Alert>
              )}
              <Grid container spacing={2} margin='normal'>
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
                                      {`Created by: ${
                                        document.Employee.name
                                      } | ${
                                        document.Employee.staff_id
                                      } , at: ${new Date(
                                        document.created_at,
                                      ).toLocaleString()}`}
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
                        {(document.status === 'STARTED' ||
                          document.status === 'PENDING') && (
                          <CardActions
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              margin: 'auto',
                            }}>
                            <Grid
                              container
                              direction='column'
                              spacing={1}
                              mb={2}
                              alignItems={'center'}>
                              <Grid item>
                                <Button
                                  sx={{ m: 1 }}
                                  variant='contained'
                                  color='success'
                                  startIcon={<CheckCircleIcon />}
                                  onClick={() => {
                                    setSubmittingError('');
                                    setSubmitting(true);
                                    setApproved(true);
                                    setSelectedDocument(document);
                                  }}
                                  disabled={submitting}>
                                  Approve
                                </Button>
                                <Button
                                  sx={{ m: 1 }}
                                  variant='contained'
                                  color='error'
                                  startIcon={<CancelIcon />}
                                  onClick={() => {
                                    if (!notes[document.id]) {
                                      setSubmittingError('Note must be filled');
                                    } else {
                                      setSubmitting(true);
                                      setApproved(false);
                                      setSelectedDocument(document);
                                    }
                                  }}
                                  disabled={submitting}>
                                  Reject
                                </Button>
                              </Grid>
                              <Grid item width={3 / 4}>
                                <TextField
                                  label='Note'
                                  style={{
                                    display: 'block',
                                  }}
                                  fullWidth
                                  error={submittingError.includes('Note')}
                                  value={notes[document.id] || ''}
                                  onChange={(event) => {
                                    setSubmittingError('');
                                    setNotes((state) => ({
                                      ...state,
                                      [document.id]: event.target.value,
                                    }));
                                  }}
                                />
                              </Grid>
                            </Grid>
                          </CardActions>
                        )}
                      </Card>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
          <Grid container spacing={2} margin={2}>
            <Typography variant='h5'>My Approvals</Typography>
            {allDocuments.map((document) => (
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
                                  {`Created by: ${document.Employee.name} | ${
                                    document.Employee.staff_id
                                  } , at: ${new Date(
                                    document.created_at,
                                  ).toLocaleString()}`}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid xs={2} item alignSelf='center'>
                            <Typography
                              color={getStatusColor(
                                JSON.parse(document.approvals).find(
                                  (approval) => approval.author === employee_id,
                                ).status,
                              )}>
                              {
                                JSON.parse(document.approvals).find(
                                  (approval) => approval.author === employee_id,
                                ).status
                              }
                            </Typography>
                            <Typography variant='body2'>
                              ON:{' '}
                              {
                                JSON.parse(document.approvals).find(
                                  (approval) => approval.author === employee_id,
                                ).date
                              }
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
        </>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  is_logged_in: state.auth.is_logged_in,
  employee_id: state.auth.employee_id,
  token: state.auth.token,
});

const mapDispatchToProps = (dispatch) => ({
  renameTitle: (page_title) => dispatch(renameTitle(page_title)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyApprovals);
