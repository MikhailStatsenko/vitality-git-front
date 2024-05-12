import {makeAutoObservable} from "mobx";
import $api from "../../http";
import {message} from "antd";
import AppStore from "../AppStore";

export default class CommandsStorage {
    rootStore: AppStore;

    isLoadingState = false;

    constructor(rootStore: AppStore) {
        makeAutoObservable(this);
        this.rootStore = rootStore;
    }

    get isLoading() {
        return this.isLoadingState;
    }

    set isLoading(state) {
        this.isLoadingState = state;
    }

    init = async (values) => {
        try {
            const formData = new FormData();
            formData.append('username', this.rootStore.user.username);
            formData.append('repository_name', values.repositoryName);
            const response = await $api.post('/git/init', formData);
            message.success('Репозиторий успешно создан')
            return response.data;
        } catch (e) {
            this.rootStore.httpError(e);
        } finally {
            this.isLoading = false;
        }
    }
}