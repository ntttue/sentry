import {Box, Flex} from 'grid-emotion';
import {Observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import styled, {keyframes} from 'react-emotion';

import {defined} from '../../../utils';
import FormState from '../state';
import IconCheckmarkSm from '../../../icons/icon-checkmark-sm';
import IconWarningSm from '../../../icons/icon-warning-sm';
import Spinner from './styled/spinner';

const SettingsPanelItemWrapper = styled(Flex)`
    padding: 15px 20px;
    border-bottom: 1px solid ${p => p.theme.borderLight};
    align-items: center;
    transition: background .15s;

    &:last-child {
      border-bottom: none;
    }
  `;

const SettingsPanelItemLabel = styled.div`
  color: ${p => p.theme.gray5};
`;

const SettingsPanelItemCtrl = styled(Box)`
  color: ${p => p.theme.gray3};
  width: 50%;
  padding-left: 10px;
  position: relative;
`;

const SettingsPanelItemCtrlState = styled(Box)`
  width: 36px;
  text-align: right;
`;

const SettingsPanelItemDesc = styled(Box)`
  width: 50%;
  padding-right: 10px;
`;

const SettingsRequiredBadge = styled.div`
  display: inline-block;
  background: ${p => p.theme.gray2};
  width: 5px;
  height: 5px;
  border-radius: 5px;
  text-indent: -9999em;
  vertical-align: super;
`;

const SettingsPanelItemHelp = styled.div`
  color: ${p => p.theme.gray2};
  font-size: 14px;
  margin-top: 8px;
  line-height: 1.4;
`;

const SettingsErrorReason = styled.div`
  color: ${p => p.theme.redDark};
  position: absolute;
  background: #fff;
  left: 10px;
  padding: 6px 8px;
  font-weight: 600;
  font-size: 12px;
  border-radius: 3px;
  box-shadow: 0 0 0 1px rgba(64,11,54,0.15), 0 4px 20px 0 rgba(64,11,54,0.36);
  z-index: 10000;
`;
const fadeOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1,1);
  }
  50% {
    transform: scale(1.15, 1.15);
  }
  100% {
    transform: scale(1, 1);
  }
`;

const SettingsError = styled.div`
  color: ${p => p.theme.redDark};
  animation: ${pulse} 1s ease infinite;
  width: 16px;
  margin-left: auto;
`;

const SettingsIsSaved = styled.div`
  color: ${p => p.theme.green};
  animation: ${fadeOut} .3s ease 2s 1 forwards;
`;

/**
 * Some fields don't need to implement their own onChange handlers, in
 * which case we will receive an Event, but if they do we should handle
 * the case where they return a value as the first argument.
 */
const getValueFromEvent = (valueOrEvent, e) => {
  let event = e || valueOrEvent;
  let value = defined(e) ? valueOrEvent : event && event.target && event.target.value;

  return {
    value,
    event
  };
};

class FormField extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    /** Inline style */
    style: PropTypes.object,

    label: PropTypes.string,
    defaultValue: PropTypes.any,
    disabled: PropTypes.bool,
    disabledReason: PropTypes.string,
    help: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    required: PropTypes.bool,
    hideErrorMessage: PropTypes.bool,

    // the following should only be used without form context
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onMouseOver: PropTypes.func,
    onMouseOut: PropTypes.func,
    error: PropTypes.string,
    value: PropTypes.any
  };

  static defaultProps = {
    hideErrorMessage: false,
    disabled: false,
    required: false
  };

  static contextTypes = {
    form: PropTypes.object
  };

  componentDidMount() {
    // this.attachTooltips();
    // Tell model about this field's props
    this.getModel().setFieldDescriptor(this.props.name, this.props);
  }

  componentWillUnmount() {
    //this.removeTooltips();
    jQuery(ReactDOM.findDOMNode(this)).unbind();
  }

  attachTooltips() {
    jQuery('.tip', ReactDOM.findDOMNode(this)).tooltip();
  }

  removeTooltips() {
    jQuery('.tip', ReactDOM.findDOMNode(this)).tooltip('destroy');
  }

  getError(props, context) {
    return this.getModel().getError(this.props.name);
  }

  getId() {
    return `id-${this.props.name}`;
  }

  getModel() {
    return this.context.form;
  }

  /**
   * Set field's hover state and propagate callbacks
   */
  handleHover = (mouseOver, ...args) => {
    let {name, onMouseOver, onMouseOut} = this.props;
    let model = this.getModel();

    model.setFieldState(name, FormState.HOVER, mouseOver);
    if (onMouseOver) {
      onMouseOver(...args);
    }
    if (onMouseOut) {
      onMouseOut(...args);
    }
  };

  /**
   * Update field value in form model
   */
  handleChange = (...args) => {
    let {name, onChange} = this.props;
    let {value, event} = getValueFromEvent(...args);
    let model = this.getModel();

    if (onChange) {
      onChange(value, event);
    }

    model.setValue(name, value);
  };

  /**
   * Notify model of a field being blurred
   */
  handleBlur = (...args) => {
    let {name, onBlur} = this.props;
    let {value, event} = getValueFromEvent(...args);
    let model = this.getModel();

    if (onBlur) {
      onBlur(value, event);
    }

    // Always call this, so model can decide what to do
    model.saveField(name, value);
  };

  render() {
    let {required, label, disabled, disabledReason, hideErrorMessage, help} = this.props;
    let id = this.getId();
    let model = this.getModel();

    return (
      <SettingsPanelItemWrapper>
        <SettingsPanelItemDesc>
          {label &&
            <SettingsPanelItemLabel>
              {label} {required && <SettingsRequiredBadge />}
            </SettingsPanelItemLabel>}
          {help && <SettingsPanelItemHelp>{help}</SettingsPanelItemHelp>}
        </SettingsPanelItemDesc>
        <SettingsPanelItemCtrl>

          <Observer>
            {() => {
              let error = this.getError();

              return (
                <this.props.children
                  {...{
                    ...this.props,
                    id,
                    hover: model.getFieldState(this.props.name, FormState.HOVER),
                    onMouseOver: e => this.handleHover(true, e),
                    onMouseOut: e => this.handleHover(false, e),
                    onChange: this.handleChange,
                    onBlur: this.handleBlur,
                    value: model.getValue(this.props.name),
                    error
                  }}
                />
              );
            }}
          </Observer>

          {disabled &&
            disabledReason &&
            <span className="disabled-indicator tip" title={disabledReason}>
              <span className="icon-question" />
            </span>}

          <Observer>
            {() => {
              let error = this.getError();
              let shouldShowErrorMessage = error && !hideErrorMessage;
              if (!shouldShowErrorMessage) return null;
              return <SettingsErrorReason>{error}</SettingsErrorReason>;
            }}
          </Observer>
        </SettingsPanelItemCtrl>
        <SettingsPanelItemCtrlState>

          <Observer>
            {() => {
              let isSaving = model.getFieldState(this.props.name, FormState.SAVING);
              let isSaved = model.getFieldState(this.props.name, FormState.READY);

              if (isSaving) {
                return <Spinner />;
              } else if (isSaved) {
                return <SettingsIsSaved><IconCheckmarkSm size="18" /></SettingsIsSaved>;
              }

              return null;
            }}
          </Observer>

          <Observer>
            {() => {
              let error = this.getError();

              if (!error) return null;

              return (
                <SettingsError>
                  <IconWarningSm size="18" />
                </SettingsError>
              );
            }}
          </Observer>
        </SettingsPanelItemCtrlState>
      </SettingsPanelItemWrapper>
    );
  }
}

export default FormField;
