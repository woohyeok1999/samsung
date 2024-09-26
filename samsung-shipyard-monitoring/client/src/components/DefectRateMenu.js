import React from 'react';
import { List, ListItem, ListItemText, Paper } from '@mui/material';

const menuItems = [
  { id: 'vessel_type_long', label: '선종' },
  { id: 'department_code', label: '과' },
  { id: 'company_type', label: '업체' },
  { id: 'reason_details', label: '사유코드' },
  { id: 'welding_method', label: '용접기법' },
];

const DefectRateMenu = ({ selectedMenu, onMenuSelect }) => {
  return (
    <Paper elevation={0} style={{ height: '100%', overflow: 'auto' }}>
      <div style={{ padding: '15px' }}>
        <h3 style={{ margin: '15px 0 15px 0', textAlign: 'center', lineHeight: '1.75', color: '#333' }}>항목별<br />불량 정보 조회</h3>
        <List component="nav">
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.id}
              selected={selectedMenu === item.id}
              onClick={() => onMenuSelect(item.id)}
              style={{
                borderRadius: '4px',
                margin: '5px 0',
                backgroundColor: selectedMenu === item.id ? '#2196f3' : 'transparent',
                color: selectedMenu === item.id ? 'white' : '#333',
                transition: 'all 0.3s',
                textAlign: 'center',
              }}
            >
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </div>
    </Paper>
  );
};

export default DefectRateMenu;