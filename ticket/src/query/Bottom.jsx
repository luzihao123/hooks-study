import './Bottom.css'
import React, {memo, useState, useCallback, useMemo, useReducer} from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { ORDER_DEPART } from './constant'
import Slide from './Slide.jsx'

function checkedReducer(state, action) {
  const {type, payload} = action
  switch (type) {
    case 'toggle':
      const newState = {...state}
      if(payload in newState) {
        delete newState[payload]
      } else {
        newState[payload] = true
      }
      return newState;
    case 'reset':
      return {}
    default:
  }
  return state
}

const Filter = memo(function Filter(props) {
  const {name, checked, dispatch, value} = props
  return (
    <li className={classnames({checked})} onClick={()=>dispatch({payload: value, type: 'toggle'})}>
      {name}
    </li>
  )
})

Filter.propTypes = {
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired
}

const Option = memo (function Option(props) {
  const {title,options,checkedMap,dispatch} = props
  // const toggle = useCallback((value) => {
  //   const newCheckedMap = {...checkedMap}
  //   if (value in checkedMap) {
  //     delete newCheckedMap[value]
  //   } else {
  //     newCheckedMap[value] = true
  //   }
  //   update(newCheckedMap)
  // }, [checkedMap, update]) 
  return (
    <div className='option'>
      <h3>{title}</h3>
      <ul>
        {
          options.map(o=>{
            return <Filter {...o} checked={o.value in checkedMap} key={o.value} dispatch={dispatch}/>
          })
        }
      </ul>
    </div>
  )
})

Option.propTypes = {
  title: PropTypes.string.isRequired,
  checkedMap: PropTypes.object.isRequired,
  options: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
}

const BottomModal = memo(function BottomModal(props) {
  const {
    checkedTicketTypes,
    checkedTrainTypes,
    checkedDepartStations,
    checkedArriveStations,
    departTimeStart,
    departTimeEnd,
    arriveTimeStart,
    arriveTimeEnd,
    ticketTypes,
    trainTypes,
    departStations,
    arriveStations,
    setCheckedTicketTypes,
    setCheckedTrainTypes,
    setCheckedDepartStations,
    setCheckedArriveStations,
    setDepartTimeEnd,
    setDepartTimeStart,
    setArriveTimeEnd,
    setArriveTimeStart,
    toggleIsFiltersVisible
  } = props

  const [localCheckedTicketTypes, localCheckedTicketTypesDispatch] = useReducer(checkedReducer,checkedTicketTypes,(checkedTicketTypes)=>{
    return {
      ...checkedTicketTypes
    }
  })

  const [localCheckedTrainTypes, localCheckedTrainTypesDispatch] = useReducer(checkedReducer, checkedTrainTypes, ()=>{
    return {
      ...checkedTrainTypes
    }
  })

  const [localCheckedDepartStations, localCheckedDepartStationsDispatch] = useReducer(checkedReducer, checkedDepartStations, ()=>{
    return {
      ...checkedDepartStations
    }
  })

  const [localCheckedArriveStations, localCheckedArriveStationsDispatch] = useReducer(checkedReducer, checkedArriveStations,()=>{
    return {
      ...checkedArriveStations
    }
  })

  const [localDepartTimeStart, setLocalDepartTimeStart] = useState(departTimeStart)
  const [localDepartTimeEnd, setLocalDepartTimeEnd] = useState(departTimeEnd)
  const [localArriveTimeStart, setLocalArriveTimeStart] = useState(arriveTimeStart)
  const [localArriveTimeEnd, setLocalArriveTimeEnd] = useState(arriveTimeEnd)

  const optionGroup = [
    {
      title: '坐席类型',
      options: ticketTypes,
      checkedMap: localCheckedTicketTypes,
      dispatch: localCheckedTicketTypesDispatch
    }, 
    {
      title: '车次类型',
      options: departStations,
      checkedMap: localCheckedDepartStations,
      dispatch: localCheckedDepartStationsDispatch
    },
    {
      title: '出发车站',
      options: trainTypes,
      checkedMap: localCheckedTrainTypes,
      dispatch: localCheckedTrainTypesDispatch
    },{
      title: '到达车站',
      options: arriveStations,
      checkedMap: localCheckedArriveStations,
      dispatch: localCheckedArriveStationsDispatch
    }
  ]

  function sure () {
    setCheckedTicketTypes(localCheckedTicketTypes)
    setCheckedTrainTypes(localCheckedTrainTypes)
    setCheckedDepartStations(localCheckedDepartStations)
    setCheckedArriveStations(localCheckedArriveStations)
    setDepartTimeStart(localDepartTimeStart)
    setDepartTimeEnd(localDepartTimeEnd)
    setArriveTimeEnd(localArriveTimeEnd)
    setArriveTimeStart(localArriveTimeStart)
    toggleIsFiltersVisible()
  }

  const isResetDisabled = useMemo(()=>{
    return Object.keys(localCheckedTicketTypes).length === 0
        && Object.keys(localCheckedTrainTypes).length === 0
        && Object.keys(localCheckedDepartStations).length === 0
        && Object.keys(localCheckedArriveStations).length === 0
        && localDepartTimeStart === 0
        && localDepartTimeEnd === 24
        && localArriveTimeStart === 0
        && localArriveTimeEnd === 24
    }, [
      localCheckedTicketTypes,
      localCheckedTrainTypes,
      localCheckedDepartStations,
      localCheckedArriveStations,
      localDepartTimeStart,
      localDepartTimeEnd,
      localArriveTimeStart,
      localArriveTimeEnd
  ])

  function reset () {
    if (isResetDisabled) {return}
    localCheckedTicketTypesDispatch({type: 'reset'})
    localCheckedTrainTypesDispatch({type: 'reset'})
    localCheckedDepartStationsDispatch({type: 'reset'})
    localCheckedArriveStationsDispatch({type: 'reset'})

    setLocalDepartTimeStart(0)
    setLocalDepartTimeEnd(24)
    setLocalArriveTimeEnd(24)
    setLocalArriveTimeStart(0)
  }

  return (
    <div className='bottom-modal'>
      <div className='bottom-dialog'>
        <div className='bottom-dialog-content'>
          <div className='title'>
            <span onClick={reset} 
              className={classnames('reset', {
                disabled: isResetDisabled
              })}
            >重置</span>
            <span className='ok' onClick={sure}>确定</span>
          </div>
          <div className='options'>
            {
              optionGroup.map(g=> <Option {...g} key={g.title}/>)
            }
            <Slide title='出发时间' 
              currentStartHours={localDepartTimeStart}
              currentEndHours = {localDepartTimeEnd}
              onStartChanged={setLocalDepartTimeStart}
              onEndChanged={setLocalDepartTimeEnd}
            ></Slide>

            <Slide 
              title='到达时间' 
              currentStartHours={localArriveTimeStart}
              currentEndHours = {localArriveTimeEnd}
              onStartChanged={setLocalArriveTimeStart}
              onEndChanged={setLocalArriveTimeEnd}
            ></Slide>
          </div>
        </div>
      </div>
    </div>
  )
})

