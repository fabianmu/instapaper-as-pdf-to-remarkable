# howto

1. copy `.env.example` to `.env`
2. get a token at http://pdf.cool and put it into your `.env`
3. login to instapaper in your browser and get the cookies via inspector (_hey, this is just a hack, ok_) and put them into your `.env`
4. run `node .`

As a result all your Instapaper articles from the "Home"-Folder that could be downloaded via pdf.cool should appear as .pdf file in ./

# todo
[ ] implement https://github.com/reHackable/scripts/blob/master/host/repush.sh to push PDFs straigt to the remarkable