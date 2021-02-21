const yargs = require("yargs")

module.exports = function processArgs(args) {
	let argsArr = { idType: undefined, id: undefined, tagging: undefined }
	const argv = yargs
		.check(function (argv) {
			if ((argv.artist && !argv.campaign) || (!argv.artist && argv.campaign)) {
				return true
			} else if (argv.artist && argv.campaign) {
				throw new Error("Error: pass either artist or campaignId option")
			} else {
				throw new Error("Error: pass either artist or campaignId option")
			}
		})
		.usage(
			"\nUtilizes Puppeteer to scrape an artist's entire Patreon post history via official API and download attached audio files\nLoads cookies.json in root directory\nCan only access content user account has rights to\nLogs titles and skips already downloaded ones"
		)
		.option("artist", {
			alias: "a",
			description: "Name of the artist/creator of interest",
			type: "string",
		})
		.option("campaignId", {
			alias: "c",
			description: "ID number of artist's/creator's patreon campaign",
			type: "number",
		})
		.option("tagging", {
			alias: "t",
			description: `Adds ID3 tags to downloaded audio files and attaches post-included artwork as cover\n
                         Tags added: 
                         Title           title of the post the file is attached to 
                         .               (excluding tags and special characters, 
                         .               e.g. emojis)
                         originalArtist  the name of the artist/creator
                         year            publishing date of the post the file is 
                         .               attached to (format: yyyymmdd)
                         genre           tags that were included in the title\n\n`,
			type: "string",
			choices: ["all", "noArt"],
		})
		.help()
		.alias("help", "h").argv

	if (argv.tagging) {
		argsArr.tagging = argv.tagging
	}
	
	if (argv.artist) {
		argsArr.idType = "artist"
		argsArr.id = argv.artist
	}

	if (argv.campaignId) {
		argsArr.idType = "campaignId"
		argsArr.id = argv.campaign
	}

	return argsArr
}
