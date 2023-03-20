export default class MessagesDTO {
	constructor({ author, text }) {
		this.alias = author.alias;
		this.avatar = author.avatar;
		this.text = text;
	}
}

export function transformToDTO(messages) {
	if (Array.isArray(messages)) {
		return messages.map((msg) => new MessagesDTO(msg));
	} else {
		return new MessagesDTO(messages);
	}
}
