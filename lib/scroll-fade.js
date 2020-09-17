'use babel';

export default {

  // Set observers to apply fade to each editor window.
  activate(state) {
    atom.workspace.observeTextEditors((e) => this.build(e.element,this));
  },

  // Apply the fader
  build(editor, self) {
    let el = self.getElement();
    if (editor.scrollTop) {
      el.setAttribute("visibility","visible");
    }
    editor.childNodes[0].appendChild(el);
    // Set event listeners for scrolling
    editor.onDidChangeScrollTop((scrollTop) => {
      let ed = atom.workspace.getActiveTextEditor().editorElement;
      if (scrollTop == 0 && self.isVisible(ed)) {
        self.hide(ed);
      } else if (scrollTop > 5 &! self.isVisible(ed)) {
        self.show(ed);
      }
    })
  },

  isVisible(editor) {
    return this.getFader(editor)
      .getAttribute("visibility") == "visible";
  },

  hide(editor) {
    this.getFader(editor).setAttribute("visibility","hidden");
  },

  show(editor) {
    this.getFader(editor).setAttribute("visibility","visible");
  },

  // Get editor-specific fader
  getFader(editor) {
    let el = editor.childNodes[0].childNodes;
    for (let c = 0; c < el.length; c++) {
      if (el[c].getAttribute('class') == "scroll-fade") {
        return el[c];
      }
    }
  },

  // Builds a fader div
  getElement() {
    let element = document.createElement('div');
    element.classList.add('scroll-fade');
    element.setAttribute("visibility","hidden");
    return element;
  }
};
