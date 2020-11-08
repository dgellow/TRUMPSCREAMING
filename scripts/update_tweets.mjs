import fetch from "node-fetch"
import fs from "fs"
import { promisify } from "util"
import { exit } from "process"

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

const sourceurl = "https://www.thetrumparchive.com/latest-tweets"
const targetfile = "./public/data.json"

async function main() {
	const buffer = await readFile(targetfile)
	const data = JSON.parse(buffer)
	const set = new Set()
	for (const d of data)
		set.add(d.id)

	const res = await fetch(sourceurl)
	if (!res.ok) {
		const text = await res.text()
		console.error(`error returned by API: ${text}`)
		throw new Error(`failed to fetch latest tweets: ${res.status} ${res.statusText}`)
	}

	const json = await res.json()
	let count = 0
	for (const item of json) {
		if (!set.has(item.id)) {
			data.push(item)
			count++
		}
	}
	console.log(`${count} new tweets found`)

	await writeFile(targetfile, JSON.stringify(data, null, "\t"))
	console.log("done")
}

main().catch(err => {
	console.errror(err)
	exit(1)
})