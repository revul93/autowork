import axios from 'axios';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
const GET_WORKFLOW_OF_EMPLOYEE = '/api/user/workflow/read_all_of_auth_user';

const StartDocument = (props) => {
  const [state, setState] = useState({
    errorMessage: '',
    loading: true,
    workflows_of_employee: [],
  });
  useEffect(() => {
    const get_workflow_of_employee = async () => {
      try {
        const response = await axios.get(GET_WORKFLOW_OF_EMPLOYEE, {
          headers: { 'x-auth-token': props.token },
        });
        if (response.status === 404) {
          setState((state) => ({
            ...state,
            errorMessage: response.data.message,
          }));
        }
        if (response.status === 200) {
          setState((state) => ({
            ...state,
            workflows_of_employee: response.data.workflows_of_employee,
          }));
        }
      } catch (error) {
        console.error(error.response.data.message);
        setState((state) => ({
          ...state,
          errorMessage: error.response.data.message,
        }));
      }
    };

    get_workflow_of_employee();
    setState((state) => ({ ...state, loading: false }));
  }, [props.token]);
  return (
    <div className='container mt-4'>
      {!state.loading &&
        state.workflows_of_employee.map((workflow) => (
          <div key={workflow.id}>
            <div>{workflow.name}</div>
            <div>{workflow.description}</div>
            <Link to={`/new_document/${workflow.id}`}>Initiate document</Link>
          </div>
        ))}
    </div>
  );
};

const mapPropsToState = (state) => ({
  token: state.auth.token,
});

export default connect(mapPropsToState, null)(StartDocument);
