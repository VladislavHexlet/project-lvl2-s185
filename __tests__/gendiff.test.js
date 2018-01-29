import fs from 'fs';
import genDiff from '../src';

const pathOldJson = '__tests__/__fixtures__/before.json';
const pathNewJson = '__tests__/__fixtures__/after.json';

const pathOldYaml = '__tests__/__fixtures__/before.yaml';
const pathNewYaml = '__tests__/__fixtures__/after.yaml';

const pathOldIni = '__tests__/__fixtures__/before.ini';
const pathNewIni = '__tests__/__fixtures__/after.ini';

const pathToResult = '__tests__/__fixtures__/result.txt';

it('test json format', () => {
  const resultJson = fs.readFileSync(pathToResult, 'utf-8');
  expect(genDiff(pathOldJson, pathNewJson)).toBe(resultJson);
});

it('test yaml format', () => {
  const resultYaml = fs.readFileSync(pathToResult, 'utf-8');
  expect(genDiff(pathOldYaml, pathNewYaml)).toBe(resultYaml);
});

it('test ini format', () => {
  const resultIni = fs.readFileSync(pathToResult, 'utf-8');
  expect(genDiff(pathOldIni, pathNewIni)).toBe(resultIni);
});
