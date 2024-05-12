import {makeAutoObservable} from "mobx";
import $api from "../../http";
import {message} from "antd";
import AppStore from "../AppStore";

export default class UserStore {
    rootStore: AppStore;

    isLoading = false;

    constructor(rootStore: AppStore) {
        makeAutoObservable(this);
        this.rootStore = rootStore;
    }

    get isLoadingState() {
        return this.isLoading;
    }

    set isLoadingState(state) {
        this.isLoading = state;
    }


    register = async (values) => {
        try {
            this.isLoadingState = true;
            delete values.confirm;
            const response = await $api.post('/auth/register', values);
            localStorage.setItem('token', response.data.token);
            this.rootStore.loadUser(response.data.token);
            message.info('Добро пожаловать, ' + this.rootStore.user.username + "!");
        } catch (e) {
            this.rootStore.httpError(e);
        } finally {
            this.isLoadingState = false;
        }
    }

    login = async (values) => {
        try {
            this.isLoadingState = true;
            const response = await $api.post('/auth/login', values);
            localStorage.setItem('token', response.data.token);
            this.rootStore.loadUser(response.data.token);

            message.info('С возращением, ' + this.rootStore.user.username + "!");
        } catch (e) {
            this.rootStore.httpError(e);
        } finally {
            this.isLoadingState = false;
        }
    }

    getAll = async () => {
        try {
            const response = await $api.get('/user/all');
            return response.data;
        } catch (e) {
            console.log(e);
        }
    }

    getUsersByPattern = async (pattern) => {
        try {
            const response = await $api.get('/user/pattern?pattern=' + pattern);
            return response.data;
        } catch (e) {
            console.log(e);
        }
    }

    getCurrent = async () => {
        try {
            const response = await $api.get('/user/current');
            return response.data;
        } catch (e) {
            console.log(e);
        }
    }
}