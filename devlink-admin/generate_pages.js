const fs = require('fs');

const pages = [
  {name:'Team',path:'team',desc:'Manage core team members, assign roles, and track responsibilities.'},
  {name:'Speakers',path:'speakers',desc:'Maintain a database of past and upcoming guest speakers.'},
  {name:'Partners & Sponsors',path:'partners',desc:'Manage company relationships, sponsorship tiers, and logos.'},
  {name:'Certificates',path:'certificates',desc:'Automate and distribute event certificates to attendees.'},
  {name:'Analytics',path:'analytics',desc:'Deep-dive analytics on community engagement and platform growth.'},
  {name:'Finance',path:'finance',desc:'Track event costs, sponsor revenue, and budget allocation.'},
  {name:'Content Management',path:'cms',desc:'Write blogs, send newsletters, and update website content.'},
  {name:'Resources',path:'resources',desc:'Host shared assets, brand kits, and document templates.'}
];

pages.forEach(p => {
  fs.mkdirSync('src/app/'+p.path, {recursive: true});
  const componentName = p.path.charAt(0).toUpperCase() + p.path.slice(1) + 'Page';
  const content = `import { Hammer } from "lucide-react";

export default function ${componentName}() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">${p.name}</h1>
        <p className="text-text-muted mt-1">${p.desc}</p>
      </div>
      <div className="glass-panel p-12 flex flex-col items-center justify-center text-center mt-8">
        <Hammer className="w-12 h-12 text-primary mb-4 animate-pulse" />
        <h3 className="text-lg font-semibold text-text-primary mb-2">Under Construction</h3>
        <p className="text-text-muted max-w-sm">We are actively building this feature. Check back soon for updates!</p>
      </div>
    </div>
  );
}
`;
  fs.writeFileSync('src/app/'+p.path+'/page.tsx', content);
});

console.log("Created all pages");
