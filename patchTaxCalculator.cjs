const fs = require('fs');
let content = fs.readFileSync('src/pages/TaxCalculator.tsx', 'utf8');

content = content.replace(
  "import { TaxHistory, SavedCalculation } from '../components/calculator/TaxHistory';",
  "import { TaxHistory, SavedCalculation } from '../components/calculator/TaxHistory';\nimport { useAuth } from '../contexts/AuthContext';\nimport { db } from '../lib/firebase';\nimport { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy } from 'firebase/firestore';"
);

content = content.replace(
  "const [calcHistory, setCalcHistory] = useState<SavedCalculation[]>([]);",
  "const [calcHistory, setCalcHistory] = useState<SavedCalculation[]>([]);\n  const { user } = useAuth();"
);

// We need to patch the initial load
const targetUseEffectLoad = `  useEffect(() => {
    const savedData = localStorage.getItem('taxCalcData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.income !== undefined) setIncome(parsed.income);
        if (parsed.investments !== undefined) setInvestments(parsed.investments);
        if (parsed.category) setCategory(parsed.category);
        if (parsed.location) setLocation(parsed.location);
        if (parsed.disabledDependents !== undefined) setDisabledDependents(parsed.disabledDependents);
      } catch (e) {
        console.error('Failed to parse saved data', e);
      }
    }

    const savedHistory = localStorage.getItem('taxCalcHistory');
    if (savedHistory) {
      try {
        setCalcHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);`;

const replaceUseEffectLoad = `  useEffect(() => {
    const loadData = async () => {
      const savedData = localStorage.getItem('taxCalcData');
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          if (parsed.income !== undefined) setIncome(parsed.income);
          if (parsed.investments !== undefined) setInvestments(parsed.investments);
          if (parsed.category) setCategory(parsed.category);
          if (parsed.location) setLocation(parsed.location);
          if (parsed.disabledDependents !== undefined) setDisabledDependents(parsed.disabledDependents);
        } catch (e) {
          console.error('Failed to parse saved data', e);
        }
      }

      if (user) {
        try {
          const q = query(collection(db, 'taxCalculations'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
          const snapshot = await getDocs(q);
          const history = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              date: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
              year: '2026-27',
              income: data.income,
              tax: data.netTax
            };
          });
          setCalcHistory(history.slice(0, 10)); // Keep last 10
        } catch(e) {
          console.error('Error fetching tax history', e);
        }
      } else {
        const savedHistory = localStorage.getItem('taxCalcHistory');
        if (savedHistory) {
          try {
            setCalcHistory(JSON.parse(savedHistory));
          } catch (e) {
            console.error('Failed to parse history', e);
          }
        }
      }
    };
    loadData();
  }, [user]);`;

content = content.replace(targetUseEffectLoad, replaceUseEffectLoad);

// Patch handleSave
const targetHandleSave = `  const handleSave = () => {
    const data = { income, investments, category, location, disabledDependents };
    localStorage.setItem('taxCalcData', JSON.stringify(data));
    
    // Also save to history
    const newHistoryItem: SavedCalculation = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      year: '2026-27',
      income: calculation.totalIncome,
      tax: calculation.netTax
    };
    
    // Add fake historical data if empty to show the chart
    let updatedHistory = [...calcHistory];
    if (updatedHistory.length === 0) {
      updatedHistory = [
        { id: '1', date: new Date('2022-06-30').toISOString(), year: '2022-23', income: calculation.totalIncome * 0.8, tax: calculation.netTax * 0.75 },
        { id: '2', date: new Date('2023-06-30').toISOString(), year: '2023-24', income: calculation.totalIncome * 0.85, tax: calculation.netTax * 0.8 },
        { id: '3', date: new Date('2024-06-30').toISOString(), year: '2024-25', income: calculation.totalIncome * 0.9, tax: calculation.netTax * 0.85 },
        { id: '4', date: new Date('2025-06-30').toISOString(), year: '2025-26', income: calculation.totalIncome, tax: calculation.prevNetTax },
      ];
    }
    
    // Remove if 2026-27 already exists and update
    updatedHistory = updatedHistory.filter(h => h.year !== '2026-27');
    updatedHistory.push(newHistoryItem);
    
    setCalcHistory(updatedHistory);
    localStorage.setItem('taxCalcHistory', JSON.stringify(updatedHistory));
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };`;

const replaceHandleSave = `  const handleSave = async () => {
    const data = { income, investments, category, location, disabledDependents };
    localStorage.setItem('taxCalcData', JSON.stringify(data));
    
    if (user) {
      try {
        await addDoc(collection(db, 'taxCalculations'), {
          userId: user.uid,
          income: calculation.totalIncome,
          investments: parseFloat(investments) || 0,
          category,
          location,
          netTax: calculation.netTax,
          grossTax: calculation.grossTax,
          createdAt: serverTimestamp()
        });
        
        // Refresh history
        const q = query(collection(db, 'taxCalculations'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const history = snapshot.docs.map(doc => {
          const docData = doc.data();
          return {
            id: doc.id,
            date: docData.createdAt?.toDate().toISOString() || new Date().toISOString(),
            year: '2026-27',
            income: docData.income,
            tax: docData.netTax
          };
        });
        setCalcHistory(history.slice(0, 10));
      } catch(e) {
        console.error('Error saving to Firestore', e);
      }
    } else {
      // Also save to local history
      const newHistoryItem: SavedCalculation = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        year: '2026-27',
        income: calculation.totalIncome,
        tax: calculation.netTax
      };
      
      // Add fake historical data if empty to show the chart
      let updatedHistory = [...calcHistory];
      if (updatedHistory.length === 0) {
        updatedHistory = [
          { id: '1', date: new Date('2022-06-30').toISOString(), year: '2022-23', income: calculation.totalIncome * 0.8, tax: calculation.netTax * 0.75 },
          { id: '2', date: new Date('2023-06-30').toISOString(), year: '2023-24', income: calculation.totalIncome * 0.85, tax: calculation.netTax * 0.8 },
          { id: '3', date: new Date('2024-06-30').toISOString(), year: '2024-25', income: calculation.totalIncome * 0.9, tax: calculation.netTax * 0.85 },
          { id: '4', date: new Date('2025-06-30').toISOString(), year: '2025-26', income: calculation.totalIncome, tax: calculation.prevNetTax },
        ];
      }
      
      // Remove if 2026-27 already exists and update
      updatedHistory = updatedHistory.filter(h => h.year !== '2026-27');
      updatedHistory.push(newHistoryItem);
      
      setCalcHistory(updatedHistory);
      localStorage.setItem('taxCalcHistory', JSON.stringify(updatedHistory));
    }
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };`;

content = content.replace(targetHandleSave, replaceHandleSave);

fs.writeFileSync('src/pages/TaxCalculator.tsx', content);
console.log("Patched TaxCalculator.tsx");
