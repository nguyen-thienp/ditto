const request = require("request")
const NodeID3 = require("node-id3")

module.exports = async function tag(obj, filename, artist, tag) {
	const path = `${__dirname}/../files/${artist}/`

	request(
		{
			url: obj.artwork,
			//make the returned body a Buffer
			encoding: null,
		},
		function (err, res, artwork) {
			const tags = {
				title: obj.title,
				originalArtist: artist,
				image: tag === "noArt" ? undefined : artwork,
				year: obj.date,
				genre: obj.tags != null ? obj.tags.join("") : undefined,
			}
			return (success = NodeID3.write(tags, `${path}${filename}`))
		}
	)
}

