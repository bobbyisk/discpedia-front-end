import userTypes from '../types/user';

const { ON_ADD_QUANTITY_CART } = userTypes;

const init_state = {
    cartData: [],
    quantityCart: 0
}

export default (state = init_state, action) => {
    switch(action.type) {
        case ON_ADD_QUANTITY_CART:
            return { ...state, quantityCart: action.payload };
        default:
            return { ...state };
    }
}