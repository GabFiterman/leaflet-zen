import counterSlice from './counterSlice';
import pointsOfInterestReducer from './pointsOfInterest';

const rootReducer = {
    counter: counterSlice,
    pointsOfInterest: pointsOfInterestReducer,
};

export default rootReducer;
