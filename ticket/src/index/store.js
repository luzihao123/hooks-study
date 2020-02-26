import {
  createStore,
  combineReducers,
  applyMiddleware
} from 'redux'

import reducers from './reducers'
import thunk from 'redux-thunk'

console.log(typeof reducers)
export default createStore(
  combineReducers(reducers),
  {
    from: '北京',
    to: '上海',
    isCitySelectorVisible: false,
    currentSelectingLeftCity: false,
    cityData: null,
    departDate: Date.now(),
    isLoadingCityData: false,
    isDateSelectorVisible: false,
    highSpeed: false
  },
  applyMiddleware(thunk)
)