module.exports = async function constrObject(json) {
	const data = json.data
	const regExTag = new RegExp(/(\(|\[|\{).*?(\]|\)|\})/g)
	const regExUTF = new RegExp(/[^\x00-\x7F]/g)
	const regExReg = new RegExp(/[^0-9a-zA-Z\^\&\'\@\{\}\[\]\,\$\=\!\-\#\(\)\.\%\+\~\_\ \§]+/g)

	return data.map((obj) => {
		const _obj = obj.attributes

		//to add: if no artwork -> get pfp
		return (fileData = {
			name: getName(_obj),
			title: getTitle(_obj),
			tags: getTags(_obj),
			date: getDate(_obj),
			type: getType(_obj),
			url: getFileUrl(_obj),
			format: getFormat(_obj),
			artwork: getArtworkUrl(_obj),
			access: getAccess(_obj),
		})
	})

	function getName(_obj) {
		return (name =
			_obj.post_file == null
				? "Unnamed"
				: _obj.post_file.name
						.slice(0, -4)
						.replace(regExReg, "")
						.replace(/  /g, " ")
						.trim())
	}

	function getTitle(_obj) {
		return (title =
			_obj.title == null
				? "Untitled"
				: (title = _obj.title
						.replace(regExReg, "")
						.replace(regExTag, "")
						.replace(/  /g, " ")
						.trim()))
	}

	function getTags(_obj) {
		if (_obj.title == null) return undefined
		return (tags = _obj.title
			.replace(regExUTF, "")
			.replace(/[\(|\{]/g, "[")
			.replace(/[\)|\}]/g, "]")
			.match(regExTag))
	}

	function getDate(_obj) {
		return (date = _obj.published_at.slice(0, 10).replace(/-/g, ""))
	}

	function getType(_obj) {
		return (type = _obj.post_type)
	}

	function getFileUrl(_obj) {
		switch (_obj.post_type) {
			case "image_file":
			case "audio_file":
				return (file_url = getAccess(_obj) ? _obj.post_file.url : undefined)
			case "video_embed":
				return (video_url = getAccess(_obj) ? _obj.embed.url : undefined)
			default:
				return undefined
		}
	}

	function getFormat(_obj) {
		if (getAccess(_obj) === true) {
			const splitUrl =
				_obj.post_type === "audio_file"
					? getFileUrl(_obj).split(".")
					: undefined
			return (fileFormat =
				splitUrl != undefined
					? splitUrl[splitUrl.length - 1].slice(0, 3)
					: undefined)
		}
	}

	function getArtworkUrl(_obj) {
		return (artworkUrl = _obj.image != null ? _obj.image.url : undefined)
	}
	
	function getAccess(_obj) {
		return (access = _obj.current_user_can_view)
	}
}
