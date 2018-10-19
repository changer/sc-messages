const Sheets = require('google-spreadsheet-to-json');
const fs = require('fs');

const ARGS = process.argv.slice(2);

const CMD = ARGS[0];
const KEY = '1qqmMpLa7H1Tqsm2I_bpbKx8Su7NVX00cZztG1WkhSYs';
const LANGUAGES = ['en', 'nl'];//, 'de', 'it'];
const PREFIXES = { en: 'en_US', nl: 'nl_NL' };//, de: 'de_DE', it: 'it-IT' };
const FILES = ['base_email', 'email', 'push', 'web'];

const info = msg => console.info('\x1b[32m%s\x1b[0m', msg);
const error = msg => console.error('\x1b[31m%s\x1b[0m', msg);
const print = msg => console.log(msg);

if (CMD === 'read') {
  FILES.forEach(file => {
    let data = {};

    LANGUAGES.forEach(language => {
      const path = `${__dirname}/notifications/${PREFIXES[language]}_${file}.json`;

      let values = {};

      try {
        values = require(path); // eslint-disable-line
      }
      catch (ex) {}

      if (Array.isArray(values)) {
        values.forEach(row => {
          data[row.id] = data[row.id] || {};

          if (row.translation.one && row.translation.other) {
            data[row.id][language] = `${row.translation.other}|${row.translation.one}`;
          }
          else {
            data[row.id][language] = row.translation;
          }
        });
      }
      else {
        Object.keys(values).forEach(key => {
          data[key] = data[key] || {};
          data[key][language] = values[key];
        });
      }
    });

    output = Object.keys(data).reduce((output, key) => {
      const row = [key].concat(LANGUAGES.map(language => data[key][language]));
      return output.concat('\n', row.join('\t'));
    }, ['key', ...LANGUAGES].join('\t'));

    info(`\nTabular data for ${file}:\n`);
    print(`${output}`);
  });

  print('\n');
}
else if (CMD === 'write') {
  FILES.forEach(file =>
    new Sheets({ spreadsheetId: KEY, worksheet: `messages_${file}` })
      .then(data =>
        LANGUAGES.forEach(language => {
          const path = `${__dirname}/notifications/${PREFIXES[language]}_${file}.json`;
          let output = data.reduce((output, row) => {
            if (row[language]) {
              output.push({
                id: row.key,
                translation: ((s = row[language] || '', ss = s.split('|')) =>
                  ss[1] ? { other: ss[0], one: ss[1] } : s)()
              });
            }

            return output;
          }, []);

          const asObject = file.startsWith('base_');

          if (asObject) {
            output = output.reduce((output, row) => ({
              ...output,
              [row.id]: row.translation
            }), {});
          }

          output = JSON.stringify(output, null, 2);

          if (!asObject) {
            output = output
              .replace(/^\s\s/mg, '')
              .replace(/^\[[\r\n]/g, '[')
              .replace(/\}[\r\n]\]/g, '}]\n');
          }

          fs.writeFile(path, output, (err) => {
            if (err) {
              return error(`Something went wrong while writing to ${path}`, err);
            }

            return info(`Successfully wrote ${Object.keys(data).length} entries to ${path}`);
          });
        }))
      .catch((err) => {
        error(`Something went wrong while reading the data for "${file}"`);
        print(err);
      }));
}
else {
  info('Usage:\n\n$ node locale-sync [read|write]');
}
