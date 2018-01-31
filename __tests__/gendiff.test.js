import fs from 'fs';
import genDiff from '../src';

const pathOldJson = '__tests__/__fixtures__/before.json';
const pathNewJson = '__tests__/__fixtures__/after.json';

const pathOldYaml = '__tests__/__fixtures__/before.yaml';
const pathNewYaml = '__tests__/__fixtures__/after.yaml';

const pathOldIni = '__tests__/__fixtures__/before.ini';
const pathNewIni = '__tests__/__fixtures__/after.ini';

const pathOldplain = '__tests__/__fixtures__/plain-before.json';
const pathNewplain = '__tests__/__fixtures__/plain-after.json';

const pathToResult = '__tests__/__fixtures__/result.txt';
const pathToResultPlain = '__tests__/__fixtures__/plain-result.txt';

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

it('test plain format', () => {
  const resultPlain = fs.readFileSync(pathToResultPlain, 'utf-8');
  expect(genDiff(pathOldplain, pathNewplain, 'plain')).toBe(resultPlain);
});
