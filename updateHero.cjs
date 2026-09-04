const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const target = `<section className="pt-8 pb-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-slate-900 rounded-3xl p-8 md:p-16 relative overflow-hidden flex flex-col justify-end text-white border border-slate-800 shadow-xl">
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 opacity-90" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">`;

const replacement = `<section className="w-full relative">
        <div className="bg-slate-900 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col justify-center min-h-[calc(100vh-130px)] text-white shadow-xl">
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 opacity-90" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto w-full">`;

content = content.replace(target, replacement);
fs.writeFileSync('src/pages/Home.tsx', content);
