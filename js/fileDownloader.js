const fs = require("fs")
const Downloader = require("nodejs-file-downloader")
const tagger = require("./tagger.js")

module.exports = async function downloadAndTag(objArr, artist, tagging) {
	const reader = fs
		.readFileSync(`${__dirname}/../logs/${artist}.txt`, {
			encoding: "utf8",
			flag: "a+",
		})
		.split("\n")
	const logger = fs.createWriteStream(`${__dirname}/../logs/${artist}.txt`, {
		flags: "a",
	})
	const path = `${__dirname}/../files/${artist}/`
	let fileArr = objArr.filter(
		(obj) => obj.type === "audio_file" && obj.url != undefined
	)
	let downloader
	let test = []

	await Promise.all(
		fileArr.map(async (obj) => {
			const logId = `[${obj.date}] ${obj.title} ${
				obj.tags != undefined ? obj.tags.join("") : ""
			}`

			if (fileExist(logId, obj)) return "Skipped"
			const filename = filenameExist(obj)
				? fixFilename(obj)
				: `${obj.name}.${obj.format}`

			downloader = new Downloader({
				url: obj.url,
				directory: path,
				filename: filename,
				cloneFiles: false,
				maxAttempts: 10,

				// onProgress:function(percentage){//
				// 	console.log('% ',percentage)  }
			})

			try {
				await downloader.download()
				console.log(`\nDownloaded title ${obj.title}`)
				logger.write(logId + "\n")
			} catch (err) {
				console.log(err)
				console.log(`Download of title ${obj.title} failed`)
			}

			if (tagging != undefined) {
				await tagger(obj, filename, artist, tagging)
				console.log(`Tagging complete`)
			} else {
				console.log("Skipped tagging")
			}

			return "Downloaded"
		})
	)
	return fileArr

	function fileExist(logId, obj) {
		if (reader.includes(logId)) {
			console.log(`Skipped title ${obj.title} - already downloaded`)
			return true
		}
	}

	function filenameExist(obj, altFilename = "") {
		if (
			fs.existsSync(`${path}${obj.name}.${obj.format}`) &&
			fs.existsSync(`${path}${altFilename}`)
		) {
			console.log(`\n${obj.name}.${obj.format} already exists`)
			return true
		}
	}

	function fixFilename(obj, counter = 1) {
		counter++
		let altFilename = `${obj.name} (${counter}).${obj.format}`
		console.log("Renaming to " + altFilename)
		return filenameExist(obj, altFilename)
			? fixFilename(obj, counter)
			: altFilename
	}
}
