import React, { useState, useEffect } from 'react';
import { Menu, Button, Spin } from 'antd';
import { api_url } from "../../config/config"

import '../../styles/Pipeline/ModuleSidebar.css';

const { SubMenu } = Menu;

const ModuleSidebar = () => {
  const [modules, setModules] = useState([]);
  const [modulesLoading, setModulesLoading] = useState(true);





  useEffect(() => {
    loadModulesData();

  }, []);



  const loadModulesData = () => {
    fetch(api_url + '/modules')
      .then(res => res.json())
      .then(
        (response) => {
          setModules(response.data);
          setModulesLoading(false);
        },
        (error) => {
          setModulesLoading(true);
        }
      )
  }


  const onDragStart = (event, nodeCategory, nodeType, nodeLabel, nodeData) => {
    event.dataTransfer.setData('application/node_category', nodeCategory);
    event.dataTransfer.setData('application/node_type', nodeType);
    event.dataTransfer.setData('application/node_label', nodeLabel);
    event.dataTransfer.setData('application/node_config', JSON.stringify(nodeData));
    event.dataTransfer.effectAllowed = 'move';
  };
  const handleClick = e => {
    console.log('click ', e);
  };

  const renderModules = (elements) => {
    const menuItems = []

    elements.forEach(
      elem => {      
        menuItems.push(
          <Menu.Item key={elem.name}>
            <Button type='primary' size='large' className="dndnode input" onDragStart={(event) =>
              onDragStart(event, 'fv_' + elem.category, elem.type, elem.name, elem.data)}
              draggable>
              {elem.name}
            </Button>
          </Menu.Item>
        )
      }
    )


    return (
      <>
        {menuItems}
      </>
    )
  }

  return (
    <aside>
      <h6 className="mb-3">
        Konkrétní modul můžete přetáhnout do modelovacího nástroje.
      </h6>

      <Spin spinning={modulesLoading} delay={500}>
        <Menu
          onClick={handleClick}
          defaultOpenKeys={['sub1', 'sub2', 'sub3']}
          mode="inline"
        >
          <SubMenu key="sub1" title="Vstupní moduly">
            {renderModules(modules.filter(module => module.category === 'input'))}
          </SubMenu>
          <SubMenu key="sub2" title="Analyzační moduly">
            {renderModules(modules.filter(module => module.category === 'analytical'))}
          </SubMenu>
          <SubMenu key="sub3" title="Výstupní moduly">
            {renderModules(modules.filter(module => module.category === 'output'))}
          </SubMenu>
        </Menu>

      </Spin>



    </aside >
  );
};

export default ModuleSidebar;