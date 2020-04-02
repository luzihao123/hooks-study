import React, { memo } from 'react';

import PropTypes from 'prop-types'
import className from 'classnames'
import './Menu.css'

const MenuItem = memo(function MenuItem(props){
  const {
    onPress,
    title,
    value,
    active
  } = props
  return (
    <li className={classNames({active})} onClick={()=>{onPress(value)}}>
      {title}
    </li>
  )
})

MenuItem.propTypes = {
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  activ: PropTypes.bool.isRequired,
}

const Menu = memo(function Menu(props){
  const {
    show,
    options,
    onPress,
    hideMenu,
  } = props
  return(
    <div >
      { show && <div className='menu-mask' onClick={()=>hideMenu()}></div>}
      <div className={className('menu', {show})}>
        <div className='menu-title'></div>
        <ul>
          {
            options && options.map(option=>{
              return (
                <MenuItem key={option.value} {...option} onPress={onPress} />
              )
            })
          }
        </ul>
      </div>
      
    </div>
  )
})
Menu.propTypes = {
  show: PropTypes.bool.isRequired,
  options: PropTypes.array.isRequired,
  onPress: PropTypes.func.isRequired,
  hideMenu: PropTypes.func.isRequired,
}

export default Menu