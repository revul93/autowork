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

  const [doneLoading, setDoneLoading] = useState(false);

  const [awaitingDocuments, setAwaitingDocuments] = useState([]);
  const [awaitingDocumentsLoadingError, setAwaitingDocumentsLoadingError] =
    useState('');

  const [allDocuments, setAllDocuments] = useState([]);
  const [allDocumentsLoadingerror, setAllDocumentsLoadingerror] = useState('');

  const [update, setUpdate] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [notes, setNotes] = useState({});
  const [submittingError, setSubmittingError] = useState({});

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
          setAwaitingDocuments(response.data.payload.documents);
        }
      } catch (error) {
        console.error(error);
        setAwaitingDocumentsLoadingError(error.response.data.message);
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
        setAllDocumentsLoadingerror(error.response.data.message);
      } finally {
        setDoneLoading(true);
      }
    };

    getAwaitingDocuments();
    getAllDocuments();

    if (update) {
      setUpdate(false);
      setAwaitingDocumentsLoadingError('');
      setAllDocumentsLoadingerror('');
      getAwaitingDocuments();
      getAllDocuments();
    }
  }, [is_logged_in, navigate, token, renameTitle, update]);

  const handleApprove = async (event, document_id, is_approved) => {
    event.preventDefault();
    if (!is_approved && !notes[document_id]) {
      setSubmittingError((state) => ({
        ...state,
        [document_id]: 'Note must be supplied if document rejected',
      }));
      return;
    }
    try {
      setSubmitting(true);
      const response = await axios.put(
        '/api/user/document/update_approval',
        { document_id, is_approved, note: notes[document_id] },
        { headers: { 'x-auth-token': token } },
      );
      if (response.status === 200) {
        setUpdate(true);
      }
    } catch (error) {
      console.error(error);
      setSubmittingError({ [document_id]: error.response.data.message });
    } finally {
      setSubmitting(false);
      setUpdate(true);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'STARTED':
      case 'PENDING':
      case 'PROCESSING':
        return 'theme.primary';
      case 'REJECTED':
      case 'TERMINATED':
        return 'red';
      case 'APPROVED':
      case 'COMPLETED':
        return 'green';
      default:
        return 'theme.primary';
    }
  };

  return (
    <>
      {doneLoading && (
        <Grid container spacing={2} margin='normal' direction='column'>
          <Grid item>
            <Typography variant='h5' marginTop={3} marginBottom={3}>
              Documents awaiting my approval
            </Typography>
            {(awaitingDocumentsLoadingError && (
              <Alert severity='info' sx={{ width: '100%' }}>
                {awaitingDocumentsLoadingError}
              </Alert>
            )) || (
              <Grid container spacing={2} margin='normal'>
                {awaitingDocuments.map((document) => (
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
                                onClick={(event) =>
                                  handleApprove(event, document.id, true)
                                }
                                disabled={submitting}>
                                Approve
                              </Button>
                              <Button
                                sx={{ m: 1 }}
                                variant='contained'
                                color='error'
                                startIcon={<CancelIcon />}
                                onClick={(event) =>
                                  handleApprove(event, document.id, false)
                                }
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
                                error={submittingError[document.id]?.includes(
                                  'Note',
                                )}
                                value={notes[document.id] || ''}
                                onChange={(event) => {
                                  setSubmittingError((state) => ({
                                    ...state,
                                    [document.id]: '',
                                  }));
                                  setNotes((state) => ({
                                    ...state,
                                    [document.id]: event.target.value,
                                  }));
                                }}
                              />
                            </Grid>
                          </Grid>
                        </CardActions>
                      </Card>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
          <Grid item>
            <Typography variant='h5' marginTop={3} marginBottom={3}>
              My Approvals
            </Typography>
            {(allDocumentsLoadingerror && (
              <Alert severity='info' sx={{ width: '100%' }}>
                {allDocumentsLoadingerror}
              </Alert>
            )) || (
              <Grid container spacing={2} margin={2}>
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
                                  color={getStatusColor(
                                    JSON.parse(document.approvals).find(
                                      (approval) =>
                                        approval.author === employee_id,
                                    ).status,
                                  )}>
                                  {
                                    JSON.parse(document.approvals).find(
                                      (approval) =>
                                        approval.author === employee_id,
                                    ).status
                                  }
                                </Typography>
                                <Typography variant='body2'>
                                  ON:{' '}
                                  {new Date(
                                    JSON.parse(document.approvals).find(
                                      (approval) =>
                                        approval.author === employee_id,
                                    ).date,
                                  ).toLocaleString()}
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
          </Grid>
        </Grid>
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
