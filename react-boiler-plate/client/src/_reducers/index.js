// Reducer 역할: 어떻게 State가 변화한지를 보여주고, 변한 값을 리턴
// combineReducers: 여러 Reducer를 rootReducer로 합쳐주는 역할
import { combineReducers } from 'redux';
import user from './user_reducer';

const rootReducer = combineReducers({
    user
})

export default rootReducer;