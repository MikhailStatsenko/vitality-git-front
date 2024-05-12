import {makeAutoObservable} from "mobx";
import $api from "../../http";
import AppStore from "../AppStore";

export default class FileStore {
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

    getRepositories = async (username) => {
        try {
            const response = await $api.get('/file/' + username);
            return response.data;
        } catch (e) {
            console.log(e);
        }
    }

    getRepositoryContents = async (username, path) => {
        try {
            const response = await $api.get('/file/' + username + path);
            return response.data;
        } catch (e) {
            console.log(e);
        }
    }
}