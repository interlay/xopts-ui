import React from 'react';
import cx from 'classnames';
import { Switch, Route } from 'react-router';

import s from './Layout.module.scss';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Sidebar from '../Sidebar/Sidebar';

import Dashboard from '../../views/Dashboard';
import Positions from '../../views/Positions';
import NotFound from '../../views/NotFound/NotFound';
import { AppProps } from '../../types/App';
import Help from '../../views/Help';
import LandingPage from '../../views/LandingPage';

export default class Layout extends React.Component<AppProps, any> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      sidebarOpen: false,
    };
  }

  render() {
    return (
      <div className={s.root}>
        <Sidebar {...this.props} />
        <div
          className={cx(s.wrap, {[s.sidebarOpen]: this.state.sidebarOpen})}
        >
          <Header
            // sidebarToggle={() =>
            //   this.setState({
            //     sidebarOpen: !this.state.sidebarOpen,
            //   })
            // }
            {...this.props}
          />
          <main className={s.content}>
            <Switch>
              <Route path="/" exact>
                <LandingPage {...this.props}/>
              </Route>
              <Route path="/trade" exact>
                <Dashboard {...this.props}/>
              </Route>
              {this.props.isLoggedIn &&
                <Route path="/positions" exact>
                  <Positions {...this.props}/>
                </Route>
              }
              <Route path="/help" exact>
                <Help />
              </Route>
              <Route component={NotFound} />
            </Switch>
          </main>
          <Footer />
        </div>
      </div>
    );
  }
}