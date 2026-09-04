const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

if (!content.includes('SectionNote')) {
  content = content.replace(
    "import { ShareSectionButton } from '../components/ShareSectionButton';",
    "import { ShareSectionButton } from '../components/ShareSectionButton';\nimport { SectionNote } from '../components/SectionNote';"
  );
}

const target = `Terms of Service.</p>
        </div>
      </section>`;

const replacement = `Terms of Service.</p>
          <SectionNote id="newsletter-section" isHighContrast={isHighContrast} />
        </div>
      </section>`;

content = content.replace(target, replacement);
fs.writeFileSync('src/pages/Home.tsx', content);
