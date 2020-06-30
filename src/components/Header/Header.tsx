/**
 * Flatlogic Dashboards (https://flatlogic.com/admin-dashboards)
 *
 * Copyright © 2015-present Flatlogic, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import cx from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Navbar,
  Nav,
  NavItem,
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
} from 'reactstrap';

import s from './Header.module.scss';
import Web3LogIn from '../Login';
import { AppPropsLoading } from '../../types/App';
import BalanceTopbar from '../BalanceTopbar';

export default class Header extends React.Component<AppPropsLoading> {

  static defaultProps = {
    sidebarToggle: () => {},
  };

  render() {
    return (
      <Navbar className={s.root}>
        {/* <Nav>
          <NavItem
            className={cx('visible-xs mr-4 d-sm-up-none', s.headerIcon, s.sidebarToggler)}
            href="#"
            onClick={this.props.sidebarToggle}
          >
            <i className="fa fa-bars fa-2x text-muted" />
          </NavItem>
        </Nav> */}
        <Nav>
          <BalanceTopbar {...this.props} />
        </Nav>
        <Nav className="ml-auto">
          <Web3LogIn {...this.props} />
        </Nav>
      </Navbar>
    );
  }
}