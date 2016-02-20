import React from 'react';
import Helper from './helper';
import assert from 'power-assert';
import TokenPreset from './token-preset';

const newlineHtmlRegexp = /<br>/g;
const newlineTmpPlaceholder = '%%newline%%';
const newlineTmpPlaceholderRegexp = new RegExp(newlineTmpPlaceholder, 'g');

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
    if (Array.isArray(this.props.tokenClassName)) {
      assert(this.regexes_.length === this.props.tokenClassName.length);
      this.tokenClassNames_ = this.props.tokenClassName;
    } else {
      this.tokenClassNames_ = [this.props.tokenClassName];
    }
  }

  componentDidMount() {
    this.highlight_();
  }

  render() {
    return React.createElement(
      this.props.tagName || 'div',
      Object.assign({}, this.props, {
        ref: (e) => this.htmlEl_ = e,
        onKeyUp: this.emitChange_,
        onBlur: this.emitChange_,
        contentEditable: !this.props.disabled,
        dangerouslySetInnerHTML: {__html: this.props.value}
      }));
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.html !== this.htmlEl_.innerHTML ||
           this.props.disabled !== nextProps.disabled;
  }

  emitChange_(evt) {
    if (this.htmlEl_.innerHTML !== this.lastInnerHTML) {

      if (Helper.keyIsAvailable(evt.nativeEvent)) {
        let pos = Helper.saveSelection(this.htmlEl_);
        this.highlight_();
        Helper.restoreSelection(this.htmlEl_, pos);
      }

      if (this.props.onChange) {
        evt.target.value = this.getValue();
        this.props.onChange(evt);
      }

    }
    this.lastInnerHTML = this.htmlEl_.innerHTML;
  }

  highlight_() {
    this.htmlEl_.innerHTML = this.htmlEl_.innerHTML.replace(/<span[\s\S]*?>([\s\S]*?)<\/span>/g, '$1');
    this.htmlEl_.innerHTML = this.regexes_.reduce((innerHTML, regex, index) => {
      return innerHTML.replace(regex, (_, token) => {
        const tokenClassName = this.tokenClassNames_[index];
        const className = typeof tokenClassName === 'function' ? tokenClassName(token) : tokenClassName;
        return `<span class="${className}">${token}</span>`;
      });
    }, this.htmlEl_.innerHTML);
  }

  getValue() {
    const fragment = document.createElement('div');
    fragment.innerHTML = this.htmlEl_.innerHTML.replace(newlineHtmlRegexp, newlineTmpPlaceholder);
    return fragment.textContent.replace(newlineTmpPlaceholderRegexp, '\n');
  }
}

Highlightable.TokenPreset = TokenPreset;
