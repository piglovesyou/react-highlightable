import React from 'react';
import Helper from './helper';
import assert from 'power-assert';
import TokenPreset from './token-preset';

export default class Highlightable extends React.Component {
  constructor() {
    super();
    this.emitChange_ = this.emitChange_.bind(this);
  }

  componentWillMount() {
    assert(this.props.token);
    const tokens = Array.isArray(this.props.token) ?
        this.props.token : [this.props.token];
    this.regexes_ = tokens.map(token => {
      if (token instanceof RegExp) {
        return token
      } else if (typeof token === 'string') {
        return new RegExp(`(${token})`, 'g');
      }
      assert.fail();
    });
  }

  componentDidMount() {
    this.highlight_(this.htmlEl_.textContent);
  }

  render() {
    return React.createElement(
      this.props.tagName || 'div',
      Object.assign({}, this.props, {
        ref: (e) => this.htmlEl_ = e,
        onInput: this.emitChange_,
        onBlur: this.emitChange_,
        contentEditable: !this.props.disabled,
        dangerouslySetInnerHTML: {__html: this.props.html}
      }),
      this.props.children);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.html !== this.htmlEl_.innerHTML ||
           this.props.disabled !== nextProps.disabled;
  }

  componentDidUpdate() {
    if ( this.props.html !== this.htmlEl_.innerHTML ) {
     this.htmlEl_.innerHTML = this.props.html;
    }
  }

  emitChange_(evt) {
    const textContent = this.htmlEl_.textContent;
    if (textContent !== this.lastTextContent_) {
      this.highlight_(textContent);
      if (this.props.onChange) {
        this.props.onChange(evt);
      }
    }
    this.lastTextContent_ = textContent;
  }

  highlight_(textContent) {
    let pos;
    try {
      pos = Helper.saveSelection(this.htmlEl_);
    } catch(e) {}
    this.htmlEl_.innerHTML = this.regexes_.reduce((textContent, regex) => {
      return textContent.replace(regex, (_, token, offset) => {
        return this.props.highlighter(token, offset);
      });
    }, textContent);
    if (pos) {
      Helper.restoreSelection(this.htmlEl_, pos);
    }
  }
}

Highlightable.TokenPreset = TokenPreset;
