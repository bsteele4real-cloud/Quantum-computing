import test from 'node:test';
import assert from 'node:assert/strict';
import { selectMessageFile } from './locale.js';

const messages = {
  en: { title: 'en' },
  zh_cn: { title: 'zh-cn' },
  zh_tw: { title: 'zh-tw' },
  'pt-BR': { title: 'pt-br' },
};

test('region codes match translation keys that use underscores', () => {
  assert.equal(selectMessageFile(messages, 'zh-CN').title, 'zh-cn');
  assert.equal(selectMessageFile(messages, 'zh_TW').title, 'zh-tw');
  assert.equal(selectMessageFile(messages, 'pt-BR').title, 'pt-br');
});

test('a language prefix matches, and an unknown locale falls back to English', () => {
  assert.equal(selectMessageFile(messages, 'en-US').title, 'en');
  assert.equal(selectMessageFile(messages, 'zh').title, 'en');
  assert.equal(selectMessageFile(messages, 'de-DE').title, 'en');
  assert.equal(selectMessageFile(messages, '').title, 'en');
});
