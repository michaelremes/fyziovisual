import React, { Component } from "react";

import { Table } from 'antd';


class AntTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            searchedColumn: '',
        };
    };

    render() {
        const data = this.props.data;
        const isLoading = this.props.isLoading;

        const columns = [];
        const array = this.props.columns;

        for (const elem of array) {
            if (elem.key === 'action') {
                columns.push(elem)
            }
            else {
                columns.push(
                    {
                        title: elem.title,
                        dataIndex: elem.dataIndex,
                        key: elem.key,
                        render: text => <a>{text}</a>,
                        sorter: (a, b) => a[elem.dataIndex].localeCompare(b[elem.dataIndex]),
                    }
                )
            }
        }




        return (
            <div>
                <Table columns={columns} dataSource={data} loading={isLoading} rowKey="_id"/>
            </div>
        );

    }
}

export default AntTable;