const fs = require('fs');

// 1. metadata.json
let metadata = fs.readFileSync('metadata.json', 'utf8');
metadata = metadata.replace(/"name": ".*?"/, '"name": "E-Lawyers blog"');
fs.writeFileSync('metadata.json', metadata);

// 2. index.html
let index = fs.readFileSync('index.html', 'utf8');
index = index.replace(/<title>.*?<\/title>/, '<title>E-Lawyers blog</title>');
fs.writeFileSync('index.html', index);

// 3. Navbar.tsx
let navbar = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf8');
navbar = navbar.replace(/<h1.*?E-Lawyers <span.*?Bangladesh<\/span><\/h1>/g, '<h1 className="text-xl font-bold tracking-tight text-slate-800 mb-1">E-Lawyers <span className="text-emerald-700">blog</span></h1>');
fs.writeFileSync('src/components/layout/Navbar.tsx', navbar);

// 4. Footer.tsx
let footer = fs.readFileSync('src/components/layout/Footer.tsx', 'utf8');
footer = footer.replace(/<span.*?E-Lawyers <span.*?Bangladesh<\/span><\/span>/g, '<span className="font-bold text-xl text-white">E-Lawyers <span className="text-emerald-500">blog</span></span>');
footer = footer.replace(/About E-Lawyers/g, 'About E-Lawyers blog');
footer = footer.replace(/© \{new Date\(\)\.getFullYear\(\)\} E-Lawyers Bangladesh/g, '© {new Date().getFullYear()} E-Lawyers blog');
fs.writeFileSync('src/components/layout/Footer.tsx', footer);

// 5. Check if we missed any E-Lawyers Bangladesh in src
function replaceInFile(filePath) {
    if(fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(/E-Lawyers Bangladesh/g, 'E-Lawyers blog');
        content = content.replace(/E-Lawyers /g, 'E-Lawyers blog ');
        // Avoid double "blog blog" just in case
        content = content.replace(/E-Lawyers blog blog/g, 'E-Lawyers blog');
        fs.writeFileSync(filePath, content);
    }
}

const teamPath = 'src/data/teamData.ts';
replaceInFile(teamPath);
