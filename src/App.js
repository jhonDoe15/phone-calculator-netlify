import React, { useState }  from 'react';
import PhonesGrid from './Components/PhonesGrid/PhonesGrid'
import { Menu } from 'semantic-ui-react'
import AddPhoneModal from './Components/AddPhoneModal/AddPhoneModal';

const App = () => {
  const [navbarState, setNavbarState] = useState({ activeItem: 'home' })

  const handleItemClick = (e, { name }) => setNavbarState({ activeItem: name })

  const addPhone = async (e, { name }) => {
    handleItemClick(e, { name })
    
  }

  const { activeItem } = navbarState
  

  return (
    <div className="App" style={{backgroundColor: 'black',color: 'white'}}>
      <Menu inverted>
        <Menu.Item
          name='home'
          active={activeItem === 'home'}
          onClick={handleItemClick}
        />
        <AddPhoneModal>
          <Menu.Item
          style={{width: '8em'}}
            name='add phone'
            active={activeItem === 'add phone'}
            onClick={addPhone}
          />
        </AddPhoneModal>
      </Menu>
      
      <PhonesGrid/>
    </div>
  );
}

export default App;
