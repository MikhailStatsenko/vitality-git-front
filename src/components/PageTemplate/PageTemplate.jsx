import React, {useContext, useEffect, useState} from 'react';
import st from "./PageTemplate.module.css"
import {Link} from "react-router-dom";
import {Layout} from "antd";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import {Content, Footer, Header} from "antd/es/layout/layout";
import "../../index.css"

const PageTemplate = ({children, title}) => {
    const {store} = useContext(Context);

    const [user, setUser] = useState({});

    useEffect(() => {
        document.title = title;
    }, [])

    useEffect(() => {
        if (store.isAuth) {
            store.users.getCurrent()
                .then(data => setUser(data));
        }
    }, [store, store.users, user?.username]);

    return (
        <Layout className={st.pageContainer}>
            <Header className={st.header}>
                <h1><Link to="/">VitalityGit</Link></h1>
                <div className={st.headerMenu}>
                    {store.isAuth ? (
                        <>
                            {store.isAuth && <span>{user.username}</span>}
                            <Link to="/" className={st.headerLink} onClick={store.logout}>(Выйти)</Link>
                        </>
                    ) : (
                        <>
                            <Link className={st.headerLink} to="/login">Вход</Link>
                            <span className={st.separator}>|</span>
                            <Link className={st.headerLink} to="/register">Регистрация</Link>
                        </>
                    )}
                </div>
            </Header>

            <Content className={st.content}>
                {children}
            </Content>

            <Footer
                style={{
                    textAlign: 'center',
                    borderTop: "2px solid black",
                    padding: 3
                }}
            >
                VitalityGit ©{new Date().getFullYear()} Created by Mikhail Statsenko
            </Footer>
        </Layout>
    );
};

export default observer(PageTemplate);