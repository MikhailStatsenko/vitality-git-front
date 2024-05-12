import {Card, Col, Row} from "antd";
import React from "react";
import st from "./FileViewer.module.css"

const FileViewer = ({ fileContent }) => {
    const lines = fileContent.split('\n');

    return (
        <Card title="Содержимое файла">
            <Row gutter={[16, 16]} style={{ paddingTop: 10 }}>
                <Col flex="5%">
                    {lines.map((_, index) => (
                        <div key={index} style={{ textAlign: 'right', minHeight: '1.2em' }}>
                            {index + 1}
                        </div>
                    ))}
                </Col>
                <Col flex="auto">
                    <pre className={st.pre}>
                        {lines.map((line, index) => (
                            <div key={index} style={{ minHeight: '1.2em' }}>
                                {line || <>&nbsp;</>}
                            </div>
                        ))}
                    </pre>
                </Col>
            </Row>
        </Card>
    );
};

export default FileViewer;