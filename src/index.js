import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import AppStore from "./store/AppStore";
import {ConfigProvider} from "antd";
import ruRU from "antd/lib/locale/ru_RU";


const root = ReactDOM.createRoot(document.getElementById('root'));

const store = new AppStore();

export const Context = createContext({
    store,
})

root.render(
    <React.StrictMode>
        <Context.Provider value={{store}}>
            <ConfigProvider theme={{
                token: {
                    colorPrimary: '#fbbf24',
                    colorBgContainer: '#FAFAFAFF',
                }
            }} locale={ruRU}>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
            </ConfigProvider>
        </Context.Provider>
    </React.StrictMode>
);