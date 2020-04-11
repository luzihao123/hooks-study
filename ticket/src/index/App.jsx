import React, {
  useCallback,
  // userMemo,
  useMemo
} from 'react'
import { bindActionCreators } from 'redux'
import {connect} from 'react-redux'
import './App.css'

import Header from '../common/Header.jsx'
import DepartDate from './DepartDate.jsx'
import HighSpeed from './HighSpeed.jsx'
import Journey from './Journey.jsx'
import Submit from './Submit.jsx'

import CitySelector from '../common/CitySelector.jsx'
import DateSelector from '../common/DateSelector.jsx'

import {h0} from '../common/fp'
import {
  exchangeFromTo, 
  showCitySelector,
  hideCitySelector,
  fetchCityData,
  setSelectedCity,
  showDateSelector,
  hideDateSelector,
  setDepartDate,
  toggleHighSpeed
} from './actions'

function App(props) {
  const { 
    from, to, dispatch,
    isCitySelectorVisible,
    isDateSelectorVisible,
    cityData,
    isLoadingCityData,
    departDate,
    highSpeed
  } = props
  const onBack = useCallback(() => {
    window.history.back()
  }, [])

  // const doExchangeFromTo = useCallback(()=>{
  //   dispatch(exchangeFromTo())
  // }, [])

  // const doShowCitySelector = useCallback((m)=>{
  //   dispatch(showCitySelector(m))
  // }, [])

  const cbs = useMemo(()=>{
    return bindActionCreators({
      exchangeFromTo,
      showCitySelector
    }, dispatch)
  }, [dispatch])

  const CitySelectorCbs = useMemo(()=>{
    return bindActionCreators({
      onBack: hideCitySelector,
      fetchCityData,
      onSelect: setSelectedCity
    }, dispatch)
  }, [dispatch])

  const departDateCbs = useMemo(()=>{
    return bindActionCreators({
      onClick: showDateSelector
    }, dispatch)
  }, [dispatch])

  const dateSelectorCbs = useMemo(()=>{
    return bindActionCreators({
      onBack: hideDateSelector
    }, dispatch)
  }, [dispatch])

  const onSelectDate = useCallback((day)=>{
    if(!day){
      return
    }
    if (day<h0()) {
      return 
    }
    dispatch(setDepartDate(day))
    dispatch(hideDateSelector())
  },[dispatch])

  const highSpeedCbs = useMemo(()=>{
    return bindActionCreators({
      toggle: toggleHighSpeed
    }, dispatch)
  },[dispatch])

  return (
    <div>
      <div className='header-wrapper'>
        <Header title='火车票' onBack={onBack} />
      </div>
      <form action='./query.html' className='form'>
        <Journey 
          {...cbs}
          // exchangeFromTo={doExchangeFromTo}
          // showCitySelector={doShowCitySelector}
          from={from} to={to} />
        <DepartDate time={departDate} {...departDateCbs}/>
        <HighSpeed {...highSpeedCbs} highSpeed={highSpeed}/>
        <Submit/>
        <CitySelector
         {...CitySelectorCbs}
         show={isCitySelectorVisible}
         cityData={cityData}
         isLoading={isLoadingCityData}
        />
        <DateSelector
          {...dateSelectorCbs}
          onSelect={onSelectDate}
          show={isDateSelectorVisible}
        />
      </form>
      
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