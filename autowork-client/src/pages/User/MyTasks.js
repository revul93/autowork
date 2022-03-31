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
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';

const MyTasks = (props) => {
  const { is_logged_in, token, renameTitle } = props;
  const navigate = useNavigate();

  const [doneLoading, setDoneLoading] = useState(false);
  const [awaitingDocuments, setAwaitingDocuments] = useState([]);
  const [awaitingDocumentsLoadingError, setAwaitingDocumentsLoadingError] =
    useState('');
  const [allDocuments, setAllDocuments] = useState([]);
  const [allDocumentsLoadingerror, setAllDocumentsLoadingerror] = useState('');
  const [update, setUpdate] = useState(false);
  const [documentValues, setDocumentValues] = useState({});
  const [documentValueErrors, setDocumentValueErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submittingError, setSubmittingError] = useState({});
  const [DATAFIELDTYPES] = useState({
    TEXTAREA: 'textarea',
    TEXT: 'text',
    NUMBER: 'number',
    DATE: 'date',
    CHECKBOX: 'checkbox',
    RADIO: 'radio',
    DROPDOWN: 'dropdown',
  });

  useEffect(() => {
    renameTitle('My Tasks');
    if (!is_logged_in) {
      return navigate('/');
    }

    const getAwaitingDocuments = async () => {
      setDoneLoading(false);
      try {
        const response = await axios.get(
          '/api/user/document/read_awaiting_actions_from_auth_user',
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
          '/api/user/document/read_all_actions_of_auth_user',
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

  const handleSubmit = async (
    event,
    document_id,
    workflow_id,
    workflow_transaction_id,
  ) => {
    event.preventDefault();
    console.log(documentValueErrors[document_id]);
    console.log(documentValues[document_id]);
    if (
      Object.keys(documentValueErrors[document_id])?.some(
        (key) => documentValueErrors[document_id][key],
      )
    ) {
      setSubmittingError((state) => ({
        ...state,
        [document_id]: 'Error in required fields',
      }));
      return false;
    }

    try {
      setSubmitting(true);
      const response = await axios.post(
        '/api/user/document/create_or_update',
        JSON.stringify({
          workflow_id,
          workflow_transaction_id,
          document_id,
          data_values: Object.keys(documentValues[document_id]).map((data) => ({
            name: data,
            value: documentValues[document_id][data],
          })),
        }),
        {
          headers: {
            'x-auth-token': token,
            'Content-Type': 'application/json',
          },
        },
      );
      if (response.status === 200) {
        setUpdate(true);
      }
    } catch (error) {
      setSubmittingError((state) => ({
        ...state,
        [document_id]: error.response.data.message,
      }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {doneLoading && (
        <Grid container spacing={2} margin='normal' direction='column'>
          <Grid item>
            <Typography variant='h5' margin={'normal'}>
              Documents awaiting my action
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
                            direction: 'row',
                          }}>
                          <Grid
                            container
                            spacing={1}
                            direction={'column'}
                            alignItems={'center'}>
                            <Grid item>
                              {document.workflow_transaction_data.map(
                                (datafield) => {
                                  switch (datafield.type) {
                                    case DATAFIELDTYPES.TEXTAREA:
                                    case DATAFIELDTYPES.TEXT:
                                    case DATAFIELDTYPES.NUMBER:
                                    case DATAFIELDTYPES.DATE:
                                      return (
                                        <TextField
                                          type={datafield.type}
                                          key={datafield.id}
                                          multiline={
                                            datafield.type ===
                                            DATAFIELDTYPES.TEXTAREA
                                          }
                                          rows={
                                            datafield.type ===
                                            DATAFIELDTYPES.TEXTAREA
                                              ? 9
                                              : null
                                          }
                                          error={
                                            submitting &&
                                            datafield.required &&
                                            !documentValues[document.id]?.[
                                              datafield.name
                                            ]
                                              ? true
                                              : datafield.type !==
                                                  DATAFIELDTYPES.DATE &&
                                                datafield.max_length >
                                                  documentValues[document.id]?.[
                                                    datafield.name
                                                  ]?.length
                                              ? true
                                              : datafield.type ===
                                                  DATAFIELDTYPES.NUMBER &&
                                                datafield.min &&
                                                datafield.min <
                                                  documentValues[document.id]?.[
                                                    datafield.name
                                                  ]
                                              ? true
                                              : datafield.type ===
                                                  DATAFIELDTYPES.NUMBER &&
                                                datafield.max &&
                                                datafield.max >
                                                  documentValues[document.id]?.[
                                                    datafield.name
                                                  ]
                                              ? true
                                              : false
                                          }
                                          onError={() =>
                                            setDocumentValueErrors((state) => ({
                                              ...state,
                                              [document.id]: {
                                                ...state[document.id],
                                                [datafield.name]: true,
                                              },
                                            }))
                                          }
                                          helperText={`Requird field. ${
                                            datafield.type !==
                                            DATAFIELDTYPES.DATE
                                              ? `Maximum length is ${datafield.max_chars}.`
                                              : datafield.type ===
                                                  DATAFIELDTYPES.NUMBER &&
                                                datafield.min
                                              ? `Minimum value is ${datafield.min}`
                                              : datafield.type ===
                                                  DATAFIELDTYPES.NUMBER &&
                                                datafield.max
                                              ? `Maximum value is ${datafield.max}`
                                              : ``
                                          }`}
                                          aria-label={datafield.label}
                                          margin='normal'
                                          fullWidth={
                                            datafield.type !==
                                            DATAFIELDTYPES.DATE
                                          }
                                          id={datafield.id}
                                          label={datafield.label}
                                          name={datafield.name}
                                          InputLabelProps={{ shrink: true }}
                                          value={
                                            documentValues[document.id]?.[
                                              datafield.name
                                            ] || ''
                                          }
                                          style={{ minWidth: 300 }}
                                          onChange={(event) => {
                                            setDocumentValueErrors((state) => ({
                                              ...state,
                                              [document.id]: {
                                                ...state[document.id],
                                                [datafield.name]: false,
                                              },
                                            }));
                                            setDocumentValues((state) => ({
                                              ...state,
                                              [document.id]: {
                                                ...state[document.id],
                                                [datafield.name]:
                                                  event.target.value,
                                              },
                                            }));
                                          }}
                                        />
                                      );
                                    case DATAFIELDTYPES.DROPDOWN:
                                    case DATAFIELDTYPES.RADIO:
                                    case DATAFIELDTYPES.CHECKBOX:
                                      return (
                                        <FormGroup key={datafield.id}>
                                          <FormControlLabel
                                            control={
                                              <Checkbox
                                                error={
                                                  submitting &&
                                                  datafield.required &&
                                                  !documentValues[
                                                    document.id
                                                  ]?.[datafield.name]
                                                    ? 'Required field'
                                                    : undefined
                                                }
                                                onError={() =>
                                                  setDocumentValueErrors(
                                                    (state) => ({
                                                      ...state,
                                                      [document.id]: {
                                                        ...state[document.id],
                                                        [datafield.name]: true,
                                                      },
                                                    }),
                                                  )
                                                }
                                                checked={
                                                  documentValues[document.id]?.[
                                                    datafield.name
                                                  ]
                                                    ? true
                                                    : false
                                                }
                                                onChange={() => {
                                                  setDocumentValueErrors(
                                                    (state) => ({
                                                      ...state,
                                                      [document.id]: {
                                                        ...state[document.id],
                                                        [datafield.name]: false,
                                                      },
                                                    }),
                                                  );
                                                  setDocumentValues(
                                                    (state) => ({
                                                      ...state,
                                                      [document.id]: {
                                                        ...state[document.id],
                                                        [datafield.name]: true,
                                                      },
                                                    }),
                                                  );
                                                }}
                                              />
                                            }
                                            label={datafield.label}
                                          />
                                        </FormGroup>
                                      );
                                    default:
                                      return <></>;
                                  }
                                },
                              )}
                            </Grid>
                            <Grid item>
                              <Button
                                sx={{ m: 1 }}
                                variant='contained'
                                color='success'
                                onClick={(event) =>
                                  handleSubmit(
                                    event,
                                    document.id,
                                    document.Workflow.id,
                                    document.workflow_transaction.id,
                                  )
                                }
                                disabled={submitting}>
                                Submit
                              </Button>
                            </Grid>
                          </Grid>
                        </CardActions>
                      </Card>
                      {submittingError[document.id] && (
                        <Alert severity='error' color='error'>
                          {submittingError[document.id]}
                        </Alert>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
          <Grid item>
            <Typography variant='h5' margin={'normal'}>
              My Previous actions
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
                                    document.document_transaction.status,
                                  )}>
                                  {document.document_transaction.status}
                                </Typography>
                                <Typography variant='body2'>
                                  ON: {document.document_transaction.created_at}
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

export default connect(mapStateToProps, mapDispatchToProps)(MyTasks);
