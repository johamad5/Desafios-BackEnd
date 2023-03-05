import winston from 'winston';
import { format } from 'winston';

const { combine, prettyPrint, timestamp } = format;
const LEVEL = Symbol.for('level');

function filterOnly(level) {
	return format(function (info) {
		if (info[LEVEL] === level) {
			return info;
		}
	})();
}

export const logger = winston.createLogger({
	format: combine(timestamp(), prettyPrint()),
	transports: [
		new winston.transports.Console({
			level: 'info',
			format: filterOnly('info'),
		}),
		new winston.transports.File({
			filename: './logs/moderateSeriousError.log',
			level: 'warn',
		}),
	],
});
