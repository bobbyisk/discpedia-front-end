import Axios from 'axios';
import { API_URL } from '../../constants/API';
import userTypes from '../types/user';

const { ON_ADD_QUANTITY_CART } = userTypes;

export const addCartQuantity = (quantity) => {
    return {
        type: ON_ADD_QUANTITY_CART,
        payload: quantity
    }
}