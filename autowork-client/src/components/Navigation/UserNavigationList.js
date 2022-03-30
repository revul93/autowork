import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import TaskIcon from '@mui/icons-material/Task';
import ApprovalIcon from '@mui/icons-material/Approval';
import KeyIcon from '@mui/icons-material/Key';
import LogoutIcon from '@mui/icons-material/Logout';
import ArticleIcon from '@mui/icons-material/Article';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import GroupIcon from '@mui/icons-material/Group';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import WorkIcon from '@mui/icons-material/Work';
import SchemaIcon from '@mui/icons-material/Schema';
import { connect } from 'react-redux';

const UserNavigationList = (props) => {
  const { employee_name } = props;

  const primary_list = [
    {
      title: 'My Documents',
      url: '/user/document/get_all',
      icon: <ArticleIcon />,
    },
    {
      title: 'My Tasks',
      url: '/user/task/get_all',
      icon: <TaskIcon />,
    },
    {
      title: 'My Approvals',
      url: '/user/approval/get_all',
      icon: <ApprovalIcon />,
    },
  ];

  const secondary_list = [
    {
      title: 'Reset Password',
      url: '/user/reset_password',
      icon: <KeyIcon />,
    },
    {
      title: 'Logout',
      url: '/logout',
      icon: <LogoutIcon />,
    },
  ];

  const primary_admin_list = [
    {
      title: 'Manage Users',
      url: '/admin/user/get_all',
      icon: <AccountBoxIcon />,
    },
    {
      title: 'Manage Roles',
      url: '/admin/role/get_all',
      icon: <WorkIcon />,
    },
    {
      title: 'Manage Divisions',
      url: '/admin/division/get_all',
      icon: <ManageAccountsIcon />,
    },
    {
      title: 'Manage Groups',
      url: '/admin/group/get_all',
      icon: <GroupIcon />,
    },
    {
      title: 'Manage Workflows',
      url: '/admin/workflow/get_all',
      icon: <SchemaIcon />,
    },
  ];

  const secondary_admin_list = [
    {
      title: 'Reset Password',
      url: '/admin/reset_password',
      icon: <KeyIcon />,
    },
    {
      title: 'Logout',
      url: '/logout',
      icon: <LogoutIcon />,
    },
  ];

  const navigate = useNavigate();

  return (
    <>
      {[
        employee_name === 'SYSTEM ADMIN' ? primary_admin_list : primary_list,
        employee_name === 'SYSTEM ADMIN'
          ? secondary_admin_list
          : secondary_list,
      ].map((list) => (
        <Fragment key={Math.random()}>
          {list.map((item) => (
            <Fragment key={item.title}>
              <ListItemButton
                onClick={() => navigate(item.url, { replace: true })}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItemButton>
            </Fragment>
          ))}
          <Divider sx={{ my: 1 }} />
        </Fragment>
      ))}
    </>
  );
};

const mapStateToProps = (state) => ({
  employee_name: state.auth.employee_name,
});

export default connect(mapStateToProps, null)(UserNavigationList);
