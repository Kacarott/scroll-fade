'use babel';

/* global atom */

export default {

  // Set observers to apply fade to each editor window.
  activate() {
    this.setStyles();
    atom.workspace.observeTextEditors((e) => this.build(e.element,this));
  },

  // Apply the fader
  build(element, self) {
    let el = self.getElement();
    let bottomFade = atom.config.get('scroll-fade.bottomFade');
    if (bottomFade) {
      let le = self.getElement(true);
      element.childNodes[0].appendChild(le);
    }
    element.childNodes[0].appendChild(el);

    // Set event listeners for scrolling
    element.onDidChangeScrollTop((scrollTop) => {
      if (scrollTop == 0 && self.isVisible(element)) {
        self.hide(element);
      } else if (scrollTop > 5 &! self.isVisible(element)) {
        self.show(element);
      }
      if (!atom.config.get('element.scrollPastEnd') && bottomFade) {
        let height = parseInt(element.querySelector('.scroll-view')
          .childNodes[0].style.height);
        let currScroll = element.getScrollBottom();
        let isVis = self.isVisible(element, true);
        if (isVis && currScroll + 10 >= height) {
          self.hide(element, true);
        } else if (!isVis && currScroll + 10 < height) {
          self.show(element, true);
        }
      }
    });
  },

  isVisible(editor,isBottom=false) {
    return this.getFader(editor, isBottom)
      .getAttribute("visibility") == "visible";
  },

  hide(editor,isBottom=false) {
    this.getFader(editor, isBottom).setAttribute("visibility","hidden");
  },

  show(editor,isBottom=false) {
    this.getFader(editor, isBottom).setAttribute("visibility","visible");
  },

  // Get editor-specific fader
  getFader(editor,isBottom=false) {
    let el = editor.childNodes[0].childNodes;
    for (let c = 0; c < el.length; c++) {
      let elClass = el[c].getAttribute('class');
      if (elClass && elClass.indexOf("scroll-fade") != -1 &&
         ((elClass.indexOf("bottom") != -1) == isBottom)) {
        return el[c];
      }
    }
  },

  // Builds a fader div
  getElement(isBottom=false) {
    let element = document.createElement('div');
    element.classList.add('scroll-fade');
    if (isBottom) element.classList.add('bottom');
    element.setAttribute("visibility",(isBottom) ? "visible" : "hidden");
    return element;
  },

  // Set styles based on user preferences
  setStyles() {
    console.log()
    var style = document.createElement('style');
    style.innerHTML =
      '.scroll-fade[visibility="visible"] {' +
        'height: ' + atom.config.get('scroll-fade.fadeHeight') + 'px;}';
    var ref = document.querySelector('script');
    ref.parentNode.insertBefore(style, ref);
  },

  // Settings
  config: {
    fadeHeight: {
      title: 'Fader size',
      description: 'Set the height of the fade section (in px)',
      type: 'string',
      default: '40'
    },
    bottomFade: {
      title: 'Fade also applies to bottom of text editor',
      type: 'boolean',
      default: true
    }
  }
};
