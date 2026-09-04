const fs = require('fs');

let content = fs.readFileSync('src/pages/TaxCalculator.tsx', 'utf8');

// 1. Tax Summary replacement
const targetSummary = `               <div className="mb-8">
                 <div className="text-emerald-200 text-sm font-bold uppercase tracking-widest mb-1">Estimated Net Tax Payable</div>
                 <div className="text-4xl md:text-5xl font-bold">
                   Tk {Math.round(calculation.netTax).toLocaleString()}
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div className="bg-emerald-800/50 p-4 rounded-2xl border border-emerald-700/50">
                   <div className="text-emerald-200 text-xs font-bold uppercase tracking-widest mb-1">Gross Tax</div>
                   <div className="text-xl font-bold">Tk {Math.round(calculation.grossTax).toLocaleString()}</div>
                 </div>
                 <div className="bg-emerald-800/50 p-4 rounded-2xl border border-emerald-700/50">
                   <div className="text-emerald-200 text-xs font-bold uppercase tracking-widest mb-1">Investment Rebate</div>
                   <div className="text-xl font-bold">Tk {Math.round(calculation.eligibleRebate).toLocaleString()}</div>
                 </div>
               </div>`;

const replaceSummary = `               <div className="mb-8">
                 <div className="text-emerald-200 text-sm font-bold uppercase tracking-widest mb-1">Estimated Net Tax Payable</div>
                 <div className="text-4xl md:text-5xl font-bold h-12 flex items-center">
                   {isCalculating ? (
                     <div className="h-10 w-48 bg-emerald-800/60 rounded-xl animate-pulse" />
                   ) : (
                     \`Tk \${Math.round(calculation.netTax).toLocaleString()}\`
                   )}
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div className="bg-emerald-800/50 p-4 rounded-2xl border border-emerald-700/50">
                   <div className="text-emerald-200 text-xs font-bold uppercase tracking-widest mb-1">Gross Tax</div>
                   <div className="text-xl font-bold h-7 flex items-center">
                     {isCalculating ? <div className="h-6 w-24 bg-emerald-700/60 rounded-md animate-pulse" /> : \`Tk \${Math.round(calculation.grossTax).toLocaleString()}\`}
                   </div>
                 </div>
                 <div className="bg-emerald-800/50 p-4 rounded-2xl border border-emerald-700/50">
                   <div className="text-emerald-200 text-xs font-bold uppercase tracking-widest mb-1">Investment Rebate</div>
                   <div className="text-xl font-bold h-7 flex items-center">
                     {isCalculating ? <div className="h-6 w-24 bg-emerald-700/60 rounded-md animate-pulse" /> : \`Tk \${Math.round(calculation.eligibleRebate).toLocaleString()}\`}
                   </div>
                 </div>
               </div>`;

content = content.replace(targetSummary, replaceSummary);

// 2. Calculation Breakdown replacement
const targetBreakdown = `            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-600 font-medium">Total Income</span>
                <span className="font-bold text-slate-900">Tk {calculation.totalIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-dashed border-slate-200">
                <span className="text-slate-600 font-medium">Tax-Free Exemption</span>
                <span className="font-bold text-slate-900">- Tk {calculation.totalExemption.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 text-lg">
                <span className="font-bold text-slate-900">Taxable Income</span>
                <span className="font-bold text-emerald-700">Tk {calculation.taxableIncome.toLocaleString()}</span>
              </div>
            </div>`;

const replaceBreakdown = `            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-600 font-medium">Total Income</span>
                {isCalculating ? <div className="h-5 w-24 bg-slate-200 rounded animate-pulse" /> : <span className="font-bold text-slate-900">Tk {calculation.totalIncome.toLocaleString()}</span>}
              </div>
              <div className="flex justify-between items-center py-2 border-b border-dashed border-slate-200">
                <span className="text-slate-600 font-medium">Tax-Free Exemption</span>
                {isCalculating ? <div className="h-5 w-24 bg-slate-200 rounded animate-pulse" /> : <span className="font-bold text-slate-900">- Tk {calculation.totalExemption.toLocaleString()}</span>}
              </div>
              <div className="flex justify-between items-center py-2 text-lg">
                <span className="font-bold text-slate-900">Taxable Income</span>
                {isCalculating ? <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" /> : <span className="font-bold text-emerald-700">Tk {calculation.taxableIncome.toLocaleString()}</span>}
              </div>
            </div>`;

