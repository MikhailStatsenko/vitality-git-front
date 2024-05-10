import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../../index";
import PageTemplate from "../../components/PageTemplate/PageTemplate";
import {Breadcrumb, Card, Col, Layout, Row, Spin, Table, Typography} from "antd";
import st from "./RepositoryPage.module.css"
import {observer} from "mobx-react-lite";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import {FileOutlined, FolderOutlined} from "@ant-design/icons";
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
        const updateRepositoryContent = async () => {
            try {
                setRepositoryLoading(true);
                const repositoriesData = await store.files.getRepositoryContents(username, path);
                setContent(repositoriesData);

                handleFileOnReload();
            } catch (error) {
                console.error('Error fetching repository content:', error);
            } finally {
                setRepositoryLoading(false);
            }
        };

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

    const columns = [
        {
            title: 'Содержимое репозитория',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                record.type === 'directory' ?
                    <span><FolderOutlined style={{ marginRight: '8px' }} />{text}</span> :
                    <span><FileOutlined style={{ marginRight: '8px' }} />{text}</span>
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
                                <Link to={"/repositories/" + array.slice(0, index+1).join('/')}>{item}</Link>
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