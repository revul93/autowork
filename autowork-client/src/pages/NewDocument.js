import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import Navbar from '../components/Navbar';
import WorkflowForm from '../components/WorkflowForm';
const GET_WORKFLOW_BY_ID = '/api/user/workflow/get_one_by_id';

const NewDocument = (props) => {
  const { workflow_id } = useParams();
  const [state, setState] = useState({
    workflow: null,
    loading: true,
    errorMessage: '',
  });

  useEffect(() => {
    const get_workflow = async () => {
      try {
        const response = await axios.get(
          `${GET_WORKFLOW_BY_ID}?workflow_id=${workflow_id}`,
          {
            headers: {
              'x-auth-token': props.token,
            },
          },
        );

        if (response.status === 404 || response.status === 401) {
          setState((state) => ({
            ...state,
            errorMessage: response.data.message,
          }));
        }

        if (response.status === 200) {
          setState((state) => ({
            ...state,
            workflow: response.data.payload.workflow,
          }));
        }
      } catch (error) {
        console.error(error.response.data.message);
        setState((state) => ({
          ...state,
          errorMessage: error.response.data.message,
        }));
      } finally {
        setState((state) => ({
          ...state,
          loading: false,
        }));
      }
    };

    get_workflow();
    setState((state) => ({ ...state, loading: false }));
  }, [workflow_id, props.token]);
  return (
    <>
      <Navbar />
      <div>
        {state.loading && <h1>Loading...</h1>}
        {state.workflow && (
          <div>
            <h2>{state.workflow.name}</h2>
            <p>{state.workflow.description}</p>
            <WorkflowForm
              data={
                state.workflow.workflow_transactions[0]
                  .workflow_transaction_data
              }
            />
          </div>
        )}
      </div>
    </>
  );
};

const mapPropsToState = (state) => ({
  token: state.auth.token,
});

export default connect(mapPropsToState, null)(NewDocument);
