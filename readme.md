# howto

1. copy `.env.example` to `.env`
2. get a token at http://pdf.cool and put it into your `.env`
3. login to instapaper in your browser and get the cookies via inspector (_hey, this is just a hack, ok_) and put them into your `.env`
4. create folder named `Instapaper` on the remarkable
5. run `node .`

As a result all your Instapaper articles from the "Home"-Folder that could be downloaded via pdf.cool should appear as .pdf file in ./pdfs

# props

uses the binary from the ace [ReMarkable Cloud Go API](https://github.com/juruen/rmapi) to put the downloaded PDFs straight to the RM-Cloud. Please run `./rmapi` as stated in [ReMarkable Cloud Go API](https://github.com/juruen/rmapi) to auth.
