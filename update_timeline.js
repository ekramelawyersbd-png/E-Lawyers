const fs = require('fs');

const path = 'src/components/dashboard/ComplianceCalendar.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add 'individual' to EntityType
content = content.replace("type EntityType = 'public' | 'private' | 'foreign_branch';", "type EntityType = 'public' | 'private' | 'foreign_branch' | 'individual';");

// Update select menu for EntityType and conditionally hide YearEnd
content = content.replace(
  /<select \s*value=\{entityType\}.*?<\/select>/s,
  `<select 
              value={entityType}
              onChange={(e) => setEntityType(e.target.value as EntityType)}
              className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 cursor-pointer outline-none"
            >
              <option value="private">Private Limited</option>
              <option value="public">Public Limited</option>
              <option value="foreign_branch">Foreign Branch</option>
              <option value="individual">Individual / HUF</option>
            </select>`
);

content = content.replace(
  /<div className="w-px h-4 bg-slate-300"><\/div>\s*<select \s*value=\{yearEnd\}.*?<\/select>/s,
  `{entityType !== 'individual' && (
              <>
                <div className="w-px h-4 bg-slate-300"></div>
                <select 
                  value={yearEnd}
                  onChange={(e) => setYearEnd(e.target.value as YearEnd)}
                  className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 cursor-pointer outline-none mr-2"
                >
                  <option value="june">Jun 30 Year End</option>
                  <option value="december">Dec 31 Year End</option>
                </select>
              </>
            )}`
);

// Update timelineData logic
const timelineDataMatch = /const timelineData = useMemo\(\(\) => \{.*?(?:return \{\s*incomeYearEnd.*?\};\s*\}, \[yearEnd, currentDate\]\);)/s;

const newTimelineData = `const timelineData = useMemo(() => {
    const currentYear = currentDate.getFullYear();
    let incomeYearEnd;
    
    if (entityType === 'individual' || yearEnd === 'june') {
      incomeYearEnd = new Date(currentYear, 5, 30);
      if (currentDate < incomeYearEnd) { 
        incomeYearEnd = new Date(currentYear - 1, 5, 30);
      }
    } else {
      incomeYearEnd = new Date(currentYear - 1, 11, 31);
    }
    
    let earlyEnd, regularEnd, late1End, lateEnd;
    let currentPeriod = '';
    let progress = 0;
    let isIndividual = entityType === 'individual';

    if (isIndividual) {
      earlyEnd = new Date(incomeYearEnd);
      earlyEnd.setMonth(earlyEnd.getMonth() + 3);
      
      regularEnd = new Date(earlyEnd);
      regularEnd.setMonth(regularEnd.getMonth() + 3);
      
      late1End = new Date(regularEnd);
      late1End.setMonth(late1End.getMonth() + 3);
      
      lateEnd = new Date(late1End);
      lateEnd.setMonth(lateEnd.getMonth() + 3);
      
      const totalDuration = lateEnd.getTime() - incomeYearEnd.getTime();
      const currentElapsed = currentDate.getTime() - incomeYearEnd.getTime();
      progress = Math.max(0, Math.min(100, (currentElapsed / totalDuration) * 100));
      
      if (currentDate <= earlyEnd) currentPeriod = 'Early Filing';
      else if (currentDate <= regularEnd) currentPeriod = 'Regular Filing';
      else if (currentDate <= late1End) currentPeriod = 'Late Filing (Q3)';
      else if (currentDate <= lateEnd) currentPeriod = 'Late Filing (Q4)';
      else currentPeriod = 'Closed';
    } else {
      earlyEnd = new Date(incomeYearEnd);
      earlyEnd.setMonth(earlyEnd.getMonth() + 6);
          
      regularEnd = new Date(earlyEnd);
      regularEnd.setMonth(regularEnd.getMonth() + 3);
      regularEnd.setDate(regularEnd.getDate() + 15);
          
      lateEnd = new Date(regularEnd);
      lateEnd.setMonth(lateEnd.getMonth() + 2);
      lateEnd.setDate(lateEnd.getDate() + 15);
      late1End = null;
      
      const totalDuration = lateEnd.getTime() - incomeYearEnd.getTime();
      const currentElapsed = currentDate.getTime() - incomeYearEnd.getTime();
      progress = Math.max(0, Math.min(100, (currentElapsed / totalDuration) * 100));

      if (currentDate <= earlyEnd) currentPeriod = 'Early Filing';
      else if (currentDate <= regularEnd) currentPeriod = 'Regular Filing';
      else if (currentDate <= lateEnd) currentPeriod = 'Late Filing';
      else currentPeriod = 'Closed';
    }

    return {
      incomeYearEnd,
      earlyEnd,
      regularEnd,
      late1End,
      lateEnd,
      currentPeriod,
      progress,
      isIndividual
    };
  }, [entityType, yearEnd, currentDate]);`;

content = content.replace(timelineDataMatch, newTimelineData);


// Update UI render
const uiMatch = /\{\/\* Corporate Tax Filing Timeline \*\/\}[\s\S]*?(?=<div className="flex items-center gap-2 mb-4 px-1">)/;

