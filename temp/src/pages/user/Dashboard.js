import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StartDocument from '../components/UserDashboard/StartDocument';
import PendingDocuments from '../components/UserDashboard/PendingDocuments';
import AwaitingActions from '../components/UserDashboard/AwaitingActions';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';

const UserDashBoard = (props) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!props.is_logged_in) {
      navigate('/login', { replace: true });
    }
  }, [props.is_logged_in, navigate]);

  const DASHBOARD_ITEMS = [
    {
      name: 'NEW_DOCUMENT',
      text: 'Start new document',
      component: <StartDocument />,
    },
    {
      name: 'PENDING_DOCUMENT',
      text: 'My Pending Documents',
      component: <PendingDocuments />,
    },
    {
      name: 'AWAITING_ACTION',
      text: 'Documents pending actions',
      component: <AwaitingActions />,
    },
  ];
  const [DashboardItem, setDashboardItem] = useState(DASHBOARD_ITEMS[0]);

  return (
    <>
      <Navbar />
      <div className='h-100'>
        <div
          className='d-flex flex-row flex-nowrap justify-content-around'
          style={{ backgroundColor: '#161D20' }}>
          {DASHBOARD_ITEMS.map((item) => (
            <div
              className={`btn ${
                DashboardItem.name === item.name ? 'btn-light' : 'btn-dark'
              }`}
              key={item.name}
              onClick={() => setDashboardItem(item)}>
              {item.text}
            </div>
          ))}
        </div>
        {DashboardItem.component}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  is_logged_in: state.auth.is_logged_in,
});

export default connect(mapStateToProps, null)(UserDashBoard);
