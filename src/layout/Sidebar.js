import React from 'react'
import $ from 'jquery'
import { Link } from 'react-router-dom'
import AuthContext from '../contexts/AuthContext'

export default function Sidebar({}){
    const [openMenu, setOpenMenu] = React.useState(null)
    const [activeMenu, setActiveMenu] = React.useState(null)

    const {resources} = React.useContext(AuthContext)

    const handleOpenMenu = key => e => {
        // setOpenMenu(openMenu === key ? null : key)

        const _this = $(e.target).closest("a")
        if($(_this).parent().hasClass('submenu')) {
            e.preventDefault();
        }
        if(!$(_this).hasClass('subdrop')) {
            $('ul', $(_this).parents('ul:first')).slideUp(350);
            $('a', $(_this).parents('ul:first')).removeClass('subdrop');
            $(_this).next('ul').slideDown(350);
            $(_this).addClass('subdrop');
        } else if($(_this).hasClass('subdrop')) {
            $(_this).removeClass('subdrop');
            $(_this).next('ul').slideUp(350);
        }
    }

    const menus = [
        resources["dashboard"] && {
            title: "",
            items: [
                {title: 'Dashboard', className: 'fa fa-dashboard', options: [
                    resources["dashboard.home"] && {to: '/dashboard', title: 'Início'},
                ]},
            ]
        },
        resources["orders"] && {
            title: "",
            items: [
                {title: 'Pedidos', className: 'fa fa-list', options: [
                    resources["orders.calc"] && {to: '/pedidos/calculo', title: 'Para cálculo'},
                    resources["orders.print"] && {to: '/pedidos/impressao', title: 'Para impressão'},
                ]},
            ]
        },
        resources["configs"] && {
            title: "",
            items: [
                {title: 'Configurações', className: 'fa fa-cogs', options: [
                    resources["configs.printers"] && {to: '/configuracoes/impressoras', title: 'Impressoras'},
                    resources["configs.orders"] && {to: '/configuracoes/pedidos', title: 'Pedidos'},
                    resources["configs.users"] && {to: '/configuracoes/usuarios', title: 'Usuários'},
                    resources["configs.others"] && {to: '/configuracoes/outras', title: 'Outras'},
                ]},
            ]
        },
    ]

    React.useEffect(() => {
        let newActiveMenu = null
        menus.filter(m => m).forEach((menu, indexOne) => {
            menu.items.filter(i => i).forEach((item, indexTwo) => {
                const indexActive = item.options.filter(i => i).map(opt => opt.to).indexOf(window.location.pathname)
                if(indexActive !== -1){ newActiveMenu = `${indexOne}-${indexTwo}` }
            })
        })
        setActiveMenu(newActiveMenu)
        setOpenMenu(newActiveMenu)

        setTimeout(() => {
            $('#sidebar-menu ul li.submenu a.active').parents('li:last').children('a:first').addClass('active').trigger('click');
        }, 1200)
    }, [window.location.pathname, menus])

    return <div className="sidebar" id="sidebar">
        <div className="sidebar-inner slimscroll" style={{display: 'flex', flexDirection: 'column'}}>
            <div id="sidebar-menu" className="sidebar-menu" style={{flex: 1}}>
                <ul>
                    {
                        menus
                        .filter(item => item)
                        .map(({title, items}, indexOne) => [
                            <li className="menu-title"> 
                                <span>{title}</span>
                            </li>,
                            ...items
                            .filter(item => item)
                            .map(({title, options, className}, indexTwo) => (
                                <li className="submenu" className={`${indexOne}-${indexTwo}` === activeMenu ? 'active' : ''}>
                                    <a onClick={handleOpenMenu(`${indexOne}-${indexTwo}`)}><i className={className}></i> <span> {title}</span> <span className="menu-arrow"></span></a>
                                    <ul>
                                        {
                                            options
                                            .filter(item => item)
                                            .map(opt => (
                                                <li className={(opt.paths || []).includes(window.location.pathname) ? 'active' : ''}><Link to={opt.to}>{opt.title}</Link></li>
                                            ))
                                        }
                                    </ul>
                                </li>
                            ))
                        ])
                    }
                </ul>
            </div>
            <div style={{padding: '10px 0', fontSize: 13, color: '#6a6a6a', textAlign: 'center'}}>Coalah</div>
        </div>
    </div>
}