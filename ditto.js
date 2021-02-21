let args = process.argv.slice(2)
const processArgs = require("./js/args.js")
const { getCampaignId, getArtist, scrapeApi } = require("./js/urlScraper.js")
const downloadAndTag = require("./js/fileDownloader.js")

;(async () => {
	args = processArgs(args)
	console.log(args);

	const campaignId =
		args.idType === "campaignId" ? args.id : await getCampaignId(args.id)
	const artist =
		args.idType === "artist" ? args.id : await getArtist(args.id)

	console.log(`\nCampaign ID: ${campaignId}\nArtist: ${artist}\n`)

	const objArr = await scrapeApi(campaignId)

	console.log("Downloading files");
	for(const [page, filesObj] of Object.entries(objArr)){
		console.log(`\n\nPage ${page}/${Object.keys(objArr).length}`);
		await downloadAndTag(filesObj, artist, args.tagging)
	}

	// // printStats(objArr, fileArr)
	console.log("\nDone")
})()
