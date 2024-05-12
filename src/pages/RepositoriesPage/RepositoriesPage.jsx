import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../../index";
import PageTemplate from "../../components/PageTemplate/PageTemplate";
import {Button, Card, Empty, Form, Input, List} from "antd";
import st from "./RepositoriesPage.module.css"
import {observer} from "mobx-react-lite";
import {Link, useParams} from "react-router-dom";
import {PlusOutlined} from "@ant-design/icons";


const RepositoriesPage = () => {
    const { username } = useParams();
    const { store } = useContext(Context);

    const [repositories, setRepositories] = useState([]);
    const [repositoriesLoading, setRepositoriesLoading] = useState(true);

    const [addRepository] = Form.useForm();

    const [firstRepositoriesCheckDone, setFirstRepositoriesCheckDone] = useState(false);
    const [firstRepositoriesFetchDone, setFirstRepositoriesFetchDone] = useState(false);

    const updateRepositoriesData = async () => {

        try {
            setRepositoriesLoading(true);

            console.log("updateRepositoriesData")
            const repositoriesData = await store.files.getRepositories(username);

            setRepositories(repositoriesData.elements);
        } catch (error) {
            console.error('Error fetching repositories:', error);
        } finally {
            setRepositoriesLoading(false);
        }

        setFirstRepositoriesFetchDone(true);
    };

    useEffect(() => {
       updateRepositoriesData();
        console.log("fetchRepositoriesData");
    }, [store, setFirstRepositoriesCheckDone,  firstRepositoriesFetchDone, store.commands]);


    const handleAddRepository = async (values) => {
        await store.commands.init(values);
        addRepository.resetFields();
        updateRepositoriesData();
    }

    return (
        <PageTemplate title={"Репозитории пользователя " + username}>
            <div className={st.container}>
                <Card title={!store.isAuth ?
                    "Репозитории" : store.user.username === username ?
                        "Ваши репозитории" : "Репозитории пользователя " + username}
                      className={st.cardRight}
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
                          store.user.username === username &&
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
                                renderItem={item => <List.Item><Link className={"link"} to={"/repositories/" + username + "/" + item}>{item}</Link></List.Item>}
                                locale={{ emptyText: <Empty description="Репозиториев пока нет" /> }}
                            />
                        </div>
                    }
                </Card>
            </div>
        </PageTemplate>
    );
};

export default observer(RepositoriesPage);