import { applyMiddleware, combineReducers, legacy_createStore as createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import userReducer from "./reducers/user.reducer";

const allReducers = combineReducers({
	person: userReducer
});

const store = createStore(allReducers, composeWithDevTools(applyMiddleware(thunk)));

export default store;