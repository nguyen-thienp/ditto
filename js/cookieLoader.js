module.exports = async function loadCookies(page) {
	const cookiesJSON = require(`../cookies.json`)
	console.log("Loading cookies for new session")
	
	if (cookiesJSON.length !== 0) {
		await cookiesJSON.forEach((cookie) => {
			page.setCookie(cookie)
		})
	}
}
