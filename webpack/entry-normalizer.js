const path = require('path');

/**
 * Converts as follow:
 *   something.{extension}: './something.{extension}'
 *
 *  to
 *
 *   something: './something.{extension}'
 *
 * @param {?Object} obj
 * @param {Array<String>|String} tag
 * @return Object
 */
module.exports = (obj, tag) => {
  const result = {};
  const Tags = new Set();
  let requestedTags = [];

  if (Array.isArray(tag)) {
    requestedTags = tag;
  } else if (!!tag) {
    requestedTags = [tag];
  }

  if (obj) {
    const candidates = [];

    Object.keys(obj).forEach(name => {
      const value = obj[name];
      let tags = [];
      let source = value;
      const dist = path.basename(name, path.extname(name));
      let required = false;

      if (!Array.isArray(value) && typeof value !== 'string') {
        source = value.source;

        if (Array.isArray(value.tags)) {
          tags = value.tags;
        } else {
          tags = [value.tags];
        }

        required = !!value.required;

        if (!tags.length) {
          // If no tags, assume for always
          required = true;
        }
      }

      tags.forEach(t => Tags.add(t));

      candidates.push({
        source,
        dist,
        tags,
        required
      });
    });

    // Filtering any invalid tags
    requestedTags = requestedTags.filter(t => Tags.has(t));

    candidates.filter(candidate => {
      if (!requestedTags.length || candidate.required) {
        return true;
      }

      return candidate.tags.some(t => requestedTags.includes(t));
    }).forEach(candidate => {
      result[candidate.dist] = candidate.source;
    });
  }

  return result;
};
