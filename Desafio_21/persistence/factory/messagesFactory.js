import { logger } from '../../logs/loger.js';
import MessagesDaoFile from '../DAO/messagesDAO.js';

let options = 'fs';
let route = './msg.json';
let dao;

switch (options) {
	case 'fs':
		dao = new MessagesDaoFile(route);
		dao.connect();
		break;
	default:
		logger.error('Only DAO Messages can be created in FileSystem');
}

export default class MessagesDaoFactory {
	static getDao() {
		return dao;
	}
}
