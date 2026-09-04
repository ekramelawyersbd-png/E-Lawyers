const fs = require('fs');

let content = fs.readFileSync('src/pages/TaxCalculator.tsx', 'utf8');

const targetState = `  const [calcHistory, setCalcHistory] = useState<SavedCalculation[]>([]);`;
const replaceState = `  const [calcHistory, setCalcHistory] = useState<SavedCalculation[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    setIsCalculating(true);
    const timer = setTimeout(() => setIsCalculating(false), 500);
    return () => clearTimeout(timer);
  }, [income, investments, category, location, disabledDependents]);`;

content = content.replace(targetState, replaceState);

fs.writeFileSync('src/pages/TaxCalculator.tsx', content);
console.log("State updated");
