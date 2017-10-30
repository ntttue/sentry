import {Box, Flex} from 'grid-emotion';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'react-emotion';

import SettingsActivity from './components/settingsActivity';
import SettingsBreadcrumb from './components/settingsBreadcrumb';
import SettingsHeader from './components/settingsHeader';

const Content = styled(Box)`
flex: 1;
`;

class SettingsLayout extends React.Component {
  static propTypes = {
    renderNavigation: PropTypes.func
  };

  render() {
    let {params, renderNavigation, children} = this.props;
    // We want child's view's props
    let childProps = (children && children.props) || this.props;
    let childRoutes = childProps.routes || [];
    let childRoute = childProps.route || {};

    return (
      <div>
        <SettingsHeader>
          <Box flex="1">
            <SettingsBreadcrumb params={params} routes={childRoutes} route={childRoute} />
          </Box>
          <SettingsActivity />
        </SettingsHeader>

        <Flex>
          <Box flex="0 0 210px">
            <StickySidebar>
              {typeof renderNavigation === 'function' && renderNavigation()}
            </StickySidebar>
          </Box>

          <Content>
            {children}
          </Content>
        </Flex>
      </div>
    );
  }
}

const StickySidebar = styled.div`
  position: sticky;
  top: 105px;
`;

export default SettingsLayout;
