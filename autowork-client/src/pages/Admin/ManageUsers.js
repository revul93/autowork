import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { renameTitle } from '../../redux';
import axios from 'axios';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CreateIcon from '@mui/icons-material/Create';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { DataGrid } from '@mui/x-data-grid';

const ManageUsers = (props) => {
  const { is_logged_in, token, renameTitle } = props;
  const navigate = useNavigate();
  const [doneLoading, setDoneLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dataLoadingError, setDataLoadingError] = useState('');
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    renameTitle('Manage Users');
    if (!is_logged_in) {
      return navigate('/');
    }

    const getData = async () => {
      setDoneLoading(false);
      try {
        const response = await axios.get('/api/employee/read_all', {
          headers: { 'x-auth-token': token },
        });
        if (response.status === 200) {
          setData(response.data.payload.employees);
        }
      } catch (error) {
        console.error(error);
        setDataLoadingError(error.response.data.message);
      } finally {
        setDoneLoading(true);
      }
    };

    getData();

    if (update) {
      setUpdate(false);
      setDataLoadingError('');
      getData();
    }
  }, [is_logged_in, navigate, token, renameTitle, update]);

  return (
    <>
      <Button
        size='large'
        variant='contained'
        startIcon={<CreateIcon />}
        sx={{ mb: 3 }}
        onClick={() => navigate('')}>
        Create New User
      </Button>
      {doneLoading && (
        <>
          {(dataLoadingError && (
            <Alert severity='info' sx={{ width: '100%' }}>
              {dataLoadingError}
            </Alert>
          )) || (
            <DataGrid
              sx={{ height: 600, width: 1, m: 1 }}
              rows={data}
              columns={[
                { field: 'staff_id', headerName: 'Staff ID', width: '100' },
                { field: 'name', headerName: 'Name', width: '220' },
                { field: 'email', headerName: 'Email', width: '270' },
                {
                  field: 'User.username',
                  headerName: 'Username',
                  width: 180,
                  valueGetter: (elem) => elem.row.User.username,
                },
                {
                  field: 'delete',
                  headerName: 'Delete',
                  width: '100',
                  sortable: false,
                  renderCell: () => {
                    return <Button startIcon={<DeleteIcon />}></Button>;
                  },
                },
                {
                  field: 'edit',
                  headerName: 'Edit',
                  width: '100',
                  sortable: false,
                  renderCell: () => {
                    return <Button startIcon={<EditIcon />}></Button>;
                  },
                },
                {
                  field: 'reset_password',
                  headerName: 'Reset Password',
                  width: '120',
                  sortable: false,
                  renderCell: () => {
                    return <Button startIcon={<RestartAltIcon />}></Button>;
                  },
                },
              ]}
              pageSize={50}
            />
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageUsers);
