import Axios from "axios";
// import { API_URL } from "../../constants/API";
import Cookie from "universal-cookie";
import userTypes from "../types/user";
import { faUserGraduate } from "@fortawesome/free-solid-svg-icons";

const API_URL = `http://localhost:8000`;
const { ON_LOGIN_FAIL, ON_LOGIN_SUCCESS, ON_LOGOUT_SUCCESS, ON_SEARCH } = userTypes;

const cookieObj = new Cookie();

export const loginHandler = (userData) => {
    return (dispatch) => {
        const { username, password } = userData;

        Axios.get(`${API_URL}/user/login`, {
            params: {
                username,
                password,
            },
        })
            .then((res) => {
                console.log(res.data);
                console.log(res.data.length);
                    dispatch({
                        type: ON_LOGIN_SUCCESS,
                        payload: res.data,
                    });
            })
            .catch((err) => {
                console.log(err);
                alert("Gaada");
                dispatch({
                    type: ON_LOGIN_FAIL,
                    payload: "Username atau password salah",
                });
            });
    };
};

export const userKeepLogin = (userData) => {
    return (dispatch) => {
        Axios.get(`${API_URL}/user/keeplogin`, {
            params: {
                id: userData.id,
            },
        })
            .then((res) => {
                dispatch({
                    type: ON_LOGIN_SUCCESS,
                    payload: res.data,
                });
            })
            .catch((err) => {
                console.log(err);
                dispatch({
                    type: ON_LOGIN_FAIL,
                    payload: "Username atau password salah",
                });
            });
    };
};

export const logoutHandler = () => {
    cookieObj.remove("authData", { path: "/" });
    return {
        type: ON_LOGOUT_SUCCESS,
    };
};

export const registerHandler = (userData) => {
    console.log("masuk");
    return (dispatch) => {
        Axios.get(`${API_URL}/user/username`, {
            params: {
                username: userData.username,
                // email: userData.email
            },
        })
            .then((res) => {
                console.log(res.data);
                console.log(res.data.length);
                if (res.data.length > 0) {
                    alert("Udah ada");
                    dispatch({
                        type: "ON_REGISTER_FAIL",
                        payload: "Username atau email sudah digunakan",
                    });
                } else {
                    Axios.post(`${API_URL}/user`, { ...userData, role: "user" })
                        .then((res) => {
                            console.log(res.data);
                            dispatch({
                                type: ON_LOGIN_SUCCESS,
                                payload: res.data,
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                            console.log("masuk post");
                        });
                }
            })
            .catch((err) => {
                console.log(err);
                console.log("masuk get");
            });
    };
};

export const cookieChecker = () => {
    return {
        type: "COOKIE_CHECK",
    };
};

export const fillCart = (userId) => {
    return (dispatch) => {
        Axios.get(`${API_URL}/cart/user/${userId}`)
        .then(res => {
            console.log(res.data)
            dispatch({
                type: "FILL_CART",
                payload: res.data.length
            })
        })
        .catch(err => {
            console.log(err);
        })
    }
}