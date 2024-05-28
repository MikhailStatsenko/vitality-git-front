import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../../index";
import PageTemplate from "../../components/PageTemplate/PageTemplate";
import {Breadcrumb, Layout, Spin, Table} from "antd";
import st from "./BranchesPage.module.css"
import {observer} from "mobx-react-lite";
import {Link, useLocation, useParams} from "react-router-dom";
import {FileOutlined, FolderOutlined} from "@ant-design/icons";
import FileViewer from "../../components/FileViewer/FileViewer";
import { List, Button, Modal, Input, Form, message } from 'antd';

const BranchesPage = () => {
    const { username, repository } = useParams();
    const { store } = useContext(Context);
    const [branches, setBranches] = useState([]);
    const [currentBranch, setCurrentBranch] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newBranch, setNewBranch] = useState('');

    useEffect(() => {
        const fetchBranches = async () => {
            store.branches.isLoading = true;
            const data = await store.branches.getAllBranches(username, repository);
            if (data) {
                setBranches(data.branches);
                setCurrentBranch(data.current_branch);
            }
            store.branches.isLoading = false;
        };

        fetchBranches();
    }, [username, repository, store.branches]);

    const handleCreateBranch = async () => {
        if (!newBranch) {
            message.error('Введите имя новой ветки');
            return;
        }
        await store.branches.createBranch(username, repository, newBranch);
        setIsModalVisible(false);
        setNewBranch('');
        const data = await store.branches.getAllBranches(username, repository);
        if (data) {
            setBranches(data.branches);
            setCurrentBranch(data.current_branch);
        }
    };

    const handleSwitchBranch = async (branch) => {
        await store.branches.switchBranch(username, repository, branch);
        const data = await store.branches.getAllBranches(username, repository);
        if (data) {
            setBranches(data.branches);
            setCurrentBranch(data.current_branch);
        }
    };

    const handleDeleteBranch = async (branch) => {
        await store.branches.deleteBranch(username, repository, branch);
        const data = await store.branches.getAllBranches(username, repository);
        if (data) {
            setBranches(data.branches);
            setCurrentBranch(data.current_branch);
        }
    };

    return (
        <PageTemplate title={"Ветки"}>
            <div className="flex flex-col items-center">
                <div className="mb-4 text-lg font-bold">
                    Текущая ветка: {currentBranch}
                </div>
                <Button type="primary" onClick={() => setIsModalVisible(true)} className="mb-4">
                    Создать новую ветку
                </Button>
                <List
                    bordered
                    loading={store.branches.isLoading}
                    dataSource={branches}
                    renderItem={branch => (
                        <List.Item
                            actions={[
                                <Button onClick={() => handleSwitchBranch(branch)}>Переключить</Button>,
                                <Button danger onClick={() => handleDeleteBranch(branch)}>Удалить</Button>
                            ]}
                        >
                            {branch}
                        </List.Item>
                    )}
                />
            </div>
            <Modal
                title="Создать новую ветку"
                open={isModalVisible}
                onOk={handleCreateBranch}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form>
                    <Form.Item label="Имя новой ветки">
                        <Input
                            value={newBranch}
                            onChange={(e) => setNewBranch(e.target.value)}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </PageTemplate>
    );
};

export default observer(BranchesPage);