import React from 'react';
import ReactDOM from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import d3 from 'd3';
import _ from 'lodash';
import topojson from 'topojson';
import VisMap from './VisMap';

var MapWrapper = React.createClass({
    displayName: 'MapWrapper',
    mixins: [
        PureRenderMixin
    ],
    getInitialState: function() {
        return {
        	data: '',
            width: 480,
            height: 260,
            minScale: 80,
            maxScale: 3000,
			map_state: {
				//translate : [-2650, 650],
				translate: [240, 130],
				scale: 80
			},
			zoomspecs : {translate: [0,0], scale:1}
        };
    },
	componentDidMount: function() {
		setTimeout(this.loadData, 100);
		//this.state.zoomspecs = {translate: [0,0], scale:1};
	},

	loadData: function() {
		d3.json("/maps/countries.topojson", this.dataLoaded);
		//d3.json("/maps/maps.json", this.dataLoaded);
	},
	
	dataLoaded: function(err, data) {
		if (err) return this.state({error: err});
		this.setState({data:data});
	},
	
	componentDidUpdate: function(){
		this.zoom = d3.behavior.zoom()
				//.scaleExtent([.7, 30])
				.on("zoom", this.zoomed);
		this.zoom.translate(this.state.zoomspecs.translate).scale(this.state.zoomspecs.scale);

		this.d3Node = d3.select(ReactDOM.findDOMNode(this));
		this.d3Node.call(this.zoom);
		this.d3Node.selectAll("g").attr("transform", "translate(" + this.state.zoomspecs.translate + ")scale(" + this.state.zoomspecs.scale + ")");

		this.d3Node.selectAll("path").style({"stroke-width": 1/this.state.zoomspecs.scale, stroke: "grey"});
		this.d3Node.selectAll(".border").style("stroke-width", 0);
		this.d3Node.selectAll(".highlighted").style({"stroke-width": 6/(this.state.zoomspecs.scale*.75), stroke: "darkkhaki"});
		this.d3Node.selectAll(".selected").style({"stroke-width": 3/this.state.zoomspecs.scale, stroke: "grey"});
		this.d3Node.selectAll("image").attr({height: 22/this.state.zoomspecs.scale, width: 33/this.state.zoomspecs.scale});
		if (this.state.zoomspecs.scale > 8) {
			this.d3Node.selectAll("text").style("fill-opacity", 0);
		} else {
			this.d3Node.selectAll("text").style("fill-opacity", .7);
		}
	},
	
	zoomed: function() {
		let t = d3.event.translate,
			s = d3.event.scale;
		
		// these were chosen by trial and error since getting an exact pan 
		// boundary while zooming is apparently hard. following the examples 
		// led to significantly moving boundaries, just use this to hack 
		// through it for now
		let factors = [s*.4, 1.5-s*.5, s*1.1, 1.5-s*.7];
		
		t[0] = Math.min(this.state.width / 2 * (s-factors[0]), Math.max(this.state.width / 2 * (factors[3]-s), t[0]));
		t[1] = t[1] = Math.min(this.state.height / 2 * (s - factors[2]) + 230 * s, Math.max(this.state.height / 2 * (factors[1] - s) - 230 * s, t[1]));
		var self = this;

		this.zoom.translate(t);
		this.setState({zoomspecs: {translate:t, scale: s}}, function(){
			console.log('Zoomed: ', t, s);
			self.d3Node.selectAll("g").attr("transform", "translate(" + t + ")scale(" + self.state.zoomspecs.scale + ")");

			self.d3Node.selectAll("path").style("stroke-width", 1/self.state.zoomspecs.scale);
			self.d3Node.selectAll(".border").style("stroke-width", 0);
			self.d3Node.selectAll(".highlighted").style({"stroke-width": 6/(self.state.zoomspecs.scale*.75), stroke: "darkkhaki"});
			self.d3Node.selectAll(".selected").style("stroke-width", 3/self.state.zoomspecs.scale);
			self.d3Node.selectAll("image").attr({height: 22/self.state.zoomspecs.scale, width: 33/self.state.zoomspecs.scale});
			if (self.state.zoomspecs.scale > 8) {
				self.d3Node.selectAll("text").style("fill-opacity", 0);
			} else {
				self.d3Node.selectAll("text").style("fill-opacity", .7);
			}
		});

	},
	
	render: function() {
		if (!this.state.data) return <h1>Loading</h1>;
		
		return <svg width={this.state.width} height={this.state.height}>
					<VisMap selection={this.props.selection}
							map_state={this.state.map_state}
							data={this.state.data}
					/>
				</svg>;
	}
});

const mapStateToProps = (state) => {
    return {
    };
};

MapWrapper = connect(mapStateToProps)(MapWrapper);

module.exports = MapWrapper;
