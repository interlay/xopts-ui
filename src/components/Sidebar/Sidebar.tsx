import React from 'react';
import {withRouter, Link} from 'react-router-dom';

import LinksGroup from './LinksGroup/LinksGroup';
import xoptsLogo from "../../assets/img/xopts.png";

import s from './Sidebar.module.scss';
import l from './LinksGroup/LinksGroup.module.scss';

import { Image } from 'react-bootstrap';
import { FaHome, FaExchangeAlt, FaFileAlt, FaComment, FaUser } from 'react-icons/fa';
import { AppProps } from '../../types/App';

const Sidebar = (props: AppProps) => (
  <nav className={s.root}>
    <header className={s.logo}>
      <Link to="/">
        <Image src={xoptsLogo} fluid />
      </Link>
    </header>
    <ul className={s.nav}>
      <LinksGroup
        header="Home"
        headerLink="/"
        icon={<FaHome/>}
      />
      <LinksGroup
        header="Trade"
        headerLink="/trade"
        icon={<FaExchangeAlt/>}
      />
      {props.isLoggedIn &&
        <LinksGroup
          header="Positions"
          headerLink="/positions"
          icon={<FaUser/>}
        />
      }
      <LinksGroup
        header="Help"
        headerLink="/help"
        icon={<FaFileAlt/>}
      />
      <li className={l.headerLink}>
        <a href="https://forms.gle/Rean9U1EiGfpTQha6">
          <div>
            <FaComment/>
            <span className="ml-3">Give Feedback</span>
          </div>
        </a>
      </li>

    </ul>
  </nav>
);

export default Sidebar;
