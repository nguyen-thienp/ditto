const puppeteer = require("puppeteer-extra")
const stealth_plugin = require("puppeteer-extra-plugin-stealth")
const objConstructor = require("./objConstructor.js")
const loadCookies = require("./cookieLoader.js")

module.exports = {
	getCampaignId: async function (artist) {
		const artistUrl = `https://www.patreon.com/${artist}/posts`
		console.log("\nRetrieving Campaign ID")
		const [browser, page] = await launchBrowser(artistUrl)
		
		let html = await page.content()
		let campaignId = html.match(/api\/campaigns\/(\d+)/)
		await browser.close()

		return campaignId[1]
	},

	getArtist: async function (campaignId) {
		const apiUrl = `https://www.patreon.com/api/posts?filter[campaign_id]=${campaignId}&include=campaign.rewards&fields[post]&filter[is_draft]=false`
		const [browser, page] = await launchBrowser(apiUrl)

		console.log("\nRetrieving artist name")
		let pageJSON = await getPageJSON(apiUrl)
		pageJSON = await JSON.parse(pageJSON)
		await browser.close()

		return pageJSON.included.attributes.name
	},

	scrapeApi: async function (campaignId) {
		let nextPage = `https://www.patreon.com/api/posts?include=user%2Cattachments%2Cimages.null%2Caudio.null&fields[user]=image_url%2Cfull_name%2Curl&fields[campaign]=show_audio_post_download_links%2Cavatar_photo_url%2Cname%2Curl&fields[access_rule]=access_rule_type&fields[media]=id%2Cimage_urls%2Cdownload_url%2Cmetadata%2Cfile_name&fields[post]=content%2Ccurrent_user_can_view%2Cembed%2Cimage%2Cpost_file%2Cpublished_at%2Cpatreon_url%2Cpost_type%2Cthumbnail_url%2Cteaser_text%2Ctitle%2Curl&fields[user]=image_url%2Cfull_name%2Curl&fields[campaign]=show_audio_post_download_links%2Cavatar_photo_url%2Cearnings_visibility%2Cis_nsfw%2Cis_monthly%2Cname%2Curl&fields[access_rule]=access_rule_type&fields[media]=id%2Cimage_urls%2Cdownload_url%2Cmetadata%2Cfile_name&sort=-published_at&filter[campaign_id]=${campaignId}&json-api-version=2.0`
		console.log("Scraping data");
		const [browser, page] = await launchBrowser("about:blank")
		let pageNo = 1
		let pageJSON
		let objArr = {}
		
		while (nextPage !== null) {
			let rndDelay = 1000 + Math.floor(Math.random() * 1000) + 1

			console.log("")
			console.log(`Page ${pageNo} : ${nextPage}`)
			await delay(rndDelay)
			await page.goto(nextPage, { timeout: 0, waitUntil: "networkidle0" })

			pageJSON = await getPageJSON(page)
			let newObjs = await objConstructor(pageJSON)
			objArr[pageNo] = newObjs

			nextPage = await getNextPageUrl(pageJSON)
			pageNo++
		}

		await browser.close()
		return objArr

		function delay(ms) {
			return new Promise((resolve) => setTimeout(resolve, ms))
		}

		function getNextPageUrl(JSON) {
			return JSON.links ? JSON.links.next : null
		}
	}
}

async function launchBrowser(url) {
	puppeteer.use(stealth_plugin())
	const browser = await puppeteer.launch({ headless: true })
	const page = await browser.newPage()
	await loadCookies(page)
	await page.goto(url, { timeout: 0, waitUntil: "networkidle0" })
	return [browser, page]
}

async function getPageJSON(page) {
	const regExTagOp = RegExp(/<html><head><\/head><body><pre style=\"word-wrap: break-word; white-space: pre-wrap;\">/)
	const regExTagCl = RegExp(/<\/pre><\/body><\/html>/)
	const regExAmp = RegExp(/amp;/g)

	let pageJSON = await page.content()
	pageJSON = pageJSON
		.replace(regExTagOp, "")
		.replace(regExTagCl, "")
		.replace(regExAmp, "")

	return JSON.parse(pageJSON)
}
