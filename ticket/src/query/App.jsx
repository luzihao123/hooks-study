import './App.css'
import React from 'react'
import {connect} from 'react-redux'
import Nav from '../common/Nav.jsx'
import List from './List.jsx'
import Bottom from './Bottom.jsx'
import Header from '../common/Header.jsx'
function App(props) {
  return (
    <div>
      <div className='header-wrapper'>
        <Header />
      </div>
      <Nav/>
      <List/>
      <Bottom/>
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