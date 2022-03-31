import { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Badge from '@mui/material/Badge';
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
import axios from 'axios';

const UserNavigationList = (props) => {
  const { token, employee_name } = props;
  const [loading, setLoading] = useState(true);
  const [taskCount, setTaskCount] = useState(0);
  const [approvalCount, setApprovalCount] = useState(0);
  const [primary_list, setPrimaryList] = useState([
    {
      title: 'My Documents',
      url: '/user/document/get_all',
      icon: <ArticleIcon />,
    },
    {
      title: 'My Tasks',
      url: '/user/task/get_all',
      icon: <TaskIcon />,
      badgeCount: taskCount,
    },
    {
      title: 'My Approvals',
      url: '/user/approval/get_all',
      icon: <ApprovalIcon />,
      badgeCount: approvalCount,
    },
  ]);
  const [secondary_list] = useState([
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
  ]);
  const [primary_admin_list] = useState([
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
  ]);
  const [secondary_admin_list] = useState();

  useEffect(() => {
    const getTaskCount = async () => {
      try {
        const response = await axios.get(
          '/api/user/document/read_awaiting_actions_from_auth_user',
          {
            headers: { 'x-auth-token': token },
          },
        );
        if (response.status === 200) {
          setTaskCount(response.data.payload.documents.length);
        }
      } catch (error) {
        if (error.response.status === 404) {
          setTaskCount(0);
        } else {
          console.error(error);
        }
      }
    };
    const getApprovalCount = async () => {
      try {
        const response = await axios.get(
          '/api/user/document/read_awaiting_approvals_from_auth_user',
          {
            headers: { 'x-auth-token': token },
          },
        );
        if (response.status === 200) {
          setApprovalCount(response.data.payload.documents.length);
        }
      } catch (error) {
        if (error.response.status === 404) {
          setApprovalCount(0);
        } else {
          console.error(error);
        }
      }
    };
    const getData = async () => {
      getTaskCount();
      getApprovalCount();
      setLoading(false);
    };

    getData();

    let intervalId;

    if (employee_name !== 'SYSTEM ADMIN') {
      intervalId = setInterval(getData, 2500);
    }

    setPrimaryList((list) =>
      list.map((item) => {
        if (item.title === 'My Approvals') {
          return { ...item, badgeCount: approvalCount };
        } else return item;
      }),
    );

    setPrimaryList((list) =>
      list.map((item) => {
        if (item.title === 'My Tasks') {
          return { ...item, badgeCount: taskCount };
        } else return item;
      }),
    );

    return () => intervalId && clearInterval(intervalId);
  }, [
    token,
    employee_name,
    approvalCount,
    setPrimaryList,
    taskCount,
    setTaskCount,
  ]);

  const navigate = useNavigate();

  return (
    <>
      {!loading && (
        <>
          {[
            employee_name === 'SYSTEM ADMIN'
              ? primary_admin_list
              : primary_list,
            employee_name === 'SYSTEM ADMIN'
              ? secondary_admin_list
              : secondary_list,
          ].map((list) => (
            <Fragment key={Math.random()}>
              {list.map((item) => (
                <Fragment key={item.title}>
                  <ListItemButton
                    onClick={() => navigate(item.url, { replace: true })}>
                    <ListItemIcon>
                      {(item.badgeCount && (
                        <Badge color='secondary' badgeContent={item.badgeCount}>
                          {item.icon}
                        </Badge>
                      )) ||
                        item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.title} />
                  </ListItemButton>
                </Fragment>
              ))}
              <Divider sx={{ my: 1 }} />
            </Fragment>
          ))}
        </>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  employee_name: state.auth.employee_name,
  token: state.auth.token,
});

export default connect(mapStateToProps, null)(UserNavigationList);
