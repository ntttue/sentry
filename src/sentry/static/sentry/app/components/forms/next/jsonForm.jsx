import {Box} from 'grid-emotion';
import PropTypes from 'prop-types';
import React from 'react';
import scrollToElement from 'scroll-to-element';

import FieldFromConfig from './fieldFromConfig';
import Panel from './styled/panel';
import PanelBody from './styled/panelBody';
import PanelHeader from './styled/panelHeader';

class JsonForm extends React.Component {
  static propTypes = {
    /**
     * Fields that are grouped by "section"
     */
    forms: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        fields: PropTypes.arrayOf(FieldFromConfig.propTypes.field),
      })
    ).isRequired,
  };

  static contextTypes = {
    location: PropTypes.object,
  };

  componentDidMount() {
    let hash = this.context.location.hash;

    if (!hash) return;

    // Push onto callback queue so it runs after the DOM is updated,
    // this is required when navigating from a different page so that
    // the element is rendered on the page before trying to getElementById.
    scrollToElement(hash, {offset: -120});
  }

  render() {
    let {forms, ...otherProps} = this.props;

    return (
      <Box>
        {forms.map(({title, fields}) => {
          return (
            <Panel key={title} id={title}>
              <PanelHeader>{title}</PanelHeader>
              <PanelBody>
                {fields.map(field => (
                  <FieldFromConfig key={field.name} {...otherProps} field={field} />
                ))}
              </PanelBody>
            </Panel>
          );
        })}
      </Box>
    );
  }
}

export default JsonForm;
