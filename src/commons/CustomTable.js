import React from 'react'
import { CircularProgress, IconButton, TablePagination, TableFooter, TableHead } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add'

export default class CustomTable extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            rowsPerPage: props.rowsPerPage || 100,
            page: 0,
            expandedIndex: null,
        }
    }

    renderHeader() {
        return <thead>
            <tr>
                {
                    this.props.renderExpandedRow && 
                    <th style={{width: 50}}></th>
                }
                {(this.props.columns || []).map(column => {
                    return <th style={{...column.style, fontWeight: 'bold'}}>
                        {column.title || column.key}
                    </th>
                })}
            </tr>
        </thead>
    }

    renderItem = ({item, index}) => {
        return [
            <tr 
                // hover={!!this.props.onClickRow} 
                style={{cursor: !!this.props.onClickRow && 'pointer'}}
            >
                {
                    this.props.renderExpandedRow && 
                    <td>
                        <IconButton 
                            onClick={(event) => { 
                                this.props.onExpand && this.props.onExpand(item)(event)
                                this.setState({expandedIndex: this.state.expandedIndex === index ? null : index}) 
                            }}
                        >
                            <AddIcon/>
                        </IconButton>
                    </td>
                }
                {(this.props.columns || []).map(column => {
                    return <td 
                        onClick={column.onClick ? column.onClick(item) : this.props.onClickRow && this.props.onClickRow({item, index})} 
                        style={{...this.props.columnsStyle && this.props.columnsStyle(item), ...column.style}}
                    >
                        {
                            column.render
                            ? column.render(item[column.key], item, index)
                            : item[column.key]
                        }
                    </td>
                    })
                }
            </tr>,
            this.state.expandedIndex === index &&
            <tr>
                <td colSpan={this.props.columns.length + 1} style={{padding: 20, background: '#F9F9F9'}}>
                    {this.props.renderExpandedRow(item)}
                </td>
            </tr>
        ]
    }

    renderPagination(type){
        let {rowsPerPage, page} = this.state
        let {data, title} = this.props

        const Item = type === "footer" ? TableFooter : TableHead

        return <Item>
            <TablePagination 
                    labelRowsPerPage={`${title ? title : 'Itens'} por página`}
                    rowsPerPage={rowsPerPage} 
                    count={data.length}
                    page={page}
                    onChangeRowsPerPage={({target}) => { this.setState({rowsPerPage: target.value}) }}
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    onChangePage={(event, page) => { this.setState({page: page}) }}
                    />
        </Item>
    }

    render(){
        let {rowsPerPage, page} = this.state
        let {loading, data, showHeader, paginationTop = true, paginationBottom = true, height} = this.props

        return loading
            ? <div align="center"><CircularProgress /></div>
            : <div className="table-responsive">
                <table className="table table-striped custom-table mb-0">
                    {paginationTop && this.renderPagination("header") }
                    {(showHeader || showHeader === undefined || showHeader === null) && this.renderHeader()}
                    <tbody>
                        {
                            data
                            .filter((item, index) =>{
                                return (
                                    index >= (page * rowsPerPage) &&
                                    index < ((page + 1) * rowsPerPage)
                                    )
                                })
                            .map((item, index) => this.renderItem({item, index}))
                            .reduce((pv, arr) => pv.concat(arr), [])
                        }
                    </tbody>
                    {paginationBottom && this.renderPagination("footer") }
            </table>
        </div>
    }
}