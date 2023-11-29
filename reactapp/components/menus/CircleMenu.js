import React, { useState, useEffect } from 'react';
import 'css/circular-menu.css'
import { BiSolidSave,BiLockAlt,BiLockOpenAlt } from "react-icons/bi"
import { IconContext } from "react-icons";

const itemClick = (e) => {
  console.log("clicked");
}

const menuData = [
    {
      color: "#b3462f",
      icon: <BiLockOpenAlt/>,
      click: itemClick
    },{
      color: "#e78b38",
      icon: <BiLockOpenAlt/>,
      click: itemClick
    },{
      color: "#353535",
      icon: <BiLockOpenAlt/>,
      click: itemClick
    },{
      color: "#303c54",
      icon: <BiLockOpenAlt/>,
      click: itemClick
    },{
      color: "#3a384e",
      icon: <BiLockOpenAlt/>,
      click: itemClick
    },{
      color: "#78332c",
      icon: <BiLockOpenAlt/>,
      click: itemClick
    }
  ];

const MenuWrapper = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    makeMenu(menuData);
  }, []);

  const makeMenu = (menuConfig) => {
    const angle = 360 / menuConfig.length;
    let rotation = 0;
    let newMenuItems = [];

    menuConfig.forEach(({ color, icon, click }) => {
      newMenuItems.push({
        color,
        icon,
        click,
        rotation,
        angle,
        show: false
      });
      rotation += angle;
    });

    setMenuItems(newMenuItems);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const animateButtons = () => {
    const stagger = (i) => {
      if (i < menuItems.length) {
        setTimeout(() => {
          setMenuItems(prevItems => {
            const updatedItems = [...prevItems];
            updatedItems[i].show = !updatedItems[i].show;
            return updatedItems;
          });
          stagger(i + 1);
        }, 60);
      }
    };

    stagger(0);
  };

  return (
    <div>
      <MenuToggle toggle={toggleMenu} open={menuOpen} animateButtons={animateButtons} />
      <Menu size={18} items={menuItems} open={menuOpen} />
    </div>
  );
};

const Menu = ({ size, items, open }) => (
  <div className={open ? "menu-wrapper-open" : "menu-wrapper-closed"}>
    <div className={"menu-background"}>
      <MenuItems size={size} items={items} open={open} />
    </div>
  </div>
);

const MenuItems = ({ size, items, open }) => {
  const buttons = items.map((item) => {
    const styling = {
      transform: `rotate(${item.rotation}deg) translate(${size / 2}em) rotate(${-(item.rotation)}deg)`,
      backgroundColor: item.color
    };

    return (
      <div
        className={item.show ? "menu-item item-show" : "menu-item item-hide"}
        style={styling}
        onClick={item.click}
      >
        <IconContext.Provider value={{ className: "icon-class-name" }}>
            {item.icon}
        </IconContext.Provider>
        
        {/* <i className={"fa " + item.icon} aria-hidden="true"></i> */}
      </div>
    );
  });

  return (
    <div className={open ? "button-bg animate-menu" : "button-bg"}>
      {buttons}
    </div>
  );
}

const MenuToggle = ({ toggle, open, animateButtons }) => (
  <button
    className={open ? "menu-toggle toggle-open" : "menu-toggle toggle-closed"}
    onClick={() => {
      toggle();
      setTimeout(animateButtons, 120);
    }}
  >
    <i className={open ? "fa fa-times" : "fa fa-bars"} aria-hidden="true"></i>
  </button>
);

export default MenuWrapper;
