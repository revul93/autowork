import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';

import { renameTitle } from '../../redux';

const CreateDocument = (props) => {
  const { is_logged_in, token, renameTitle } = props;
  const navigate = useNavigate();

  const [workflows, setWorkflows] = useState();
  const [workflow, setWorkflow] = useState();
  const [selectedWorkflowId, setSelectedWorkflowId] = useState('');
  const [doneLoading, setDoneLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [doneWorkflowLoading, setDoneWorkflowLoading] = useState(false);
  const [workflowError, setWorkflowError] = useState();
  const [formData, setFormData] = useState({});
  const [formError, setFormError] = useState('');
  const [done, setDone] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!is_logged_in) {
      return navigate('/');
    }
    renameTitle('Create Document');
    if (done) {
      setMessage('Document submitted successfully');
      setInterval(() => {
        return navigate('/user/document/get_all');
      }, 1000);
    }

    const getWorkflows = async () => {
      try {
        const response = await axios.get(
          '/api/user/workflow/read_all_of_auth_user',
          { headers: { 'x-auth-token': token } },
        );
        if (response.status === 200) {
          setWorkflows(response.data.payload.workflows);
        }
      } catch (error) {
        console.error(error);
        setError(error.response.data.message);
      } finally {
        setDoneLoading(true);
      }
    };

    getWorkflows();
  }, [is_logged_in, navigate, renameTitle, setWorkflows, token, done]);

  const handleWorkflowChange = async (event) => {
    setSelectedWorkflowId(event.target.value);
    setWorkflowError('');
    setDoneWorkflowLoading(false);
    setFormData({});
    try {
      const response = await axios.get(
        `/api/user/workflow/read_one_by_id?workflow_id=${event.target.value}`,
        { headers: { 'x-auth-token': token } },
      );
      if (response.status === 200) {
        setWorkflow(response.data.payload.workflow);
      }
    } catch (error) {
      console.error(error);
      setWorkflowError(error.response.data.message);
    } finally {
      setDoneWorkflowLoading(true);
    }
  };

  const handleCreateForm = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    if (formError) {
      setSubmitting(false);
      return;
    }
    try {
      const response = await axios.post(
        '/api/user/document/create_or_update',
        JSON.stringify({
          workflow_id: workflow.id,
          workflow_transaction_id: workflow.workflow_transactions[0].id,
          data_values: Object.keys(formData).map((data) => ({
            name: data,
            value: formData[data],
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
        setDone(true);
      }
    } catch (error) {
      console.error(error);
      setFormError(error.response.data.message);
    } finally {
      setSubmitting(false);
    }
  };

  const DATAFIELDTYPES = {
    TEXTAREA: 'textarea',
    TEXT: 'text',
    NUMBER: 'number',
    DATE: 'date',
    CHECKBOX: 'checkbox',
    RADIO: 'radio',
    DROPDOWN: 'dropdown',
  };

  return (
    <>
      {doneLoading &&
        ((error && (
          <Alert severity='error' sx={{ width: '100%' }}>
            {error}
          </Alert>
        )) || (
          <Box
            component='form'
            noValidate
            onSubmit={handleCreateForm}
            sx={{ m: 2, width: 1 }}>
            <FormControl margin='normal' sx={{ minWidth: 350 }}>
              <InputLabel id='workflowSelect'>Workflow</InputLabel>
              <Select
                labelId='workflowSelect'
                id='workflowSelect'
                value={selectedWorkflowId}
                label='Workflow'
                onChange={handleWorkflowChange}>
                {workflows.map((workflow) => (
                  <MenuItem value={workflow.id} key={workflow.id}>
                    {workflow.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Select a workflow of the document</FormHelperText>
            </FormControl>
            {doneWorkflowLoading &&
              ((workflowError && (
                <Alert severity='error' sx={{ width: '100%' }}>
                  {workflowError}
                </Alert>
              )) ||
                (workflow && (
                  <>
                    {workflow.workflow_transactions[0].workflow_transaction_data.map(
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
                                  datafield.type === DATAFIELDTYPES.TEXTAREA
                                }
                                rows={
                                  datafield.type === DATAFIELDTYPES.TEXTAREA
                                    ? 9
                                    : null
                                }
                                error={
                                  submitting &&
                                  datafield.required &&
                                  !formData[datafield.name]
                                    ? true
                                    : datafield.type !== DATAFIELDTYPES.DATE &&
                                      datafield.max_length >
                                        formData[datafield.name]?.length
                                    ? true
                                    : datafield.type ===
                                        DATAFIELDTYPES.NUMBER &&
                                      datafield.min &&
                                      datafield.min < formData[datafield.name]
                                    ? true
                                    : datafield.type ===
                                        DATAFIELDTYPES.NUMBER &&
                                      datafield.max &&
                                      datafield.max > formData[datafield.name]
                                    ? true
                                    : false
                                }
                                onError={() => setFormError(true)}
                                helperText={`Requird field. ${
                                  datafield.type !== DATAFIELDTYPES.DATE
                                    ? `Maximum length is ${datafield.max_chars}.`
                                    : datafield.type ===
                                        DATAFIELDTYPES.NUMBER && datafield.min
                                    ? `Minimum value is ${datafield.min}`
                                    : datafield.type ===
                                        DATAFIELDTYPES.NUMBER && datafield.max
                                    ? `Maximum value is ${datafield.max}`
                                    : ``
                                }`}
                                aria-label={datafield.label}
                                margin='normal'
                                fullWidth={
                                  datafield.type !== DATAFIELDTYPES.DATE
                                }
                                id={datafield.id}
                                label={datafield.label}
                                name={datafield.name}
                                InputLabelProps={{ shrink: true }}
                                value={formData[datafield.name] || ''}
                                style={{ minWidth: 300 }}
                                onChange={(event) => {
                                  setFormError(false);
                                  setFormData((state) => ({
                                    ...state,
                                    [datafield.name]: event.target.value,
                                  }));
                                }}
                              />
                            );
                          case DATAFIELDTYPES.DROPDOWN:
                          case DATAFIELDTYPES.RADIO:
                          case DATAFIELDTYPES.CHECKBOX:
                          default:
                            return <></>;
                        }
                      },
                    )}
                    <Button
                      fullWidth
                      type='submit'
                      variant='contained'
                      sx={{ mt: 3, mb: 2, maxWidth: 300, display: 'block' }}
                      disabled={submitting}>
                      Submit
                    </Button>
                  </>
                )))}
            <Snackbar
              open={formError ? true : false}
              autoHideDuration={6000}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              onClose={() => setFormError('')}>
              <Alert
                onClose={() => setFormError('')}
                severity='error'
                sx={{ width: '100%' }}>
                {formError}
              </Alert>
            </Snackbar>
            <Snackbar
              open={message ? true : false}
              autoHideDuration={6000}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              onClose={() => {
                setMessage('');
              }}>
              <Alert
                onClose={() => {
                  setMessage('');
                }}
                severity='success'
                sx={{ width: '100%' }}>
                {message}
              </Alert>
            </Snackbar>
          </Box>
        ))}
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateDocument);
