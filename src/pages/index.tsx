import React from "react"
import { Stack, } from "office-ui-fabric-react"
import "./index.css"
import { Monaco, MonacoProps, editor } from "../editor/monaco";
import { TokenDetailsList } from "../editor/details"
import { formatEnum } from "../utils"

import * as ts from "typescript";

const scanner = ts.createScanner(ts.ScriptTarget.Latest, false);

// That is initialized using a function `initializeState` similar to
function initializeScannerState(text: string) {
  scanner.setText(text);
  scanner.setOnError((message: ts.DiagnosticMessage, length: number) => {
    console.error(message);
  });
  scanner.setScriptTarget(ts.ScriptTarget.ES5);
  scanner.setLanguageVariant(ts.LanguageVariant.Standard);
}

export interface TokenInfo {
  kind: ts.SyntaxKind
  token: string
  end: number
}

interface State {
  tokens: TokenInfo[]
}

export class App extends React.Component<any, State> {
  state = { tokens: [] }

  getTokens: MonacoProps["onEditorUpdated"] = (e) => {
    const tokens: TokenInfo[] = []

    const text = e.getModel().getValue()
    initializeScannerState(text)

    while (tokens.length) {
      tokens.pop()
    }

    let kind;
    while (kind != ts.SyntaxKind.EndOfFileToken) {
      kind = scanner.scan();
      const end = scanner.getTextPos()
      tokens.push({
        kind,
        token: formatEnum(kind, ts.SyntaxKind),
        end,
      })
    }

    this.setState({ tokens })
  }

  onHoverToken = (event: { item: TokenInfo }) => {
    if (!editor) return
    const monacoEditor = editor as import("monaco-editor").editor.IStandaloneCodeEditor
    const model = monacoEditor.getModel()

    const beforeIndex = this.state.tokens.indexOf(event.item) - 1

    let startPos = model.getPositionAt(0)
    if (beforeIndex >= 0) {
      const beforeToken = this.state.tokens[beforeIndex]
      startPos = model.getPositionAt(beforeToken.end)
    }
    const endPos = model.getPositionAt(event.item.end)

    // monacoEditor.getPos
    monacoEditor.setSelection({
      selectionStartLineNumber: startPos.lineNumber,
      selectionStartColumn: startPos.column,
      positionLineNumber: endPos.lineNumber,
      positionColumn: endPos.column,
    })

  }

  render() {
    return (
      <div className="page-content">
        <Stack horizontal gap={15} horizontalAlign="center">
          <Monaco onEditorUpdated={this.getTokens} ></Monaco>
          <div style={{ width: 400, height: 600, overflowY: "scroll" }}>
            <TokenDetailsList onHoverToken={this.onHoverToken} tokens={this.state.tokens}></TokenDetailsList>
          </div>
        </Stack>
      </div>

    )
  }
}

export default App
