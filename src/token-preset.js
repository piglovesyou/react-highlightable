module.exports = {

  /* http://stackoverflow.com/a/3809435 */
  URL: /([-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?)/gi,

  /* http://www.regular-expressions.info/email.html */
  EMAIL: /([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})/gi,

  USER_MENTION: /(@[a-z0-9_-]+)/gi

};
