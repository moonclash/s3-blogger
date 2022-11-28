const showdown = require('showdown');
const fs = require('fs');

const converter = new showdown.Converter();
const sourcePaths = fs.readdirSync('src/posts');

sourcePaths.forEach(path => {
    fs.mkdir(`dist/posts/${path}`, {recursive: true}, (error, _) => {
        if (error) {
            throw new Error();
        }
    });
    fs.readFile(`src/posts/${path}/index.md`, 'utf-8', async (error, data) => {
        if (error) {
            throw new Error();
        }
        let html = converter.makeHtml(data);
        const skeletonHTML = fs.readFileSync('src/blog-skeleton.html', 'utf-8');
        html = skeletonHTML.replace(/<!-- blog content goes here -->/gi, html);
        fs.writeFile(`dist/posts/${path}/index.html`, html, 'utf-8', (err, data) => {
            if (error) {
                throw new Error();
            }
        })
    });
});