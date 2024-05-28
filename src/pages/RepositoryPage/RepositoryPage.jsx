import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../../index";
import PageTemplate from "../../components/PageTemplate/PageTemplate";
import {Breadcrumb, Layout, message, Spin, Table, Upload} from "antd";
import st from "./RepositoryPage.module.css"
import {observer} from "mobx-react-lite";
import {Link, useLocation, useParams} from "react-router-dom";
import {
    BranchesOutlined,
    DownloadOutlined,
    FileOutlined, FolderAddOutlined,
    FolderOutlined,
    PlusOutlined,
    UploadOutlined
} from "@ant-design/icons";
import FileViewer from "../../components/FileViewer/FileViewer";


const { Content } = Layout;

const RepositoryPage = () => {
    const { username } = useParams();
    const location = useLocation();
    const path = location.pathname.replace(`/repositories/${username}`, '');

    const { store } = useContext(Context);

    const [content, setContent] = useState([]);
    const [repositoryLoading, setRepositoryLoading] = useState(false);

    const [fileContent, setFileContent] = useState('');
    const [isReadingFile, setIsReadingFile] = useState(false);

    useEffect(() => {
        updateRepositoryContent();
    }, [store, username, path]);

    const handleFileOnReload = async () =>{
        const content = await store.files.getRepositoryContents(username, path);
        if (typeof content === "string") {
            try {
                setRepositoryLoading(true);
                setIsReadingFile(true);
                setFileContent(content);
            } catch (error) {
                console.error('Error fetching file content:', error);
            } finally {
                setTimeout(() =>  setRepositoryLoading(false), 100)
            }
        }
    }

    const handleDownloadRepositoryArchive = async () => {
        try {
            setRepositoryLoading(true);
            await store.files.downloadRepositoryArchive(username, path);
        } catch (error) {
            console.error('Error downloading repository archive:', error);
        } finally {
            setRepositoryLoading(false);
        }
    };

    const handleFileClick = async (fileName) => {
        const name = fileName.props.children;
        if (content[name] === 'file') {
            try {
                setRepositoryLoading(true);
                const fileContent = await store.files.getRepositoryContents(username, path + '/' + name);

                setFileContent(fileContent);
                setIsReadingFile(true);
            } catch (error) {
                console.error('Error fetching file content:', error);
            } finally {
                setRepositoryLoading(false);
            }
        }
    };

    useEffect(() => {
        setIsReadingFile(false);
    }, [location.pathname])

    const updateRepositoryContent = async () => {
        try {
            setRepositoryLoading(true);
            const repositoriesData = await store.files.getRepositoryContents(username, path);
            setContent(repositoriesData);
            await handleFileOnReload();
        } catch (error) {
            console.error('Ошибка получения содержимого репозитория:', error);
        } finally {
            setRepositoryLoading(false);
        }
    };

    const handleFileUpload = async (options) => {
        const { onSuccess, onError, file } = options;
        try {
            const formData = new FormData();
            formData.append('files', file);

            await store.files.uploadFiles(username, path, file);
            onSuccess();
            await updateRepositoryContent()
            message.success(`Файлы успешно загружены`);
        } catch (error) {
            console.error('Ошибка загрузки файла:', error);
            onError();
            message.error('Ошибка при загрузке файла');
        }
    };

    const uploadProps = {
        customRequest: handleFileUpload,
        showUploadList: false,
        multiple: true,
    };

    const handleCreateDirectory = async () => {
        try {
            const newDirectoryName = prompt('Введите название новой директории:');
            if (newDirectoryName) {
                await store.files.createNewDirectory(username, path, newDirectoryName);
                await updateRepositoryContent();
                message.success('Новая директория успешно создана');
            }
        } catch (error) {
            console.error('Ошибка при создании новой директории:', error);
            message.error('Ошибка при создании новой директории');
        }
    };

    const columns = [
        {
            title: (
                <div className={"w-full flex justify-between align-middle"}>
                    <span>Содержимое репозитория</span>
                    <div className={"float-right w-1/5 flex justify-between"}>
                        <DownloadOutlined className="link" onClick={handleDownloadRepositoryArchive} style={{fontSize: '24px'}}/>
                        <Upload {...uploadProps}>
                            <UploadOutlined className="link" multiple={true} style={{fontSize: '24px', marginLeft: '8px'}}/>
                        </Upload>
                            <FolderAddOutlined className="link" onClick={handleCreateDirectory} style={{fontSize: '24px', marginLeft: '8px', cursor: 'pointer'}}/>
                        <Link to={`/repositories/${username}${path}/branches`} className="link">
                            <BranchesOutlined style={{fontSize: '24px'}}/>
                        </Link>
                    </div>
                </div>
            ),
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                record.type === 'directory' ?
                    <span><FolderOutlined style={{marginRight: '8px'}}/>{text}</span> :
                    <span><FileOutlined style={{marginRight: '8px'}}/>{text}</span>
            )
        }
    ];

    const dataSource = Object.keys(content).map(key => ({
        key,
        name: <Link to={"/repositories/" + username + path + "/" + key} className="link">{key}</Link>,
        type: content[key],
    }));

    return (
        <PageTemplate title={"Репозиторий " + path.split("/")[1]}>
            <Layout className={st.layout}>
                <Breadcrumb
                    className={st.breadcrumb}
                    items={(username + path).split("/").map((item, index, array) => (
                        {
                            title: index !== array.length - 1 ?
                                <Link to={"/repositories/" + array.slice(0, index + 1).join('/')}>{item}</Link>
                                : item
                        }
                    ))}
                >
                </Breadcrumb>

                <Content className={st.content}>
                    {repositoryLoading ? (
                        <Spin size="large" />
                    ) : isReadingFile ? (
                        <FileViewer fileContent={fileContent}></FileViewer>
                    ) : (
                        <Table
                            className={st.table}
                            dataSource={dataSource}
                            columns={columns}
                            pagination={false}
                            onRow={(record) => {
                                return {
                                    onClick: () => handleFileClick(record.name),
                                };
                            }}
                        />
                    )}
                </Content>
            </Layout>
        </PageTemplate>
    );
};

export default observer(RepositoryPage);