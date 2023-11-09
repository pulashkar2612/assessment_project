import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { alertActions } from '_store';
import { history, history1,  fetchWrapper } from '_helpers';
import { useNavigate } from 'react-router-dom';

// create slice

const name = 'auth';
const initialState = createInitialState();
const reducers = createReducers();
const extraActions = createExtraActions();
const slice = createSlice({ name, initialState, reducers });

// exports

export const authActions = { ...slice.actions, ...extraActions };
export const authReducer = slice.reducer;


// implementation

function createInitialState() {
    return {
        // initialize state from local storage to enable user to stay logged in
        value: JSON.parse(localStorage.getItem('auth'))
    }
}

function createReducers() {
    return {
        setAuth
    };

    function setAuth(state, action) {
        state.value = action.payload;
    }
}

function createExtraActions() {
    const baseUrl = `${process.env.REACT_APP_API_URL}/users`;

    return {
        login: login(),
        logout: logout()
    };

    function login() {
       
        return createAsyncThunk(
            `${name}/login`,
            async function ({ username, password, loginTime, clientIp }, { dispatch }) {
                dispatch(alertActions.clear());
                try {
                    const user = await fetchWrapper.post(`${baseUrl}/authenticate`, { username, password, loginTime, clientIp });

                    // set auth user in redux state
                    dispatch(authActions.setAuth(user));

                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('auth', JSON.stringify(user));
                    const storedAuth = JSON.parse(localStorage.getItem('auth'));
                    const role = storedAuth && storedAuth.user && storedAuth.user.role;
                    console.log("role", typeof role, role);

                    // get return url from location state or default to home page
                    //const { from } = history.location.state || { from: { pathname: '/' } };
                    if (role === 'AUDITOR') {
                        console.log("audit");
                        history1.navigate('/audit');
                    } else {
                        console.log("home");
                        history1.navigate('/');
                    }
                } catch (error) {
                    dispatch(alertActions.error(error));
                }
            }
        );
    }

    function logout() {
        return createAsyncThunk(
            `${name}/logout`,
            async function (arg, { dispatch }) {
                try {
                    //const user = localStorage.getItem('auth');
                    const storedAuth = JSON.parse(localStorage.getItem('auth'));
                    const token = storedAuth && storedAuth.token;
                    const userId = storedAuth && storedAuth.user && storedAuth.user._id;
                    console.log(userId);
                    const response = await fetch(`${baseUrl}/logout/${userId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    const result = await response.json();
                    console.log(result);
                } catch (err) {
                    console.log(err);
                }

                dispatch(authActions.setAuth(null));
                localStorage.removeItem('auth');
                history.navigate('/account/login');
            }
        );
    }
}