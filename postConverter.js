const fs = require('fs');
const BlogFileService = require('./blogFileService');
const sourcePaths = fs.readdirSync('src/posts');

async function main() {
    await BlogFileService.convertMarkdownArticles(sourcePaths);
    await BlogFileService.buildArticlesURLs('dist/posts');
}

main();