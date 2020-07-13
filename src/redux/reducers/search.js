import userTypes from "../types/user";

const { ON_SEARCH } = userTypes

const init_state = {
    cookieChecked: false,
    searchProduct: ""
}

export default (state = init_state, action) => {
    switch (action.type) {
        case ON_SEARCH:
            return { ...state, cookieChecked: true, searchProduct: action.payload };
        default:
            return { ...state };
    }
}