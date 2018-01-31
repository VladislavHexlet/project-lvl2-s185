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

const pathOldJsonOutput = '__tests__/__fixtures__/before-output-json.json';
const pathNewJsonOutput = '__tests__/__fixtures__/after-output-json.json';

const pathToResult = '__tests__/__fixtures__/result.txt';
const pathToResultPlain = '__tests__/__fixtures__/plain-result.txt';

it('test json files', () => {
  const resultJson = fs.readFileSync(pathToResult, 'utf-8');
  expect(genDiff(pathOldJson, pathNewJson)).toBe(resultJson);
});

it('test yaml files', () => {
  const resultYaml = fs.readFileSync(pathToResult, 'utf-8');
  expect(genDiff(pathOldYaml, pathNewYaml)).toBe(resultYaml);
});

it('test ini files', () => {
  const resultIni = fs.readFileSync(pathToResult, 'utf-8');
  expect(genDiff(pathOldIni, pathNewIni)).toBe(resultIni);
});

it('test plain format', () => {
  const resultPlainFormat = fs.readFileSync(pathToResultPlain, 'utf-8');
  expect(genDiff(pathOldplain, pathNewplain, 'plain')).toBe(resultPlainFormat);
});

it('test output in json format', () => {
  const resultOutputJsonFormat = '{"children":[{"name":"host","type":"stayed","children":[],"value":{"previousValue":"hexlet.io","newValue":"hexlet.io"}},{"name":"timeout","type":"updated","children":[],"value":{"previousValue":50,"newValue":20}},{"name":"proxy","type":"removed","children":[],"value":{"previousValue":"123.234.53.22","newValue":""}},{"name":"verbose","type":"added","children":[],"value":{"previousValue":"","newValue":true}}]}';
  expect(genDiff(pathOldJsonOutput, pathNewJsonOutput, 'json')).toBe(resultOutputJsonFormat);
});
