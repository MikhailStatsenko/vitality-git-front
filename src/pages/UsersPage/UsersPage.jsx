import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Context} from "../../index";
import PageTemplate from "../../components/PageTemplate/PageTemplate";
import {Button, Card, Divider, Empty, Form, Input, List, message, Space} from "antd";
import st from "./UsersPage.module.css"
import {observer} from "mobx-react-lite";
import {Navigate, useNavigate} from "react-router-dom";


const UsersPage = () => {
    const navigate = useNavigate();
    const { store } = useContext(Context);

    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const [usersSearch] = Form.useForm();

    const [firstUserCheckDone, setFirstUserCheckDone] = useState(false);
    const [firstUserFetchDone, setFirstUserFetchDone] = useState(false);

    const updateUserData = useCallback(async () => {
        if (!firstUserCheckDone) return;

        try {
            setUsersLoading(true);
            const userData = await store.users.getUsersByPattern(searchQuery);

            setUsers(userData.users);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setUsersLoading(false);
        }

        setFirstUserFetchDone(true);
    }, [firstUserCheckDone, store.users, setFirstUserFetchDone, setUsers, setSearchQuery, searchQuery]);

    useEffect(() => {
        const fetchData = async () => {
            setFirstUserCheckDone(true);
            updateUserData();
        }

        fetchData();
        console.log("fetchUserData");
    }, [store, setFirstUserCheckDone, updateUserData, firstUserFetchDone, setSearchQuery, searchQuery]);



    const handleSearch = async (values) => {
        setSearchQuery(values.search);
    };

    const handleShowAllUsers = async () => {
        usersSearch.resetFields();
        setSearchQuery("");
    }

    const handleNavigateToRepository = async (username) => {
        if (!store.isAuth) {
            message.error("Чтобы просматривать репозитории, войдите в аккаунт");
            return;
        }
        navigate("/repositories/" + username)
    }

    return (
        <PageTemplate title="Home">
            <div className={st.container}>
                <Card title="Пользователи" className={st.cardLeft}
                      loading={usersLoading}
                      styles={{
                          header: {
                              borderWidth: 0,
                              fontSize: 25
                          },
                          body: {
                              paddingTop: 0
                          }
                      }}
                      extra={searchQuery ? <button onClick={handleShowAllUsers}>Показать всех пользователей</button> : ""}
                >
                    <Form form={usersSearch} onFinish={handleSearch} className={st.search}>
                        <Form.Item name="search">
                            <Input placeholder="Введите имя пользователя" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">Найти</Button>
                        </Form.Item>
                    </Form>
                    {
                        users &&
                        <Space direction="vertical"  className={st.usersList}>
                            {users.map((user) => (
                                <div key={user.id} onClick={() => handleNavigateToRepository(user.username)}>
                                    <Card hoverable>
                                        <p style={{ margin: 0 }}>{user.username}</p>
                                    </Card>
                                </div>
                            ))}
                        </Space>
                    }
                </Card>
            </div>
        </PageTemplate>
    );
};

export default observer(UsersPage);