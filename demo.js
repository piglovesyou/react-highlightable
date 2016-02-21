const React = require('react');
const ReactDOM = require('react-dom');
const Highlightable = require('../react-highlightable');
const validUsers = ["ariel", "belle", "jasmine"];


ReactDOM.render(
  <div>

    <h3>Example 1: User mention and URL</h3>
    <p>Valid users: {validUsers.join(', ')}</p>
    <Highlightable
      className="highlightable"
      onChange={onChange}
      pairs={[
        [Highlightable.TokenPreset.URL, 'hilite hilite--link'],
        [Highlightable.TokenPreset.USER_MENTION,
            token => `hilite hilite--user hilite--user-${
                validUsers.includes(token.slice('@'.length)) ?  'valid' : 'invalid'}`]
      ]}
      value='@jasmine and @belle are you still there? Visit www.google.com'
    ></Highlightable>

    <h3>Example 2: Email</h3>
    <Highlightable
      className="highlightable"
      onChange={onChange}
      pairs={[
        [Highlightable.TokenPreset.EMAIL, 'hilite hilite--email']
      ]}
      value='Give me an email to example@example.com.'
    ></Highlightable>

    <h3>Example 3: Prohibited tokens</h3>
    <Highlightable
      className="highlightable"
      onChange={onChange}
      pairs={[
        ['yeah|ohh', 'hilite hilite--token']
      ]}
      value='Lorem ipsum dolor sit amet, yeah consectetur adipiscing elit. Duis eget leo lorem. ohhVivamus pretium risus ac orci molestie, eget malesuada est scelerisque.'
    ></Highlightable>

  </div>,
  document.getElementById('app'));

function onChange(e) {
  console.log(e.target.value);
}
