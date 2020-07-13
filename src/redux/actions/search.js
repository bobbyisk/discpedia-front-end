import Axios from "axios";
import userTypes from "../types/user";

const { ON_SEARCH } = userTypes


export const searchProductData = (inputSearchProductData) => {
    return {
        type: ON_SEARCH,
        payload: inputSearchProductData
    }
}