const newUI = `{/* Tax Filing Timeline */}
      <div className="mb-10 bg-slate-50 p-6 rounded-2xl border border-slate-200">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-6 gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">
              {timelineData.isIndividual ? 'Individual Tax Return Timeline' : 'Corporate Tax Return Timeline'}
            </h3>
            <p className="text-sm text-slate-600">Assessment Year based on Income Year ending {format(timelineData.incomeYearEnd, 'MMM dd, yyyy')}</p>
          </div>
          <div className="sm:text-right">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Current Status</div>
            <div className={\`font-bold px-3 py-1 rounded-lg text-sm inline-block \${
              timelineData.currentPeriod === 'Early Filing' ? 'bg-emerald-100 text-emerald-700' :
              timelineData.currentPeriod === 'Regular Filing' ? 'bg-amber-100 text-amber-700' :
              timelineData.currentPeriod.includes('Late Filing') ? 'bg-rose-100 text-rose-700' :
              'bg-slate-200 text-slate-700'
            }\`}>
              {timelineData.currentPeriod}
            </div>
          </div>
        </div>

        <div className="relative pt-6 pb-2">
          {/* Progress Indicator */}
          {timelineData.progress > 0 && timelineData.progress <= 100 && (
            <div 
              className="absolute top-0 bottom-2 flex flex-col items-center z-10"
              style={{ left: \`\${timelineData.progress}%\`, transform: 'translateX(-50%)' }}
            >
              <div className="bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-md mb-1 whitespace-nowrap shadow-sm">
                Today
              </div>
              <div className="w-0.5 h-full bg-slate-800/20"></div>
            </div>
          )}

          {timelineData.isIndividual ? (
            <>
              {/* Individual Bar */}
              <div className="w-full bg-slate-200 rounded-full h-3 mb-3 flex overflow-hidden relative">
                <div className="bg-emerald-400 h-full relative" style={{ width: '25%' }} title="Early Filing"></div>
                <div className="bg-amber-400 h-full relative" style={{ width: '25%' }} title="Regular Filing"></div>
                <div className="bg-orange-400 h-full relative" style={{ width: '25%' }} title="Late Filing (Q3)"></div>
                <div className="bg-rose-500 h-full relative" style={{ width: '25%' }} title="Late Filing (Q4)"></div>
              </div>
              
              <div className="flex justify-between text-[10px] sm:text-xs font-bold text-slate-500 px-1 relative">
                <div className="flex flex-col items-start w-[25%]">
                  <span className="text-emerald-700 mb-0.5">Early (-5% or 25k)</span>
                  <span className="font-medium text-slate-400">By {format(timelineData.earlyEnd, 'MMM dd')}</span>
                </div>
                <div className="flex flex-col items-start w-[25%]">
                  <span className="text-amber-700 mb-0.5">Regular (No Penalty)</span>
                  <span className="font-medium text-slate-400">By {format(timelineData.regularEnd, 'MMM dd')}</span>
                </div>
                <div className="flex flex-col items-start w-[25%]">
                  <span className="text-orange-700 mb-0.5">Late (+2% or 3k)</span>
                  <span className="font-medium text-slate-400">By {format(timelineData.late1End!, 'MMM dd')}</span>
                </div>
                <div className="flex flex-col items-end w-[25%] text-right">
                  <span className="text-rose-700 mb-0.5">Late (+5% or 5k)</span>
                  <span className="font-medium text-slate-400">By {format(timelineData.lateEnd, 'MMM dd')}</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <div className="text-sm text-emerald-900">
                  <span className="font-bold">New Taxpayers:</span> First-time filers can submit by June 30 of the following year without late penalties.
                  <br/>
                  <span className="font-bold">Holiday Rule:</span> If a deadline falls on a government holiday, the immediate next working day is treated as the final submission date.
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Corporate Bar */}
              <div className="w-full bg-slate-200 rounded-full h-3 mb-3 flex overflow-hidden relative">
                <div className="bg-emerald-400 h-full relative" style={{ width: '50%' }} title="Early Filing"></div>
                <div className="bg-amber-400 h-full relative" style={{ width: '29%' }} title="Regular Filing"></div>
                <div className="bg-rose-400 h-full relative" style={{ width: '21%' }} title="Late Filing"></div>
              </div>
              
              <div className="flex justify-between text-xs font-bold text-slate-500 px-1 relative">
                <div className="flex flex-col items-start w-[50%]">
                  <span className="text-emerald-700 mb-0.5">Early (5% Rebate)</span>
                  <span className="font-medium text-slate-400">By {format(timelineData.earlyEnd, 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex flex-col items-start w-[29%]">
                  <span className="text-amber-700 mb-0.5">Regular</span>
                  <span className="font-medium text-slate-400">By {format(timelineData.regularEnd, 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex flex-col items-end w-[21%] text-right">
                  <span className="text-rose-700 mb-0.5">Late (+Penalty)</span>
                  <span className="font-medium text-slate-400">By {format(timelineData.lateEnd, 'MMM dd, yyyy')}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      `;

content = content.replace(uiMatch, newUI);

fs.writeFileSync(path, content, 'utf8');
