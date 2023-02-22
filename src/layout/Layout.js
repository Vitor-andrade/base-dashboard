import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import Content from './Content'

export default function Layout({}){
    return <div className="main-wrapper">
        <Header />
        <Sidebar />

        <div className="page-wrapper">
            <Content />
        </div>
    </div>

}