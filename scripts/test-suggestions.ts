import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { MutantResult } from '@stryker-mutator/api/core';
import { cwd } from 'node:process';

const __filename = join(cwd(), './reports/mutation/mutation.json')

interface MutationResult {
  files: {
    [key: string]: {
      mutants: MutantResult[];
    };
  };
}

const generateTestSuggestion = async (): Promise<void> => {
  const mutationResults = JSON.parse(
    await readFile(__filename, 'utf8')
  ) as MutationResult;

  Object.entries(mutationResults.files).forEach(([file, data]) => {
    const survivedMutants = data.mutants.filter(
      (mutant) => mutant.status === 'Survived'
    );

    if (survivedMutants.length > 0) {
      console.log(`\nTest suggestions for ${file}:`);
      
      survivedMutants.forEach((mutant) => {
        const { mutatorName, replacement, location } = mutant;
        
        console.log(`\nLine ${location.start.line}:`);
        console.log('Suggested test:');
        console.log('```typescript');
        console.log(`describe('${file}', () => {`);
        console.log(`  test('should handle ${mutatorName} mutation', () => {`);
        console.log(`    // Mutated to: ${replacement}`);
        console.log('    // TODO: Write test to catch this mutation');
        console.log('  });');
        console.log('});');
        console.log('```');
      });
    }
  });
};

generateTestSuggestion();
