
const React = require('react');
const ReactDOM = require('react-dom');
const Highlightable = require('../react-highlightable');


ReactDOM.render(
  <div>

    <h3>Example 1: User mention and URL</h3>
    <Highlightable
      className="highlightable"
      onChange={onChange.bind(this)}
      token={[Highlightable.TokenPreset.URL, Highlightable.TokenPreset.USER_MENTION]}
      highlighter={[
        link => `<span class="hilite hilite--link">${link}</span>`,
        user => `<span class="hilite hilite--user">${user}</span>`
      ]}
      value='@one and @two are you still there? www.google.com'
    ></Highlightable>

    <h3>Example 2: Email</h3>
    <Highlightable
      className="highlightable"
      onChange={onChange.bind(this)}
      token={Highlightable.TokenPreset.EMAIL}
      highlighter={(email) => `<span class="hilite hilite--email" href="mailto:${email}">${email}</span>`}
      value='Visit example.com or give me an email to yeah@yeah.com.'
    ></Highlightable>

    <h3>Example 3: Prohibited tokens</h3>
    <Highlightable
      className="highlightable"
      onChange={onChange.bind(this)}
      token='yeah|ohh'
      highlighter={token => `<span class="hilite hilite--token">${token}</span>`}
      value='Lorem ipsum dolor sit amet, yeah consectetur adipiscing elit. Duis eget leo lorem. ohhVivamus pretium risus ac orci molestie, eget malesuada est scelerisque.'
    ></Highlightable>

  </div>,
  document.getElementById('app'));

function onChange(e) {
  console.log(e.target.value);
}

function highlighter(token) {
  return `<a href="#" class="hilite">${token}</a>`
}
