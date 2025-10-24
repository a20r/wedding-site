const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ 'src/assets': 'assets' });
  eleventyConfig.addPassthroughCopy({ 'src/styles': 'styles' });

  eleventyConfig.addWatchTarget('./src/styles/');
  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.addNunjucksFilter('date', (isoString, _format, timezone = 'UTC') => {
    const date = new Date(isoString);
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    const parts = formatter.formatToParts(date).reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});
    return `${parts.weekday}, ${parts.month} ${parts.day} • ${parts.hour}:${parts.minute} ${parts.dayPeriod}`.replace('undefined', '').trim();
  });
  eleventyConfig.addNunjucksFilter('friendlyDate', (isoString, timezone = 'UTC') => {
    if (!isoString) return '';
    const [year, month, day] = String(isoString).split('-').map((part) => Number(part));
    const date = new Date(Date.UTC(year, month - 1, day));
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    return formatter.format(date);
  });
  eleventyConfig.addGlobalData('criticalCss', () => {
    const filePath = resolve(__dirname, 'src/styles/critical.css');
    try {
      return readFileSync(filePath, 'utf8');
    } catch {
      return '';
    }
  });

  eleventyConfig.setBrowserSyncConfig({
    files: ['dist/assets/*.js']
  });

  return {
    dir: {
      input: 'src',
      output: 'dist',
      includes: '_includes',
      data: '_data'
    },
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    templateFormats: ['njk', 'md', '11ty.js']
  };
};
