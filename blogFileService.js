const showdown = require('showdown');
const fs = require('fs');
const fsPromises = fs.promises;

const converter = new showdown.Converter();

class BlogFileService {
    static async convertMarkdownArticles(paths) {
        await fs.promises.mkdir('dist/posts', {recursive: true});
        paths.forEach(async path => {
            await fsPromises.mkdir(`dist/posts/${path}`, {recursive: true});
            const data = await fsPromises.readFile(`src/posts/${path}/index.md`, 'utf-8');
            let html = converter.makeHtml(data);
            const skeletonHTML = await fsPromises.readFile('src/blog-skeleton.html', 'utf-8');
            html = skeletonHTML.replace(/<!-- blog content goes here -->/gi, html);
            await fsPromises.writeFile(`dist/posts/${path}/index.html`, html, 'utf-8');
        });
        return;
    }

    static async buildArticlesURLs(directory) {
        const data = await fsPromises.readdir(directory);
        const convertedPosts = data.map(post => `<a href="posts/${post}">${post}</a>`);
        const skeletonData = await fsPromises.readFile('index-skeleton.html', 'utf-8');
        await fsPromises.writeFile(
            'dist/index.html', 
            skeletonData.replace(/<!-- articles go here -->/gi, 
            convertedPosts.join('\n')), 'utf-8'
        )
    }
    return;
}

module.exports =  BlogFileService;