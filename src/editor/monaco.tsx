import React, { Component } from 'react';

export interface MonacoProps {
  onEditorUpdated: (editor: import("monaco-editor").editor.IStandaloneCodeEditor) => void //typeof api.editor.onDidChangeModelContent
}

interface State {
  editor: import("monaco-editor").editor.IStandaloneCodeEditor
}

export let editor: any = undefined

export class Monaco extends Component<MonacoProps, State> {

  render() {
    return (
      <div id="container" style={{ width: 800, height: 600, border: "1px solid #ccc" }}></div>
    );
  }

  componentDidMount() {
    import("monaco-editor").then(monaco => {
      editor = monaco.editor.create(document.getElementById('container'), {
        value:
          `class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
  greet() {
    return "Hello, " + this.greeting;
  }
}

let greeter = new Greeter("world");

let button = document.createElement("button");
button.textContent = "Say Hello";
button.onclick = function() {
  alert(greeter.greet());
};

document.body.appendChild(button);
`,
        language: 'typescript'
      });

      this.setState({ editor })
      this.props.onEditorUpdated(editor)
      editor.onDidChangeModelContent(() => this.props.onEditorUpdated(editor));
    });
  }
}

