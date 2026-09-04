const fs = require('fs');

let content = fs.readFileSync('src/pages/TaxCalculator.tsx', 'utf8');

// Update imports
if (!content.includes('BarChart as RechartsBarChart')) {
  content = content.replace(
    "import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';",
    "import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';"
  );
}

// Replace PieChart block with BarChart
const oldChart = `<div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex items-center gap-2">
                <BarChart className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900">Tax Distribution by Slab</h3>
              </div>
              <div className="p-6 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={calculation.slabBreakdown.filter(slab => slab.tax > 0).map(slab => ({
                        name: slab.label,
                        value: Math.round(slab.tax)
                      }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {calculation.slabBreakdown.filter(slab => slab.tax > 0).map((entry, index) => (
                        <Cell key={\`cell-\${index}\`} fill={['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'][index % 5]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => \`Tk \${value.toLocaleString()}\`}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>`;

const newChart = `<div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex items-center gap-2">
                <BarChart className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900">Taxable Income vs Tax Slabs</h3>
              </div>
              <div className="p-6 h-[350px]">
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
              </div>`;

if (content.includes('RechartsPieChart')) {
  content = content.replace(oldChart, newChart);
  fs.writeFileSync('src/pages/TaxCalculator.tsx', content);
  console.log('Replaced chart successfully');
} else {
  console.log('Could not find RechartsPieChart code block to replace');
}
