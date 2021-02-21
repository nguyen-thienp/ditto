## Ditto
### What
Application that utilizes a headless browser to scrape a creator's entire Patreon post history via
official API and download attached audio files, optionally tagging them in the process<br>
Logs downloaded titles and skips them in future use cases

### Setup
Downlad repository and unpack it<br>
`npm install` in root directory<br>
Put patreon account cookies as `cookies.json` in the root directory<br>

### Usage
Options:
  
        --version         Show version number                              [boolean]
    -a, --artist      Name of the artist/creator of interest               [string]
    -c, --campaignId  ID number of artist's/creator's patreon campaign     [number]                
    -t, --tagging     Adds ID3 tags to downloaded audio files and attaches
                      post-included artwork as cover
                    
                      Tags added:
                      Title           title of the post the file is attached to
                      .               (excluding tags and special characters,
                      .               e.g. emojis)
                      originalArtist  the name of the artist/creator
                      year            publishing date of the post the file is
                      .               attached to (format: yyyymmdd)
                      genre           tags that were included in the title

                                                  [string] [choices: "all", "noArt"]
    -h, --help        Show help                                            [boolean]

### NPM dependencies
`node-id3`<br>
`nodejs-file-downloader`<br>
`puppeteer`<br>
`puppeteer-extra`<br>
`puppeteer-extra-plugin-stealth`<br>
`request`<br>
`yargs`

#### PS: You need a valid patreon account session ID to download any paid content (free content will still be downloaded even without)

### Future updates
Added statistics and info on what was downloaded:what was missed due to patron tiers<br>
Update on metadata<br>
-More formats supported for tagging<br>
-Use creator's PFP as cover if no artwork found<br>
