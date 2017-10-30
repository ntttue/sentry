import PropTypes from 'prop-types';
import InputField from './inputField';

export default class TextField extends InputField {
  static propTypes = {
    spellCheck: PropTypes.string,
  };

  getAttributes() {
    return {
      spellCheck: this.props.spellCheck,
    };
  }

  getType() {
    return 'text';
  }
}
