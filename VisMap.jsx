//import Land from './Land';
import React from 'react';
import ReactDOM from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import d3 from 'd3';
import { connect } from 'react-redux';
import topojson from 'topojson';
import _ from 'lodash';

var VisMap = React.createClass({
    displayName: 'VisMap',
    mixins: [
        PureRenderMixin
    ],
    getInitialState: function() {
        return {
            tooltipOffset: {x: 5, y: -25},
            showTooltip: false,
            tooltipText: null
        };
    },

    toggleTooltip: function(d, i){
      this.setState({
        showTooltip: !this.state.showTooltip,
        tooltipText: d.properties.name || d.properties.NAME || null
      });

    },
    handleMoveTooltip: function(e, ev){
        ev.preventDefault();
        ev.stopPropagation();
        this.setState({
            tooltipTop: this.state.tooltipOffset.y + ev.nativeEvent.offsetY,
            tooltipLeft: this.state.tooltipOffset.x + ev.nativeEvent.offsetX
        });
    },
    handleClick: function(e, id){
        console.log('Clicked on: ', e);
        console.log('Clicked on ID: ', id);
    },
    render: function() {

        var features = topojson.feature(this.props.data, this.props.data.objects.collection).features
        var path = React.DOM.path;
        
        var projection = d3.geo.mercator()
                    .scale(this.props.map_state.scale)
                    .translate(this.props.map_state.translate);

        var land = d3.geo.path().projection(projection);
        var self = this;
        var allLands =[];
          _.map(features, function(feature){
            if(feature.id == 'USA'){
                allLands.push(<path key={feature.id} d={land(feature)} fill="#3097d1"/>);
            }else{
                allLands.push(<path key={feature.id} d={land(feature)} fill="#ccc" />);
            }
        });
        return (
            <g>
               {allLands}
            </g>
        );
    }
});

const mapStateToProps = (state) => {
    return {
    };
};

VisMap = connect(mapStateToProps)(VisMap);

module.exports = VisMap;
