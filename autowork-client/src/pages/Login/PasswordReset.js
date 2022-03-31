import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { renameTitle } from '../../redux';

const PasswordReset = (props) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setnewPassword] = useState('');
  const [confirmNewPassword, setconfirmNewPassword] = useState('');
  const [isLoading] = useState(false);

  const { is_logged_in, renameTitle } = props;
  const navigate = useNavigate();
  useEffect(() => {
    if (!is_logged_in) {
      return navigate('/');
    }
    renameTitle('Password Reset');
  });

  const handlePasswordReset = async () => {};

  return (
    <Box
      component='form'
      noValidate
      onSubmit={handlePasswordReset}
      sx={{ mt: 4, width: 4 / 10, mx: 'auto' }}>
      <TextField
        margin='normal'
        fullWidth
        id='currentPassword'
        label='Current Password'
        name='currentPassword'
        autoFocus
        value={currentPassword}
        onChange={(event) => setCurrentPassword(event.target.value)}
      />
      <TextField
        margin='normal'
        fullWidth
        name='newPassword'
        label='Password'
        type='password'
        id='newPassword'
        autoComplete='new-password'
        value={newPassword}
        onChange={(event) => setnewPassword(event.target.value)}
      />
      <TextField
        margin='normal'
        fullWidth
        name='confirmNewPassword'
        label='Confirm New Password'
        type='password'
        id='confirmNewPassword'
        autoComplete='new-password'
        value={confirmNewPassword}
        onChange={(event) => setconfirmNewPassword(event.target.value)}
      />
      <Button
        type='submit'
        fullWidth
        variant='contained'
        sx={{ mt: 3, mb: 2 }}
        disabled={isLoading}>
        Reset Your Password
      </Button>
    </Box>
  );
};

const mapStateToProps = (state) => ({
  is_logged_in: state.auth.is_logged_in,
});

const mapDispatchToProps = (dispatch) => ({
  renameTitle: (page_title) => dispatch(renameTitle(page_title)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PasswordReset);
