export interface AgentInfo {
	id: number;
	title: string;
	tel: string;
	email: string;
	image: string;
}

export interface AgentListing {
	id: number;
	title: {
		rendered: string;
	}
	'featured_media': number;
	'toolset-meta': {
		'makelaar-id': {
			'makelaar-tel': {
				type: string;
				raw: string;
			},
			'makelaar-mail': {
				type: string;
				raw: string;
			},
      '''-tel': {
	type: string;
	raw: string;
},
'''-mail': {
	type: string;
	raw: string;
},
      }
      }
}
