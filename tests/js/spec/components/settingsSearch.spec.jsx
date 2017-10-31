import React from 'react';
import {shallow} from 'enzyme';
import SettingsSearch from 'app/components/settingsSearch';

describe('SettingsSearch', function() {
  beforeEach(function() {
    this.sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  it('renders', function() {
    let wrapper = shallow(<SettingsSearch />);
    expect(wrapper).toMatchSnapshot();
  });
});
