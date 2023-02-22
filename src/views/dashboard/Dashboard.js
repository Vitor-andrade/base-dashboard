import React, { lazy } from 'react'
import AuthContext from '../../contexts/AuthContext'
import { CircularProgress, Grid } from '@material-ui/core'
import AppContext from '../../contexts/AppContext'
import ClientContext from '../../contexts/ClientContext'

const Dashboard = () => {
  const {currentUser, resources} = React.useContext(AuthContext)
  const {message} = React.useContext(AppContext)
  const {apiRequest} = React.useContext(ClientContext)
  const [statistics, setStatistics] = React.useState({})
  const [loadingStatistics, setLoadingStatistics] = React.useState(true)
  const [periodStatistics, setPeriodStatistics] = React.useState({})
  const [loadingPeriodStatistics, setLoadingPeriodStatistics] = React.useState(true)
  const [loadingFilters, setLoadingFilters] = React.useState(true)
  const [filters, setFilters] = React.useState([])

  React.useEffect(() => {
    setLoadingStatistics(true)
    
    apiRequest("GET", "/statistics/general")
    .then(res => {
      setLoadingStatistics(false)
      setStatistics(res)
    })
    .catch(err => {
      setLoadingStatistics(false)
      message.error(err.message)
    })
  }, [])
  
  return (
    <div>
      {/* <div className="page-header">
        <div className="row">
          <div className="col-sm-12">
            <h3 className="page-title">Bem vindo {{...currentUser}.name}!</h3>
            <ul className="breadcrumb">
              <li className="breadcrumb-item active">Início</li>
            </ul>
          </div>
        </div>
      </div> */}
    
      <Grid justify="center" container spacing={1}>
        {resources["dashboard.home.news"] && <Grid item sm={6} md={6} lg={3} xl={3}>
          <div className="card dash-widget">
            <div className="card-body">
              <span className="dash-widget-icon"><i className="fa fa-cubes"></i></span>
              <div className="dash-widget-info">
                <h3>{loadingPeriodStatistics ? <CircularProgress size={22} /> : periodStatistics.news}</h3>
                <span>NOVOS PEDIDOS</span>
              </div>
            </div>
          </div>
        </Grid>}
        {resources["dashboard.home.finished"] && <Grid item sm={6} md={6} lg={3} xl={3}>
          <div className="card dash-widget">
            <div className="card-body">
              <span className="dash-widget-icon"><i className="fa fa-usd"></i></span>
              <div className="dash-widget-info">
                <h3>{loadingPeriodStatistics ? <CircularProgress size={22} /> : periodStatistics.finisheds}</h3>
                <span>FINALIZADOS</span>
              </div>
            </div>
          </div>
        </Grid>}
        {resources["dashboard.home.producing"] && <Grid item sm={6} md={6} lg={3} xl={3}>
          <div className="card dash-widget">
            <div className="card-body">
              <span className="dash-widget-icon"><i className="fa fa-diamond"></i></span>
              <div className="dash-widget-info">
                <h3>{loadingPeriodStatistics ? <CircularProgress size={22} /> : periodStatistics.producing}</h3>
                <span>EM PRODUÇÃO</span>
              </div>
            </div>
          </div>
        </Grid>}
        {resources["dashboard.home.not_printed"] && <Grid item sm={6} md={6} lg={3} xl={3}>
          <div className="card dash-widget">
            <div className="card-body">
              <span className="dash-widget-icon"><i className="fa fa-user"></i></span>
              <div className="dash-widget-info">
                <h3>{loadingPeriodStatistics ? <CircularProgress size={22} /> : periodStatistics.not_printed}</h3>
                <span>NÃO IMPRESSOS</span>
              </div>
            </div>
          </div>
        </Grid>}
      </Grid>
      
      <Grid justify="center" container spacing={2}>
        {resources["dashboard.home.filters"] && <Grid item md={6} lg={4} xl={4}>
          {loadingFilters 
          ? <div className="card flex-fill">
            <div className="card-body" align="center">
              <CircularProgress />
            </div>
          </div>
          : <div className="card flex-fill dash-statistics">
            <div className="card-body">
              <h5 className="card-title">Filtros</h5>
              <div className="stats-list">
                {filters.length === 0 && <div class="alert alert-warning">Nenhum filtro cadastrado</div>}
                {filters.map((item, index) => <div className="stats-info">
                  <p>{item.title} <strong>{item.quantity} <small>/ {item.total}</small></strong></p>
                  <div className="progress">
                    <div 
                      className={`progress-bar bg-${[
                        "primary",
                        "warning",
                        "success",
                        "danger",
                        "info",
                      ][index % 5]}`} 
                      role="progressbar" style={{width: `${item.percent}%`}} 
                      aria-valuenow={`${item.percent}`}
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>)}
              </div>
            </div>
          </div>}
        </Grid>}
        
        {resources["dashboard.home.daily"] && <Grid item md={12} lg={8} xl={8}>
          {loadingStatistics 
          ? <div className="card flex-fill">
            <div className="card-body" align="center">
              <CircularProgress />
            </div>
          </div>
          : <div className="card flex-fill">
            <div className="card-body">
              <h4 className="card-title">Acompanhamento diário</h4>
              <div className="statistics">
                <div className="row">
                  <div className="col-md-4 col-4 text-center">
                    <div className="stats-box mb-4">
                      <p>Total de pedidos</p>
                      <h3>{statistics.total}</h3>
                    </div>
                  </div>
                  <div className="col-md-4 col-4 text-center">
                    <div className="stats-box mb-4">
                      <p>Finalizados</p>
                      <h3>{statistics.done}</h3>
                    </div>
                  </div>
                  <div className="col-md-4 col-4 text-center">
                    <div className="stats-box mb-4">
                      <p>Cancelados</p>
                      <h3>{statistics.canceled}</h3>
                    </div>
                  </div>
                </div>
              </div>
              <div className="progress mb-4">
                <div className="progress-bar bg-success" role="progressbar" style={{width: `${{...statistics.finished}.percent}%`}} aria-valuenow={{...statistics.finished}.percent} aria-valuemin="0" aria-valuemax="100">{{...statistics.finished}.percent}%</div>
                <div className="progress-bar bg-dark" role="progressbar" style={{width: `${{...statistics.producing}.percent}%`}} aria-valuenow={{...statistics.producing}.percent} aria-valuemin="0" aria-valuemax="100">{{...statistics.producing}.percent}%</div>
                <div className="progress-bar bg-purple" role="progressbar" style={{width: `${{...statistics.surf}.percent}%`}} aria-valuenow={{...statistics.surf}.percent} aria-valuemin="0" aria-valuemax="100">{{...statistics.surf}.percent}%</div>
                <div className="progress-bar bg-primary" role="progressbar" style={{width: `${{...statistics.wait_for_print}.percent}%`}} aria-valuenow={{...statistics.wait_for_print}.percent} aria-valuemin="0" aria-valuemax="100">{{...statistics.wait_for_print}.percent}%</div>
                <div className="progress-bar bg-danger" role="progressbar" style={{width: `${{...statistics.wait_for_store}.percent}%`}} aria-valuenow={{...statistics.wait_for_store}.percent} aria-valuemin="0" aria-valuemax="100">{{...statistics.wait_for_store}.percent}%</div>
                <div className="progress-bar bg-warning" role="progressbar" style={{width: `${{...statistics.wait_for_calculation}.percent}%`}} aria-valuenow={{...statistics.wait_for_calculation}.percent} aria-valuemin="0" aria-valuemax="100">{{...statistics.wait_for_calculation}.percent}%</div>
                <div className="progress-bar bg-info" role="progressbar" style={{width: `${{...statistics.waiting_for_period}.percent}%`}} aria-valuenow={{...statistics.waiting_for_period}.percent} aria-valuemin="0" aria-valuemax="100">{{...statistics.waiting_for_period}.percent}%</div>
              </div>
              <div>
                <p><i className="fa fa-dot-circle-o text-success mr-2"></i>Expedidos <span className="float-right">{{...statistics.finished}.total}</span></p>
                <p><i className="fa fa-dot-circle-o text-dark mr-2"></i>Produção <span className="float-right">{{...statistics.producing}.total}</span></p>
                <p><i className="fa fa-dot-circle-o text-purple mr-2"></i>Surfaçagem <span className="float-right">{{...statistics.surf}.total}</span></p>
                <p><i className="fa fa-dot-circle-o text-primary mr-2"></i>Impressão <span className="float-right">{{...statistics.wait_for_print}.total}</span></p>
                <p><i className="fa fa-dot-circle-o text-danger mr-2"></i>Geração do SKU <span className="float-right">{{...statistics.wait_for_store}.total}</span></p>
                <p><i className="fa fa-dot-circle-o text-warning mr-2"></i>Conferência do cálculo <span className="float-right">{{...statistics.wait_for_calculation}.total}</span></p>
                <p><i className="fa fa-dot-circle-o text-info mr-2"></i>Novos <span className="float-right">{{...statistics.waiting_for_period}.total}</span></p>
              </div>
            </div>
          </div>}
        </Grid>}
        
        {/* <div className="col-md-12 col-lg-6 col-xl-4 d-flex">
          <div className="card flex-fill">
            <div className="card-body">
              <h4 className="card-title">Today Absent <span className="badge bg-inverse-danger ml-2">5</span></h4>
              <div className="leave-info-box">
                <div className="media align-items-center">
                  <a href="profile.html" className="avatar"><img alt="" src="assets/img/user.jpg" /></a>
                  <div className="media-body">
                    <div className="text-sm my-0">Martin Lewis</div>
                  </div>
                </div>
                <div className="row align-items-center mt-3">
                  <div className="col-6">
                    <h6 className="mb-0">4 Sep 2019</h6>
                    <span className="text-sm text-muted">Leave Date</span>
                  </div>
                  <div className="col-6 text-right">
                    <span className="badge bg-inverse-danger">Pending</span>
                  </div>
                </div>
              </div>
              <div className="leave-info-box">
                <div className="media align-items-center">
                  <a href="profile.html" className="avatar"><img alt="" src="assets/img/user.jpg" /></a>
                  <div className="media-body">
                    <div className="text-sm my-0">Martin Lewis</div>
                  </div>
                </div>
                <div className="row align-items-center mt-3">
                  <div className="col-6">
                    <h6 className="mb-0">4 Sep 2019</h6>
                    <span className="text-sm text-muted">Leave Date</span>
                  </div>
                  <div className="col-6 text-right">
                    <span className="badge bg-inverse-success">Approved</span>
                  </div>
                </div>
              </div>
              <div className="load-more text-center">
                <a className="text-dark" href="javascript:void(0);">Load More</a>
              </div>
            </div>
          </div>
        </div> */}
      </Grid>
    </div>
  )
}

export default Dashboard
