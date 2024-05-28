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

    downloadRepositoryArchive = async (username, repositoryName) => {
        try {
            const response = await $api.get(`/file/download/${username}${repositoryName}`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${repositoryName}.zip`);
            document.body.appendChild(link);
            link.click();
        } catch (e) {
            console.log(e);
        }
    }

    createNewDirectory = async (username, path, name) => {
        console.log(`/file/add-directory/${username}/${path}?name=${name}`)
        try {
            const response = await $api.post(`/file/add-directory/${username}${path}?name=${name}`);
            return response.data;
        } catch (e) {
            console.log(e);
        }
    }

    async uploadFiles(userId, requestPath, files) {
        try {
            const formData = new FormData();
            formData.append('files', files);

            const response = await $api.post(
                `/file/upload/${userId}${requestPath}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            this.uploadResponse = response.data;
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    }
}
