import fetch from "node-fetch"
import fs from "fs"
import { promisify } from "util"
import { exit } from "process"
import { filterTweetsCapitalized } from "../src/client.mjs"

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

const sourceurl = "https://www.thetrumparchive.com/latest-tweets"
const dataFile = "./public/data.json"
const dataCapitalizedFile = "./public/data_capitalized.json"

async function main() {
	const buffer = await readFile(dataFile)
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
	console.log(`${count} new tweets found. Total of ${data.length} tweets.`)

	await writeFile(dataFile, JSON.stringify(data, null, "\t"))
	console.log(`${dataFile} updated.`)

	const capitalizedData = filterTweetsCapitalized(data)
	console.log(`Total of ${capitalizedData.length} tweets capitalized.`)
	await writeFile(dataCapitalizedFile, JSON.stringify(capitalizedData, null, "\t"))
	console.log(`${dataCapitalizedFile} updated.`)
}

main().catch(err => {
	console.errror(err)
	exit(1)
})