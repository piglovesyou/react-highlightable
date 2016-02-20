import React from 'react';
import Helper from './helper';
import assert from 'power-assert';

export default class ContentEditable extends React.Component {
  constructor() {
    super();
    this.emitChange_ = this.emitChange_.bind(this);
  }

  componentWillMount() {
    if (this.props.prefix) {
      this.prefixRegex_ = new RegExp(`(${this.props.prefix}[^s.]+)`, 'g');
    } else if (this.props.tokens) {
      this.tokenRegexTable_ = Object.create(null);
      this.props.tokens.forEach(token => {
        this.tokenRegexTable_[token] = new RegExp(`(${token})`, 'g');
      });
    } else {
      assert.fail('booom');
    }
    if (this.prefixRegex_ && this.props.tokens.length) {
      this.replaceFn_ = (_, token, offset) => {
        return this.tokensTable_[token] ? this.props.highlighter(token, offset) : token;
      };
    } else {
      this.replaceFn_ = (_, token, offset) => {
        return this.props.highlighter(token, offset) || token;
      };
    }
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
      const pos = Helper.saveSelection(this.htmlEl_);
      let formatted;
      if (this.prefixRegex_) {
        formatted = textContent.replace(this.prefixRegex_, this.replaceFn_);
      } else {
        formatted = textContent;
        for (let token in this.tokenRegexTable_) {
          const tokenRegex = this.tokenRegexTable_[token];
          formatted = formatted.replace(tokenRegex, this.replaceFn_);
        }
      }
      this.htmlEl_.innerHTML = formatted;
      Helper.restoreSelection(this.htmlEl_, pos);
      if (this.props.onChange) {
        this.props.onChange(evt);
      }
    }
    this.lastTextContent_ = textContent;
  }
}
