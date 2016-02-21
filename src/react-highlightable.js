import React from 'react';
import Helper from './helper';
import assert from 'power-assert';
import TokenPreset from './token-preset';

const newlineTmpPlaceholder = '%%newline%%';
const newlineTmpPlaceholderRegexp = new RegExp(newlineTmpPlaceholder, 'g');
const highlightedElementRegexp = /<span[\s\S]*?>([\s\S]*?)<\/span>/g;
const newlineTargetRegexp = /(<div>)/g

export default class Highlightable extends React.Component {
  constructor() {
    super();
    this.emitChange_ = this.emitChange_.bind(this);
  }

  componentWillMount() {
    assert(this.props.pairs);
    assert(Array.isArray(this.props.pairs) || this.props.pairs instanceof Map);
    this.pairs_ = new Map();
    for (let [pattern, className] of this.props.pairs) {
      assert(pattern instanceof RegExp || typeof pattern === 'string');
      assert(typeof className === 'function' || typeof className === 'string');
      this.pairs_.set(pattern instanceof RegExp ? pattern : new RegExp(`(${pattern})`, 'g'), className);
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
    let innerHTML = this.htmlEl_.innerHTML.replace(highlightedElementRegexp, '$1');
    for (let [pattern, className] of this.pairs_) {
      innerHTML = innerHTML.replace(pattern, (_, token) => {
        const cn = typeof className === 'function' ? className(token) : className;
        return `<span class="${cn}">${token}</span>`;
      });
    }
    this.htmlEl_.innerHTML = innerHTML;
  }

  getValue() {
    const fragment = document.createElement('div');
    fragment.innerHTML = this.htmlEl_.innerHTML
        .replace(newlineTargetRegexp, newlineTmpPlaceholder + '$1')
    return fragment.textContent.replace(newlineTmpPlaceholderRegexp, '\n');
  }
}

Highlightable.TokenPreset = TokenPreset;
