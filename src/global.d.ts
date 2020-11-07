declare namespace twttr {
	const widgets: {
		createTweetEmbed: (id: string, target: Element, options: {
			cards?: "hidden"
			conversation?: "none"
			dnt?: boolean
		}) => Promise<Element>
	}
}