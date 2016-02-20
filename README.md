react-highlightable
=====================

Highlightable textarea of React component using contenteditable

## Usage
```javascript
const Highlightable = requrie('react-highlightable');
<ContentEditable
  html={this.state.html} // innerHTML of the editable div
  disabled={true}       // use true to disable edition
  onChange={handleChange} // handle innerHTML change
/>
```

## Structure of this repository
 * [`lib/`](https://github.com/lovasoa/react-contenteditable/tree/master/lib) compiled javascript, usable directly in the browser
 * [`src/`](https://github.com/lovasoa/react-contenteditable/tree/master/src) source javascript. Uses JSX and ES6.

