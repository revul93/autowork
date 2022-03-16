import { useState } from 'react';
import Navbar from '../components/Navbar';

const UserDashBoard = (props) => {
  const DASHBOARD_ITEMS = [
    { name: 'NEW_DOCUMENT', text: 'Start new document' },
    { name: 'PENDING_DOCUMENT', text: 'My Pending Documents' },
    { name: 'AWAITING_ACTION', text: 'Documents pending actions' },
  ];

  const [selected, setSelected] = useState(DASHBOARD_ITEMS[0].name);

  return (
    <>
      <Navbar />
      <div className='h-100'>
        <div className='d-flex flex-row flex-nowrap justify-content-around bg-dark'>
          {DASHBOARD_ITEMS.map((item) => (
            <div
              className={`btn ${
                selected === item.name ? 'btn-light' : 'btn-dark'
              }`}
              key={item.name}
              onClick={() => setSelected(item.name)}>
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default UserDashBoard;
