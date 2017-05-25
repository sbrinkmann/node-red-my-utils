const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);

module.exports = function(RED) {

	function NotBetween(config) {
		RED.nodes.createNode(this, config);
		let node = this;

		node.on("input", function(msg) {
			let now = moment();
			let from = moment(config.from, 'HH:mm');
			let until = moment(config.until, 'HH:mm');
			let overMidnight = until.diff(from) < 0;

			if(!overMidnight)
			{
				let range = moment().range(from, until);
				if(!range.contains(now))
				{
					node.send(msg);
				}
			}
			else
			{
				let rangeYesterday = moment().range(from.clone().add(-1, 'days'), until);
				let rangeToday = moment().range(from, until.clone().add(1, 'days'));
				if(!rangeYesterday.contains(now) && !rangeToday.contains(now))
				{
					node.send(msg);
				}
			}
		});
	}

	RED.nodes.registerType("not-between", NotBetween);

};