const fs = require('fs');
let content = fs.readFileSync('src/pages/TaxPolicyAnalysis.tsx', 'utf8');

const targetStr = `      if (!response.ok) {
        throw new Error('Failed to analyze tax policy');
      }

      const data = await response.json();
      setAnalysisResult(data.text);
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching the analysis. Please try again.');
    }`;

const newStr = `      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze tax policy');
      }

      setAnalysisResult(data.text);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while fetching the analysis. Please try again.');
    }`;

content = content.replace(targetStr, newStr);

fs.writeFileSync('src/pages/TaxPolicyAnalysis.tsx', content);
