import './App.css'
import {connect} from 'react-redux'
import React, {
  useCallback,
  useEffect,
  userMemo,
  useMemo
} from 'react'
import URI from 'urijs'
import dayjs from 'dayjs'
import Account from './Account.jsx'
import Choose from './Choose.jsx'
import Passengers from './Passengers.jsx'
import Ticket from './Ticket.jsx'
import Menu from './Menu.jsx'
import Header from '../common/Header.jsx'
import Detail from '../common/Detail.jsx'
import './App.css'

import {
  setDepartStation,
  setArriveStation,
  setTrainNumber,
  setSeatType,
  setDepartDate,
  setSearchParsed,
  featchInitial,
  createAdult,
  createChild,
  removePassenger,
  updatePassenger,
  hideMenu
} from './actions'
import { bindActionCreators } from 'redux'

function App(props) {
  const {
    trainNumber,
    departStation,
    arriveStation,
    seatType,
    departDate,
    arriveDate,
    departTimeStr,
    arriveTimeStr,
    durationStr,
    price,
    passengers,
    menu,
    isMenuVisible,
    searchParsed,
    dispatch
  } = props

  const onBack = useCallback(() => {
    window.history.back()
  }, [])

  useEffect(()=>{
    const queries = URI.parseQuery(window.location.search)
    const {
      trainNumber,
      dStation,
      aStation,
      type,
      date
    } = queries

    dispatch(setDepartStation(dStation))
    dispatch(setArriveStation(aStation))
    dispatch(setTrainNumber(trainNumber))
    dispatch(setSeatType(type))
    dispatch(setDepartDate(dayjs(date).valueOf()))
    dispatch(setSearchParsed(true))

  }, [])

  useEffect(()=>{
    if (!searchParsed) return
    const url = new URI('/rest/order')
      .setSearch('dStation', departStation)
      .setSearch('aStation', arriveStation)
      .setSearch('type', seatType)
      .setSearch('date', dayjs(departDate).format('YYYY-MM-DD'))
      .toString()
    dispatch(featchInitial(url))
  }, [
    searchParsed,
    arriveStation,
    departStation,
    seatType,
    departDate
  ])

  const passengersCbs = useMemo(()=>{
    return bindActionCreators({
      createAdult,
      createChild,
      removePassenger,
      updatePassenger
    }, dispatch)
  }, [])

  const menuCbs = useMemo(()=>{
    return bindActionCreators({
      hideMenu
    },dispatch)
  }, [])

  if (!searchParsed) {
    return null
  }

  return (
    <div className='app'>
      <div className='header-wrapper'>
        <Header title='订单填写' onBack={onBack}/>
      </div>
      <div className='detail-wrapper'>
        <Detail
          departDate={departDate}
          arriveDate={arriveDate}
          departTimeStr={departTimeStr}
          arriveTimeStr={arriveTimeStr}
          trainNumber={trainNumber} 
          departStation={departStation}
          arriveStation={arriveStation}
          durationStr={durationStr}
        >
          <span className='train-icon' style={{display: 'block'}}></span>
        </Detail>
      </div>
      <Ticket price={price} type={seatType}/>
      <Passengers passengers={passengers} {...passengersCbs}/>
      <Menu show={isMenuVisible} {...menu} {...menuCbs}/>
    </div>
  )
}
export default connect(
  function mapStateToProps(state) {
    return state
  },
  function mapDispatchToProps(dispatch) {
    return { dispatch }
  }
)(App)