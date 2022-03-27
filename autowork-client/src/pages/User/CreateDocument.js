import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { renameTitle } from '../../redux';

const CreateDocument = (props) => {
  const { is_logged_in, token, renameTitle } = props;
  const navigate = useNavigate();
  renameTitle('Create Document');

  if (!is_logged_in) {
    navigate('/', { replace: true });
  }

  const [workflows, setWorkflows] = useState();
  const [workflow, setWorkflow] = useState();
  const [selectedWorkflowId, setSelectedWorkflowId] = useState('');
  const [doneLoading, setDoneLoading] = useState(false);
  const [error, setError] = useState();
  const [doneWorkflowLoading, setDoneWorkflowLoading] = useState(false);
  const [workflowError, setWorkflowError] = useState();

  useEffect(() => {
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
  }, [setWorkflows, token]);

  const handleWorkflowChange = async (event) => {
    setSelectedWorkflowId(event.target.value);
    setWorkflowError('');
    setDoneWorkflowLoading(false);
    try {
      const response = await axios.get(
        `/api/user/workflow/read_one_by_id?workflow_id=${event.target.value}`,
        { headers: { 'x-auth-token': token } },
      );
      if (response.status === 200) {
        setWorkflow(response.data.payload.workflow);
        console.log(workflow);
      }
    } catch (error) {
      console.error(error);
      setWorkflowError(error.response.data.message);
    } finally {
      setDoneWorkflowLoading(true);
    }
  };

  return (
    <>
      {doneLoading &&
        ((error && (
          <Alert severity='error' sx={{ width: '100%' }}>
            {error}
          </Alert>
        )) || (
          <Box component='form' noValidate>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
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
                (workflow &&
                  workflow.workflow_transactions[0].workflow_transaction_data.map(
                    (datafield) => (
                      <FormControl key={datafield.id}>
                        {datafield.name}
                      </FormControl>
                    ),
                  )))}
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
