import React, { Suspense } from 'react'
import {
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import { CFade } from '@coreui/react'

// routes config
import routes from '../routes'
import AuthContext from '../contexts/AuthContext'
  
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

const Content = () => {
  const {resources} = React.useContext(AuthContext)
  return (
    <div className="content container-fluid" style={{overflow: 'auto'}}>
        <Suspense fallback={loading}>
          <Switch>
            {routes.map((route, idx) => {
              return route.component && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  render={props => (
                    <CFade>
                      <route.component {...props} />
                    </CFade>
                  )} />
              )
            })}
            {
              resources["dashboard"]
              ? <Redirect from="/" to="/dashboard" />
              : resources["orders.calc"]
                ? <Redirect from="/" to="/pedidos/calculo" />
                : <Redirect from="/" to="/pedidos/impressao" />
            }
          </Switch>
        </Suspense>
    </div>
  )
}

export default React.memo(Content)
