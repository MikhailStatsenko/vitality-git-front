import UserStore from "./modules/UserStore";
import {makeAutoObservable} from "mobx";
import {message, notification} from "antd";
import FileStore from "./modules/FileStore";
import CommandsStorage from "./modules/CommandsStorage";


export default class AppStore {
    users = new UserStore(this);
    files = new FileStore(this);
    commands = new CommandsStorage(this);

    userState = null;
    isAuthState = false;

    get user() {
        return this.userState;
    }

    set user(value) {
        this.userState = value;
    }

    get isAuth () {
        return this.isAuthState;
    }

    set isAuth (value) {
        this.isAuthState = value;
    }

    constructor() {
        makeAutoObservable(this, {
                users: false,
                files: false,
                commands: false,
            },
            {
                deep: true
            });
        this.checkAuth();
    }

    checkAuth = () => {
        const token = localStorage.getItem("token");
        if (token) {
            this.loadUser(token);
        }
    }

    loadUser = (token) => {
        const username = JSON.parse(atob(token.split('.')[1])).sub;
        this.user = {username}
        this.isAuth = true;
    }

    logout = () => {
        console.log('logout');
        localStorage.removeItem('token');
        this.user = null;
        this.isAuth = false;
    }

    httpError = (e) => {
        const msg = 'Ошибка сервера';
        if (e.response) {
            switch (e.response?.status) {
                case 400 || 401:
                    if (e.response.data?.title === 'Constraint Violation') {
                        notification.error({
                            message: 'Ошибка валидации данных',
                            description: e.response.data?.violations?.map(v => <p>{v.message}</p>),
                        }, 10);
                    } else {
                        notification.error({
                            message: e.response.data?.title,
                            description: e.response.data?.detail,
                        }, 10);
                    }
                    break;
                case 403:
                    message.error('Недостаточно прав');
                    break;
                case 404:
                    message.error('Не найдено');
                    break;
                default:
                    notification.error({
                        message: e.response.data.title,
                        description: e.response.data.detail,
                    }, 10);
            }
        } else {
            message.error(msg);
        }
    }
}