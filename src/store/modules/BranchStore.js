import {makeAutoObservable} from "mobx";
import $api from "../../http";
import {message} from "antd";
import AppStore from "../AppStore";

export default class BranchStore {
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

    getAllBranches = async (username, repository) => {
        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('repository_name', repository);
            const response = await $api.get(`/git/branch/list/${username}/${repository}`);
            return response.data;
        } catch (e) {
            console.log(e);
        }
    }

    createBranch = async (username, repository, branch) => {
        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('repository_name', repository);
            formData.append('branch', branch);
            const response = await $api.post('/git/branch/create', formData);
            message.info('Ветка добавлена')
            return response.data;
        } catch (e) {
            this.rootStore.httpError(e);
        } finally {
            this.isLoading = false;
        }
    }

    switchBranch = async (username, repository, branch) => {
        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('repository_name', repository);
            formData.append('branch', branch);
            const response = await $api.post('/git/branch/switch', formData);
            message.info('Ветка переименована')
            return response.data;
        } catch (e) {
            this.rootStore.httpError(e);
        } finally {
            this.isLoading = false;
        }
    }

    deleteBranch = async (username, repository, branch) => {
        try {
            const response = await $api.delete(`/git/branch/delete/${username}/${repository}/${branch}`);
            message.info('Ветка удалена')
            return response.data;
        } catch (e) {
            this.rootStore.httpError(e);
        } finally {
            this.isLoading = false;
        }
    }

    renameBranch = async (username, repository, branch) => {
        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('repository_name', repository);
            formData.append('branch', branch);
            const response = await $api.put('/git/branch/rename', formData);
            message.info('Ветка переименована')
            return response.data;
        } catch (e) {
            this.rootStore.httpError(e);
        } finally {
            this.isLoading = false;
        }
    }
}