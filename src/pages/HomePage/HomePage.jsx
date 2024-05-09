import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Context} from "../../index";
import PageTemplate from "../../components/PageTemplate/PageTemplate";
import {Button, Card, Divider, Empty, Form, Input, List, Space} from "antd";
import st from "./HomePage.module.css"
import {Link} from "react-router-dom";
import Search from "antd/es/input/Search";
import {observer} from "mobx-react-lite";
import {PlusCircleOutlined, PlusCircleTwoTone, PlusOutlined} from "@ant-design/icons";


const HomePage = () => {
    const { store } = useContext(Context);

    // Users
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const [usersSearch] = Form.useForm();

    const [firstUserCheckDone, setFirstUserCheckDone] = useState(false);
    const [firstUserFetchDone, setFirstUserFetchDone] = useState(false);

    // Repositories
    const [activeUser, setActiveUser] = useState(store.user);
    const [repositories, setRepositories] = useState([]);
    const [repositoriesLoading, setRepositoriesLoading] = useState(true);

    const [addRepository] = Form.useForm();

    const [firstRepositoriesCheckDone, setFirstRepositoriesCheckDone] = useState(false);
    const [firstRepositoriesFetchDone, setFirstRepositoriesFetchDone] = useState(false);

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

    const updateRepositoriesData = useCallback(async () => {
        if (!firstRepositoriesCheckDone) return;

        try {
            setRepositoriesLoading(true);
            if (!store.isAuth) return

            const username = activeUser?.username ? activeUser.username : store.user.username;

            const repositoriesData = await store.files.getRepositories(username);

            setRepositories(repositoriesData.elements);
        } catch (error) {
            console.error('Error fetching repositories:', error);
        } finally {
            setRepositoriesLoading(false);
        }

        setFirstRepositoriesFetchDone(true);
    }, [firstUserCheckDone, store.files, setFirstRepositoriesFetchDone,
        setRepositories, activeUser, setActiveUser, store.logout, store.isAuth, store.commands]);

    useEffect(() => {
        const fetchData = async () => {
            setFirstRepositoriesCheckDone(true);
            updateRepositoriesData();
        }

        fetchData();
        console.log("fetchRepositoriesData");
    }, [store, setFirstRepositoriesCheckDone, updateRepositoriesData, firstRepositoriesFetchDone,
        activeUser, setActiveUser, store.logout, store.isAuth, store.commands]);


    const handleSearch = async (values) => {
        setSearchQuery(values.search);
    };

    const handleShowAllUsers = async () => {
        usersSearch.resetFields();
        setSearchQuery("");
    }

    const handleAddRepository = async (values) => {
        await store.commands.init(values);
        addRepository.resetFields();
        updateRepositoriesData();
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
                                <div key={user.id} onClick={() => {if (store.isAuth) setActiveUser(user)}}>
                                    <Card hoverable>
                                        <p style={{ margin: 0 }}>{user.username}</p>
                                    </Card>
                                </div>
                            ))}
                        </Space>
                    }
                </Card>

                <Card title={!store.isAuth ?
                    "Репозитории" : activeUser?.username === store.user.username && activeUser.username !== undefined ?
                        "Ваши репозитории" : "Репозитории пользователя " + activeUser?.username} className={st.cardRight}
                      styles={{
                          header: {
                              borderWidth: 0,
                              fontSize: 25
                          },
                          body: {
                              paddingTop: 0
                          }
                      }}
                      loading={repositoriesLoading}

                      extra={
                          activeUser?.username === store.user.username && activeUser.username !== undefined &&
                          <Form form={addRepository} onFinish={handleAddRepository} className={st.addRepository} >
                              <Form.Item name="repositoryName">
                                  <Input placeholder="Название нового репозитория" />
                              </Form.Item>
                              <Form.Item>
                                  <Button type="primary" htmlType="submit">
                                      <PlusOutlined />
                                  </Button>
                              </Form.Item>
                          </Form>
                      }
                >
                    {
                        !store.isAuth &&
                        <p>
                            <Link to={"/login"} className={"link-underline"}>Войдите в аккаунт</Link>, чтобы просмотреть репозитории
                        </p>
                    }
                    {
                        store.isAuth &&
                        <div className={st.repositories}>
                            <List
                                dataSource={repositories}
                                renderItem={item => <List.Item>{item}</List.Item>}
                                locale={{ emptyText: <Empty description="Репозиториев пока нет" /> }}
                            />
                        </div>
                    }
                </Card>
            </div>
        </PageTemplate>
    );
};

export default observer(HomePage);