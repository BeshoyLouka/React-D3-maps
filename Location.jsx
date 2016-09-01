import React from 'react';
import _ from 'lodash';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import MapWrapper from './MapWrapper';

var Location = React.createClass({
    displayName: 'Location',
    mixins: [
        PureRenderMixin,
    ],
    getInitialState: function() {
        return {
            selection: {
              name: 'Overview',
              text: {__html:'<div>Overview!</div>'},
              highlights: []
            }
        };
    },

    render: function() {

      return(
        <div>
          <MapWrapper selection={this.state.selection} />
        </div>
      );

    }
});

const mapStateToProps = (state) => {
    return {
    };
};

Location = connect(mapStateToProps)(Location);

module.exports = Location;
