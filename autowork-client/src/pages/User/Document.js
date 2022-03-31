import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { renameTitle } from '../../redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';

const Document = (props) => {
  const { is_logged_in, token, renameTitle } = props;
  const { document_id } = useParams();
  const navigate = useNavigate();
  const [doneLoading, setDoneLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dataLoadingError, setDataLoadingError] = useState('');
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    renameTitle('Document');
    if (!is_logged_in) {
      return navigate('/');
    }

    const getData = async () => {
      setDoneLoading(false);
      try {
        const response = await axios.get(
          `/api/user/document/read_one_by_id?document_id=${document_id}`,
          {
            headers: { 'x-auth-token': token },
          },
        );
        if (response.status === 200) {
          setData(response.data.payload.document);
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
  }, [is_logged_in, navigate, token, renameTitle, update, document_id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'STARTED' || 'PENDING' || 'PROCESSING':
        return 'theme.primary';
      case 'REJECTED' || 'TERMINATED':
        return 'red';
      case 'APPROVED' || 'COMPLETED':
        return 'green';
      default:
        return 'theme.primary';
    }
  };
  return (
    <>
      {doneLoading && (
        <>
          {(dataLoadingError && (
            <Alert severity='info' sx={{ width: '100%' }}>
              {dataLoadingError}
            </Alert>
          )) || (
            <Grid container spacing={0} marginLeft={3} direction={'column'}>
              <Grid item marginBottom={2}>
                <Typography marginBottom={1} variant='h4'>
                  {data.name}
                </Typography>
                <Grid item ml={2}>
                  <Typography variant='body2'>
                    {`Created at:  ${new Date(
                      data.created_at,
                    ).toLocaleString()}`}
                  </Typography>
                </Grid>
                <Divider />
              </Grid>
              <Grid item sx={{ ml: 3, mb: 2 }}>
                <Grid item>
                  <Typography variant='h6'>Creator Inforrmation</Typography>
                </Grid>
                <Grid item ml={2}>
                  <Typography variant='body1'>
                    {`Created by:  ${data.creator_name}`}
                  </Typography>
                </Grid>
                <Grid item ml={2}>
                  <Typography varian='body1'>
                    {`Staff ID: ${data.creator_staff_id}`}
                  </Typography>
                </Grid>
                <Grid item ml={2}>
                  <Typography varian='body1'>
                    {`Title: ${data.creator_role}`}
                  </Typography>
                </Grid>
                <Grid item ml={2}>
                  <Typography varian='body1'>
                    {`Division: ${data.creator_division}`}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item sx={{ ml: 3, mb: 2 }}>
                <Grid item>
                  <Typography variant='h6'>Initial Information</Typography>
                  {data.transactions[0].data.map((datafield) => (
                    <Grid item ml={2} key={datafield.label}>
                      <Typography varian='body1'>
                        {`${datafield.label}: ${datafield.value}`}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              <Grid item sx={{ ml: 3, mb: 2 }}>
                <Grid item>
                  <Typography variant='h6'>Approvals</Typography>
                  {data.approvals.map((approval) => (
                    <Grid item ml={2} mb={2} key={approval.from}>
                      <Typography varian='body1'>
                        {`Approval From: ${approval.from}`}
                      </Typography>
                      {approval.author && (
                        <Typography varian='body1'>
                          {`By: ${approval.author}`}
                        </Typography>
                      )}
                      <Typography
                        varian='body1'
                        color={getStatusColor(approval.status)}>
                        {`Status: ${approval.status} ${
                          (approval.status !== 'PENDING' &&
                            ` on: ${approval.date}`) ||
                          ''
                        }`}
                      </Typography>
                      {approval.note && (
                        <Typography varian='body1'>
                          {`Note: ${approval.note}`}
                        </Typography>
                      )}
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              <Grid item sx={{ ml: 3, mb: 2 }}>
                <Grid item>
                  <Typography variant='h6'>Transactions</Typography>
                  {data.transactions.slice(1).map((transaction) => (
                    <Grid item ml={2} mb={2} key={transaction.order}>
                      <Typography varian='h6'>
                        {`Transaction ${transaction.order}`}
                      </Typography>
                      <Typography varian='body1'>
                        {`Assigned to: ${transaction.assigned_to}`}
                      </Typography>
                      {transaction.author_name && (
                        <Typography varian='body1'>
                          {`By: ${transaction.author_name} | ${transaction.author_staff_id}`}
                        </Typography>
                      )}
                      <Typography
                        varian='body1'
                        color={getStatusColor(transaction.status)}>
                        {`Status: ${transaction.status}`}
                      </Typography>
                      {transaction.data.map((datafield) => (
                        <Grid item ml={2} key={datafield.label}>
                          <Typography varian='body1'>
                            {`${datafield.label}: ${
                              datafield.label.includes('Is')
                                ? datafield.value === '1'
                                  ? 'Yes'
                                  : 'No'
                                : datafield.value
                            }`}
                          </Typography>
                        </Grid>
                      ))}
                    </Grid>
                  ))}
                </Grid>
              </Grid>
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

export default connect(mapStateToProps, mapDispatchToProps)(Document);
