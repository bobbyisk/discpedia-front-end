import { combineReducers } from "redux";
import userReducer from "./user";
import searchReducer from "./search";
import qtyCartReducer from "./qtycart";

export default combineReducers({
  user: userReducer,
  search: searchReducer,
  qtyCart: qtyCartReducer
});
