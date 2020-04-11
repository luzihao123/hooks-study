import './App.css'
import dayjs from 'dayjs'
import React from 'react'
import {connect} from 'react-redux'
import URI from 'urijs'
import Nav from '../common/Nav.jsx'
import List from './List.jsx'
import Bottom from './Bottom.jsx'
import Header from '../common/Header.jsx'
import useNav from '../common/useNav'
import {h0} from '../common/fp'
import { useCallback, useEffect, useMemo } from 'react'
import {bindActionCreators} from 'redux'
import { 
  setFrom, setTo, setDepartDate, setHighSpeed, setSearchParsed,
  setTrainList,
  setTicketTypes,
  setTrainTypes,
  setDepartStations,
  setArriveStations,

  prevDate,
  nextDate,

  toggleOrderType,
  toggleHighSpeed,
  toggleIsFiltersVisible,
  toggleOnlyTickets,

  setCheckedTicketTypes,
  setCheckedTrainTypes,
  setCheckedDepartStations,
  setCheckedArriveStations,
  setDepartTimeEnd,
  setDepartTimeStart,
  setArriveTimeEnd,
  setArriveTimeStart

} from './actions'

function App(props) {
  const {from, to, dispatch, searchParsed,
    departDate,
    highSpeed,
    orderType,
    onlyTickets,
    trainList,
    isFiltersVisible,

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
    arriveStations
  } = props

  useEffect(()=>{
    const queries = URI.parseQuery(window.location.search)
    const {from, to, highSpeed, date} = queries
    dispatch(setFrom(from))
    dispatch(setTo(to))
    dispatch(setDepartDate(h0(dayjs(date).valueOf())))
    dispatch(setHighSpeed(highSpeed==='true'))
    dispatch(setSearchParsed(true))
  }, [dispatch])

  useEffect(()=>{
    if (!searchParsed) {
      return
    }
    const url = new URI('/rest/query').setSearch('from', from)
    .setSearch('to', to).setSearch('data', dayjs(departDate).format('YYYY-MM-DD'))
    .setSearch('highSpeed', highSpeed)
    .setSearch('orderType',orderType)
    .setSearch('onlyTickets',onlyTickets)
    .setSearch('checkedTicketTypes',Object.keys(checkedTicketTypes).join())
    .setSearch('checkedTrainTypes',Object.keys(checkedTrainTypes).join())
    .setSearch('checkedDepartStations',Object.keys(checkedDepartStations).join())
    .setSearch('checkedArriveStations',Object.keys(checkedArriveStations).join())
    .setSearch('departTimeStart',departTimeStart)
    .setSearch('departTimeEnd',departTimeEnd)
    .setSearch('arriveTimeStart',arriveTimeStart)
    .setSearch('arriveTimeEnd',arriveTimeEnd)
    .toString()
    fetch(url).then(response=>response.json()).then(res=>{
      const {dataMap: {
        directTrainInfo: {
          trains,
          filter: {
            ticketType,
            trainType,
            depStation,
            arrStation
          }
        }
      }} = res
      dispatch(setTrainList(trains))
      dispatch(setTicketTypes(ticketType))
      dispatch(setTrainTypes(trainType))
      dispatch(setDepartStations(depStation))
      dispatch(setArriveStations(arrStation))
    })
  }, [from, to, departDate, highSpeed, searchParsed, orderType, onlyTickets, checkedTicketTypes, checkedTrainTypes, checkedDepartStations, checkedArriveStations, departTimeStart, departTimeEnd, arriveTimeStart, arriveTimeEnd, dispatch])

  const onBack = useCallback(()=>{
    window.history.back()
  }, [])

  
  const {
    isPrevDisabled,
    isNextDisabled,
    prev,
    next
  } =  useNav(departDate, dispatch, prevDate, nextDate)

  const bottomCbs = useMemo(()=>{
    return bindActionCreators({
      toggleOrderType,
      toggleHighSpeed,
      toggleIsFiltersVisible,
      toggleOnlyTickets,
      setCheckedTicketTypes,
      setCheckedTrainTypes,
      setCheckedDepartStations,
      setCheckedArriveStations,
      setDepartTimeEnd,
      setDepartTimeStart,
      setArriveTimeEnd,
      setArriveTimeStart
    },dispatch)
  }, [dispatch])

  if (!searchParsed) {
    return null
  }
  return (
    <div>
      <div className='header-wrapper'>
        <Header title={`${from}-${to}`} onBack={onBack}/>
      </div>
      <Nav 
        date={departDate} 
        isPrevDisabled={isPrevDisabled} 
        isNextDisabled={isNextDisabled}
        prev={prev} 
        next={next}/>
      <List list={trainList}/>
      <Bottom 
        {...bottomCbs} 
        isFiltersVisible={isFiltersVisible} 
        highSpeed={highSpeed} 
        orderType={orderType} 
        onlyTickets={onlyTickets}
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
      />
    </div>
  )
}
export default connect(
  function mapStateToProps(state) {
    return state
  },
  function mapDispatchToProps(dispatch) {
    return {dispatch}
  }
)(App)