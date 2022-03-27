import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Divider from '@mui/material/Divider';
import TaskIcon from '@mui/icons-material/Task';
import ApprovalIcon from '@mui/icons-material/Approval';
import KeyIcon from '@mui/icons-material/Key';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import LogoutIcon from '@mui/icons-material/Logout';
import ArticleIcon from '@mui/icons-material/Article';

const primary_list = [
  {
    title: 'Dashboard',
    url: '/user',
    icon: <DashboardIcon />,
  },
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
    title: 'Help',
    url: '/help',
    icon: <HelpCenterIcon />,
  },
  {
    title: 'Logout',
    url: '/logout',
    icon: <LogoutIcon />,
  },
];

const UserNavigationList = () => {
  const navigate = useNavigate();

  return (
    <>
      {[primary_list, secondary_list].map((list) => (
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

export default UserNavigationList;
