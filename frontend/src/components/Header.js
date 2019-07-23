import React, { useState } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import { Button, Menu, Popover, Position } from '@blueprintjs/core';
import MediaQuery from 'react-responsive';
import * as R from 'ramda';

import FeedbackButton from 'src/components/FeedbackButton';
import { setSymbolSearchContent } from 'src/actions/symbolSearch';
import { backgroundColor, fontColor, emphasis } from 'src/style';
import { withMobileProp } from 'src/components/ResponsiveHelpers';
import { ROBINTRACK_LOGO_ALT } from 'src/constants';

const mapStateToProps = ({
  router: {
    location: { pathname },
  },
}) => ({ pathname });

const styles = {
  desktopHeader: {
    backgroundColor,
    display: 'flex',
    justifyContent: 'space-between',
  },
  headerItem: {
    display: 'flex',
    padding: 15,
    alignItems: 'flex-end',
  },
  text: {
    color: fontColor,
    fontWeight: 'bold',
  },
  searchWrapper: {
    display: 'flex',
    flexBasis: 250,
    alignItems: 'flex-end',
    paddingBottom: 20,
    right: 0,
    justifyContent: 'flex-end',
  },
  searchInput: {
    backgroundColor: '#26262d',
  },
  mobileHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
  },
};

const HeaderItem = compose(
  connect(mapStateToProps),
  withMobileProp({ maxDeviceWidth: 1200 })
)(({ content, url, pathname, style = {}, textStyle = {}, onItemSelect, mobile }) => {
  const aggregateStyle = R.mergeAll([
    styles.text,
    { color: pathname === url ? fontColor : emphasis },
    textStyle,
  ]);
  const inner = <span style={aggregateStyle}>{content}</span>;

  return (
    <div
      style={R.mergeAll([styles.headerItem, mobile ? { fontSize: 16 } : { fontSize: 26 }, style])}
    >
      {url && url !== pathname ? (
        <Link to={url} style={textStyle} onClick={onItemSelect}>
          {inner}
        </Link>
      ) : (
        inner
      )}
    </div>
  );
});

const mapSymbolSearchStateToProps = ({ symbolSearch }) => ({
  searchContent: symbolSearch,
});

const SymbolSearch = connect(
  mapSymbolSearchStateToProps,
  {
    setSymbolSearchContent,
    push,
  }
)(({ logoShown = true, searchContent, setSymbolSearchContent, push }) => {
  const submitSymbolSearch = () => push(`/symbol/${searchContent}`);

  return (
    <div style={{ ...styles.searchWrapper, alignItems: logoShown ? 'center' : 'flex-end' }}>
      <div className="pt-input-group">
        <span className="pt-icon pt-icon-search" />
        <input
          className="pt-input"
          type="search"
          placeholder="Search Stock"
          dir="auto"
          onChange={e => setSymbolSearchContent(e.target.value.trim())}
          size={14}
          value={searchContent}
          style={styles.searchInput}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              submitSymbolSearch();
              e.target.blur();
            }
          }}
          onFocus={e => e.target.select()}
        />
        <Button minimal icon="arrow-right" onClick={submitSymbolSearch} />
      </div>
    </div>
  );
});

export const headerItems = [
  { content: 'Home', url: '/' },
  { content: 'Leaderboard', url: '/leaderboard' },
  { content: 'Popularity Changes', url: '/popularity_changes' },
  {
    content: <FeedbackButton />,
    textStyle: { cursor: 'pointer' },
  },
  { content: 'Data Download', url: '/data-download' },
];

const MobileNavMenu = ({ onItemSelect }) => (
  <Menu>
    {headerItems.map(({ textStyle, ...props }, i) => (
      <HeaderItem
        key={i}
        style={{ padding: 2 }}
        textStyle={{ ...textStyle, fontSize: 20 }}
        onItemSelect={onItemSelect}
        {...props}
      />
    ))}
  </Menu>
);

const MobileHeader = ({ showLogo }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      <nav style={styles.mobileHeader}>
        {showLogo ? (
          <Link to="/">
            <img
              src="/images/robintrack_logo.svg"
              style={{ height: 70, width: 70, marginRight: 10, marginTop: -15 }}
              alt={ROBINTRACK_LOGO_ALT}
            />
          </Link>
        ) : null}
        <Popover
          content={<MobileNavMenu onItemSelect={() => setMenuOpen(false)} />}
          position={Position.LEFT_TOP}
          isOpen={menuOpen}
          onInteraction={isOpen => setMenuOpen(isOpen)}
        >
          <Button icon="menu" text="" />
        </Popover>

        <SymbolSearch />
      </nav>

      {showLogo ? (
        <a
          href="http://nerdetf.com/?utm_source=robintrack&utm_medium=cpm&utm_campaign=banners"
          target="__blank"
          style={{
            width: 300,
            height: 250,
            paddingTop: 10,
            paddingBottom: 20,
            marginRight: 'auto',
            marginLeft: 'auto',
            display: 'flex',
          }}
        >
          <img src="/images/nerd_mobile.gif" />
        </a>
      ) : null}
    </div>
  );
};

const DesktopHeader = ({ showLogo }) => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <a
      href="http://nerdetf.com/?utm_source=robintrack&utm_medium=cpm&utm_campaign=banners"
      target="__blank"
      style={{
        width: 970,
        height: 250,
        maxWidth: '100vw',
        paddingBottom: 20,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <img src="/images/nerd_desktop.gif" />
    </a>
    <nav style={styles.desktopHeader}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {showLogo ? (
          <Link to="/">
            <img
              src="/images/robintrack_logo.svg"
              style={{ height: 115, width: 115, marginRight: 15 }}
              alt={ROBINTRACK_LOGO_ALT}
            />
          </Link>
        ) : null}

        {headerItems.map((props, i) => (
          <HeaderItem key={i} {...props} />
        ))}
      </div>

      <SymbolSearch logoShown={showLogo} />
    </nav>
  </div>
);

const HeaderInner = ({ showLogo }) => (
  <>
    <MediaQuery maxDeviceWidth={840}>
      <MobileHeader showLogo={showLogo} />
    </MediaQuery>

    <MediaQuery minDeviceWidth={841}>
      <DesktopHeader showLogo={showLogo} />
    </MediaQuery>
  </>
);

const Header = connect(({ router: { location: { pathname } } }) => ({
  showLogo: pathname !== '/',
}))(HeaderInner);

export default Header;