BottomModal.propTypes = {
  toggleIsFiltersVisible: PropTypes.func.isRequired,
  checkedTicketTypes: PropTypes.object.isRequired,
  checkedTrainTypes: PropTypes.object.isRequired,
  checkedDepartStations: PropTypes.object.isRequired,
  checkedArriveStations: PropTypes.object.isRequired,
  departTimeStart: PropTypes.number.isRequired,
  departTimeEnd: PropTypes.number.isRequired,
  arriveTimeStart: PropTypes.number.isRequired,
  arriveTimeEnd: PropTypes.number.isRequired,
  ticketTypes: PropTypes.array.isRequired,
  trainTypes: PropTypes.array.isRequired,
  departStations: PropTypes.array.isRequired,
  arriveStations: PropTypes.array.isRequired,
  setCheckedTicketTypes: PropTypes.func.isRequired,
  setCheckedTrainTypes: PropTypes.func.isRequired,
  setCheckedDepartStations: PropTypes.func.isRequired,
  setCheckedArriveStations: PropTypes.func.isRequired,
  setDepartTimeEnd: PropTypes.func.isRequired,
  setDepartTimeStart: PropTypes.func.isRequired,
  setArriveTimeEnd: PropTypes.func.isRequired,
  setArriveTimeStart: PropTypes.func.isRequired,
}


