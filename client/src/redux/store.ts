import { applyMiddleware, combineReducers, legacy_createStore as createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import postsReducer from "./reducers/posts.reducer";
import themeReducer from "./reducers/theme.reducer";
import userReducer from "./reducers/user.reducer";

const allReducers = combineReducers({
	person: userReducer,
	posts: postsReducer,
	theme: themeReducer
});

const store = createStore(allReducers, composeWithDevTools(applyMiddleware(thunk)));

export default store;