content = content.replace(targetBreakdown, replaceBreakdown);

// 3. Tax Slabs replacement
const targetSlabs = `<tbody className="divide-y divide-slate-100 text-slate-700">
                      {calculation.slabBreakdown.map((slab, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-3">{slab.label} @ {slab.rate}</td>
                          <td className="px-6 py-3">{slab.amount.toLocaleString()}</td>
                          <td className="px-6 py-3 text-right font-medium">{Math.round(slab.tax).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>`;

const replaceSlabs = `<tbody className="divide-y divide-slate-100 text-slate-700">
                      {isCalculating ? (
                        Array.from({ length: 3 }).map((_, i) => (
                          <tr key={i}>
                            <td className="px-6 py-3"><div className="h-4 w-32 bg-slate-200 rounded animate-pulse" /></td>
                            <td className="px-6 py-3"><div className="h-4 w-24 bg-slate-200 rounded animate-pulse" /></td>
                            <td className="px-6 py-3 flex justify-end"><div className="h-4 w-16 bg-slate-200 rounded animate-pulse" /></td>
                          </tr>
                        ))
                      ) : (
                        calculation.slabBreakdown.map((slab, i) => (
                          <tr key={i} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-3">{slab.label} @ {slab.rate}</td>
                            <td className="px-6 py-3">{slab.amount.toLocaleString()}</td>
                            <td className="px-6 py-3 text-right font-medium">{Math.round(slab.tax).toLocaleString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>`;

content = content.replace(targetSlabs, replaceSlabs);

// 4. Chart replacement
const targetChart = `<ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={calculation.slabBreakdown.filter(slab => slab.amount > 0).map(slab => ({
                      name: slab.rate,
                      income: Math.round(slab.amount),
                      tax: Math.round(slab.tax),
                      label: slab.label
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis yAxisId="left" orientation="left" stroke="#10b981" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={(value) => \`\${value / 1000}k\`} />
                    <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={(value) => \`\${value / 1000}k\`} />
                    <Tooltip 
                      formatter={(value, name) => [\`Tk \${Number(value).toLocaleString()}\`, name === 'income' ? 'Income in Slab' : 'Tax Amount']}
                      labelFormatter={(label, payload) => payload.length > 0 ? payload[0].payload.label : label}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      cursor={{ fill: '#f8fafc' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Bar yAxisId="left" dataKey="income" name="income" fill="#34d399" radius={[4, 4, 0, 0]} barSize={40} />
                    <Bar yAxisId="right" dataKey="tax" name="tax" fill="#fb7185" radius={[4, 4, 0, 0]} barSize={40} />
                  </RechartsBarChart>
                </ResponsiveContainer>`;

const replaceChart = `{isCalculating ? (
                  <div className="w-full h-full flex items-end justify-center gap-4 pb-12 pt-8">
                    {[40, 70, 30, 90, 50].map((h, i) => (
                      <div key={i} className="flex gap-1 items-end h-full">
                        <div className="w-8 bg-slate-200 rounded-t animate-pulse" style={{ height: \`\${h}%\` }} />
                        <div className="w-8 bg-slate-200/60 rounded-t animate-pulse" style={{ height: \`\${h * 0.4}%\` }} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={calculation.slabBreakdown.filter(slab => slab.amount > 0).map(slab => ({
                        name: slab.rate,
                        income: Math.round(slab.amount),
                        tax: Math.round(slab.tax),
                        label: slab.label
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <YAxis yAxisId="left" orientation="left" stroke="#10b981" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={(value) => \`\${value / 1000}k\`} />
                      <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={(value) => \`\${value / 1000}k\`} />
                      <Tooltip 
                        formatter={(value, name) => [\`Tk \${Number(value).toLocaleString()}\`, name === 'income' ? 'Income in Slab' : 'Tax Amount']}
                        labelFormatter={(label, payload) => payload.length > 0 ? payload[0].payload.label : label}
                        contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        cursor={{ fill: '#f8fafc' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Bar yAxisId="left" dataKey="income" name="income" fill="#34d399" radius={[4, 4, 0, 0]} barSize={40} />
                      <Bar yAxisId="right" dataKey="tax" name="tax" fill="#fb7185" radius={[4, 4, 0, 0]} barSize={40} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                )}`;

content = content.replace(targetChart, replaceChart);

fs.writeFileSync('src/pages/TaxCalculator.tsx', content);
console.log("UI updated");
