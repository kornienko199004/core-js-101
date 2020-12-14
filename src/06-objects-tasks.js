/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = function getArea() {
    return this.width * this.height;
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const instance = JSON.parse(json);

  const keys = Object.keys(instance);
  const values = Object.values(instance);

  function SpecialObj(...args) {
    Array.from(args).forEach((key, index) => {
      this[keys[index]] = key;
    });
  }

  SpecialObj.prototype = proto;

  return new SpecialObj(...values);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

function MySuperBaseElementSelector() {
  this.arr = [];
  this.order = [];
}

MySuperBaseElementSelector.prototype.element = function element(value) {
  if (this.hasElement) {
    throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
  }
  this.hasElement = true;
  this.arr.push(`${value}`);
  this.checkOrder(1);
  this.order.push(1);
  return this;
};

MySuperBaseElementSelector.prototype.id = function id(value) {
  if (this.hasId) {
    throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
  }
  this.hasId = true;
  this.arr.push(`#${value}`);
  this.checkOrder(2);
  this.order.push(2);
  return this;
};

MySuperBaseElementSelector.prototype.class = function class1(value) {
  this.arr.push(`.${value}`);
  this.checkOrder(3);
  this.order.push(3);
  return this;
};

MySuperBaseElementSelector.prototype.attr = function attr(value) {
  this.arr.push(`[${value}]`);
  this.checkOrder(4);
  this.order.push(4);
  return this;
};

MySuperBaseElementSelector.prototype.pseudoClass = function pseudoClass(value) {
  this.arr.push(`:${value}`);
  this.checkOrder(5);
  this.order.push(5);
  return this;
};

MySuperBaseElementSelector.prototype.pseudoElement = function pseudoElement(value) {
  if (this.hasPseudoElement) {
    throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
  }
  this.hasPseudoElement = true;
  this.arr.push(`::${value}`);
  this.checkOrder(6);
  this.order.push(6);
  return this;
};

MySuperBaseElementSelector.prototype.combine = function combine(selector1, combinator, selector2) {
  this.arr = [selector1.stringify(), ` ${combinator} `, selector2.stringify()];
  return this;
};

MySuperBaseElementSelector.prototype.checkOrder = function checkOrder(number) {
  if (this.order.slice(-1) && this.order.slice(-1) > number) {
    throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
  }
};

MySuperBaseElementSelector.prototype.stringify = function stringify() {
  const result = this.arr.join('');
  return result;
};

const cssSelectorBuilder = {
  element(value) {
    const instance = new MySuperBaseElementSelector();
    instance.element(value);
    instance.hasElement = true;
    return instance;
  },

  id(value) {
    const instance = new MySuperBaseElementSelector();
    instance.id(value);
    instance.hasId = true;
    return instance;
  },

  class(value) {
    const instance = new MySuperBaseElementSelector();
    instance.class(value);
    return instance;
  },

  attr(value) {
    const instance = new MySuperBaseElementSelector();
    instance.attr(value);
    return instance;
  },

  pseudoClass(value) {
    const instance = new MySuperBaseElementSelector();
    instance.pseudoClass(value);
    return instance;
  },

  pseudoElement(value) {
    const instance = new MySuperBaseElementSelector();
    instance.pseudoElement(value);
    instance.hasPseudoElement = true;
    return instance;
  },

  combine(selector1, combinator, selector2) {
    const instance = new MySuperBaseElementSelector();
    instance.combine(selector1, combinator, selector2);
    return instance;
  },

  // stringify() {
  //   const result = this.instance.stringify();
  //   return result;
  // },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
