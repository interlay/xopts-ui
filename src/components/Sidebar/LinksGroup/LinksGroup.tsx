import React, {Component} from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Collapse } from 'reactstrap';
import { Route } from 'react-router';

import s from './LinksGroup.module.scss';

interface LinksGroupProps {
  className: string
  childrenLinks: {
    name: string
    link: string
  }[]
  headerLink: string
  header: string
  icon: JSX.Element
}

interface LinksGroupState {
  isOpen: boolean
}

class LinksGroup extends Component<LinksGroupProps, LinksGroupState> {
  static propTypes = {
    header: PropTypes.node.isRequired,
    headerLink: PropTypes.string,
    childrenLinks: PropTypes.array,
    glyph: PropTypes.string,
    className: PropTypes.string,
  };

  static defaultProps = {
    headerLink: '',
    childrenLinks: null,
    className: '',
    glyph: null,
  };

  state: LinksGroupState = {
    isOpen: false,
  }

  render() {
    const { className, childrenLinks, headerLink, header, icon } = this.props;
    const { isOpen } = this.state;
    if (!childrenLinks) {
      return (
        <li className={cx(s.headerLink, className)}>
          <NavLink
            to={headerLink}
            activeClassName={s.headerLinkActive}
            exact
          >
            <div>
              {icon}
              <span className="ml-3">{header}</span>
            </div>
          </NavLink>
        </li>
      );
    }
    /* eslint-disable */
    return (
      <Route
        path={headerLink}
        children={({match}) => {
          return (
            <li className={cx(s.headerLink, className)}>
              <a
                className={cx({[s.headerLinkActive]: !!match && match.url.indexOf(headerLink) !== -1 })}
                onClick={() => this.setState({isOpen: !isOpen})}
              >
                <div>
                  {icon}
                  <span className="ml-3">{header}</span>
                </div>
                <b className={cx('fa fa-angle-left arrow', s.arrow, {[s.arrowActive]: isOpen})} />
              </a>
              {/* eslint-enable */}
              <Collapse className={s.panel} isOpen={isOpen}>
                <ul>
                  {childrenLinks &&
                  childrenLinks.map(child => (
                    <li key={child.name}>
                      <NavLink
                        to={child.link}
                        exact
                        onClick={() =>
                          this.setState({
                            isOpen: true,
                          })
                        }
                        activeClassName={s.headerLinkActive}
                      >
                        {child.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </Collapse>
            </li>
          );
        }}
      />
    );
  }
}

export default LinksGroup;
