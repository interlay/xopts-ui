import React, {Component} from 'react';
import {
  Row,
  Col,
  Breadcrumb,
  BreadcrumbItem,
} from 'reactstrap';

import Widget from '../components/Widget/Widget';

import OptionList from '../components/OptionList';
import { AppProps } from '../types/App';

export default class Dashboard extends Component<AppProps> {

  render() {
    return (
      <div>
        <h1 className="mb-lg">Trade</h1>
        <Row>
          <Col>
            <Widget>
              <OptionList {...this.props} />
            </Widget>
          </Col>
        </Row>
      </div>
    );
  }
}