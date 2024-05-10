import React, {useContext, useEffect} from 'react';
import {Context} from "../../index";
import {Button, Card, Form, Input} from "antd";
import {Link, useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";
import st from "./Auth.module.css"
import PageTemplate from "../../components/PageTemplate/PageTemplate";
import "../../index.css"

const LoginPage = () => {
    const {store} = useContext(Context);

    const [form] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        if (store.isAuth) {
            navigate('/');
        }
    }, [navigate, store.isAuth]);

    return (
        <PageTemplate title={"Вход"}>
            <Card className={st.formCard} title={'Вход в аккаунт'}
                  styles={{
                      header: {
                          borderWidth: 2,
                          borderTop: "unset",
                          borderLeft: "unset",
                          borderRight: "unset",
                          borderColor: "black"
                      }
                    }}
                  extra={<Link to={'/register'} className={"link"}>Регистрация</Link>} >
                <Form
                    form={form}
                    name="login"
                    onFinish={store.users.login}
                    scrollToFirstError
                    autoComplete={'off'}
                    layout="vertical"
                >

                    <Form.Item
                        name="username"
                        label="Имя пользователя"
                        rules={[
                            {
                                required: true,
                                message: 'Введите имя пользователя'
                            },
                            {
                                min: 5,
                                message: 'Минимальная длина 4 символа'
                            },
                            {
                                max: 50,
                                message: 'Максимальная длина 50 символов'
                            }
                        ]}
                    >
                        <Input className={st.input}/>
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Пароль"
                        rules={[
                            {
                                required: true,
                                message: 'Введите пароль',
                            },
                            {
                                min: 8,
                                message: 'Минимальная длина 8 символов'
                            },
                            {
                                max: 255,
                                message: 'Максимальная длина 255 символов'
                            }
                        ]}
                        hasFeedback
                    >
                        <Input.Password className={st.input}/>
                    </Form.Item>

                    <Form.Item>
                        <Button className={st.button}
                                loading={store.users.isLoading}
                                htmlType="submit"
                                type="primary"
                        >
                            Войти
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </PageTemplate>
    );
};

export default observer(LoginPage);