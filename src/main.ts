import App from './App.svelte'

document.body.innerText = ''
const app = new App({
	target: document.body,
})

export default app