# Github translated commits into gh-pages for documentation/changelog The project was created to generate translation for commit messages for supporting open source maintainers and repository owners to make it easier to write commit messages in other languages.

### Key Technologies
GitHub Pages
GitHub Action
MyMemory API (for translation)
Jekyll

There are two option for languages (source and target language), other information will be got automatically from workflow. The .yml file look like:  

``` yml
name: Translate commit message
on: [push]
jobs:
  run-script:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2
      - name: Install Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "18.x"
      - name: Install dependencies
        run: npm install
      - name: Get Commit Message
        id: commit_message
        run: echo "::set-output name=message::$(cat $GITHUB_EVENT_PATH | jq -r '.commits[0].message')"
      - name: Run Script
        run: node action/index.js
        env:
          TARGET_LANGUAGE: ES
          SOURCE_LANGUAGE: EN
          COMMIT_MESSAGE: ${{ steps.commit_message.outputs.message }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          USERNAME: ${{github.event.commits[0].author.username}}
          EMAIL: ${{github.event.commits[0].author.email}}
```

### Example images
![Bildschirmfoto 2023-05-10 um 22 12 58](https://github.com/Yordaniss/documentation/assets/68282006/bc91829b-0318-443c-8c0c-265a0eef61c6)
![Bildschirmfoto 2023-05-10 um 22 13 25](https://github.com/Yordaniss/documentation/assets/68282006/ad79f6d6-4047-48ec-af82-04a3cc723c8e)
![Bildschirmfoto 2023-05-10 um 22 14 09](https://github.com/Yordaniss/documentation/assets/68282006/9d1b7451-4938-43d1-9298-b9517d0ef189)


### Workflow

After commit was pushed, GitHub Action will trigger the translation process and create .md (filename -> today) in your "gh-pages" branch.
Translated text will be pushed into this file and other workflow process will trigger Jekyll creating process, that used this Markdown file
to create template as output.

Github detect automatically this branch (gh-pages) as branch for documentation and generate page for this.