export default function Bottom(props){
  const {
    isFiltersVisible,
    highSpeed,
    orderType,
    onlyTickets,
    toggleOrderType,
    toggleHighSpeed,
    toggleIsFiltersVisible,
    toggleOnlyTickets,

    checkedTicketTypes,
    checkedTrainTypes,
    checkedDepartStations,
    checkedArriveStations,
    departTimeStart,
    departTimeEnd,
    arriveTimeStart,
    arriveTimeEnd,
    ticketTypes,
    trainTypes,
    departStations,
    arriveStations,

    setCheckedTicketTypes,
    setCheckedTrainTypes,
    setCheckedDepartStations,
    setCheckedArriveStations,
    setDepartTimeEnd,
    setDepartTimeStart,
    setArriveTimeEnd,
    setArriveTimeStart
  } = props

  const noChecked = useMemo(()=>{
    return Object.keys(checkedTicketTypes).length === 0
        && Object.keys(checkedTrainTypes).length === 0
        && Object.keys(checkedDepartStations).length === 0
        && Object.keys(checkedArriveStations).length === 0
        && departTimeStart === 0
        && departTimeEnd === 24
        && arriveTimeStart === 0
        && arriveTimeEnd === 24
    }, [
      checkedTicketTypes,
      checkedTrainTypes,
      checkedDepartStations,
      checkedArriveStations,
      departTimeStart,
      departTimeEnd,
      arriveTimeStart,
      arriveTimeEnd
  ])
  return (
    <div className='bottom'>
      <div className='bottom-filters'>
        <span className='item' onClick={toggleOrderType}>
          <i className='icon'>&#xf065;</i>
          {
            orderType === ORDER_DEPART ? '出发 早→晚':'耗时 短→长'
          }
        </span>
        <span className={classnames('item', {
          'item-on': highSpeed
        })} onClick={toggleHighSpeed}>
          <i className='icon'>{highSpeed ? '\uf43f': '\uf43e'}</i>
          只看高铁动车
        </span>
        <span className={classnames('item', {
          'item-on': onlyTickets
        })} onClick={toggleOnlyTickets}>
          <i className='icon'>{onlyTickets ? '\uf43d': '\uf43c'}</i>
          只看有票
        </span>
        <span className={classnames('item', {
          'item-on': isFiltersVisible || !noChecked
        })} onClick={toggleIsFiltersVisible}>
          <i className='icon'>{ noChecked?'\uf0f7':'\uf446'}</i>
          综合
        </span>
      </div>
      {
        isFiltersVisible && 
        <BottomModal
          checkedTicketTypes={checkedTicketTypes}
          checkedTrainTypes={checkedTrainTypes}
          checkedDepartStations={checkedDepartStations}
          checkedArriveStations={checkedArriveStations}
          departTimeStart={departTimeStart}
          departTimeEnd={departTimeEnd}
          arriveTimeStart={arriveTimeStart}
          arriveTimeEnd={arriveTimeEnd}
          ticketTypes={ticketTypes}
          trainTypes={trainTypes}
          departStations={departStations}
          arriveStations={arriveStations}
      
          setCheckedTicketTypes={setCheckedTicketTypes}
          setCheckedTrainTypes={setCheckedTrainTypes}
          setCheckedDepartStations={setCheckedDepartStations}
          setCheckedArriveStations={setCheckedArriveStations}
          setDepartTimeEnd={setDepartTimeEnd}
          setDepartTimeStart={setDepartTimeStart}
          setArriveTimeEnd={setArriveTimeEnd}
          setArriveTimeStart={setArriveTimeStart}
          toggleIsFiltersVisible={toggleIsFiltersVisible}
        />
      }
    </div>
  )
}
Bottom.propTypes = {
  isFiltersVisible: PropTypes.bool.isRequired,
  highSpeed: PropTypes.bool.isRequired,
  orderType: PropTypes.number.isRequired,
  onlyTickets: PropTypes.bool.isRequired,
  toggleOrderType: PropTypes.func.isRequired,
  toggleHighSpeed: PropTypes.func.isRequired,
  toggleIsFiltersVisible: PropTypes.func.isRequired,
  toggleOnlyTickets: PropTypes.func.isRequired,

  checkedTicketTypes: PropTypes.object.isRequired,
  checkedTrainTypes: PropTypes.object.isRequired,
  checkedDepartStations: PropTypes.object.isRequired,
  checkedArriveStations: PropTypes.object.isRequired,
  departTimeStart: PropTypes.number.isRequired,
  departTimeEnd: PropTypes.number.isRequired,
  arriveTimeStart: PropTypes.number.isRequired,
  arriveTimeEnd: PropTypes.number.isRequired,
  ticketTypes: PropTypes.array.isRequired,
  trainTypes: PropTypes.array.isRequired,
  departStations: PropTypes.array.isRequired,
  arriveStations: PropTypes.array.isRequired,

  setCheckedTicketTypes: PropTypes.func.isRequired,
  setCheckedTrainTypes: PropTypes.func.isRequired,
  setCheckedDepartStations: PropTypes.func.isRequired,
  setCheckedArriveStations: PropTypes.func.isRequired,
  setDepartTimeEnd: PropTypes.func.isRequired,
  setDepartTimeStart: PropTypes.func.isRequired,
  setArriveTimeEnd: PropTypes.func.isRequired,
  setArriveTimeStart: PropTypes.func.isRequired,
}