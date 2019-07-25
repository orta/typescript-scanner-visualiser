import { Fabric } from 'office-ui-fabric-react/lib/Fabric';

import React from 'react';
import { DetailsList, DetailsListLayoutMode, Selection, SelectionMode, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { TokenInfo } from '../pages';

const columns: IColumn[] = [
  {
    key: 'column1',
    name: 'File Type',
    ariaLabel: 'Column operations for File type, Press to sort on File type',
    iconName: 'Page',
    isIconOnly: true,
    fieldName: 'name',
    minWidth: 16,
    onRender: (item: TokenInfo) => {
      return <span>{item.token}</span>;
    }
  }]

interface Props {
  tokens: TokenInfo[]
  onHoverToken: ({ token: TokenInfo }) => void
}

export class TokenDetailsList extends React.Component<Props, any> {
  public render() {
    return (
      <Fabric>

        <DetailsList
          items={this.props.tokens}
          columns={columns}
          selectionMode={SelectionMode.none}
          getKey={this._getKey}
          setKey="set"
          layoutMode={DetailsListLayoutMode.justified}
          isHeaderVisible={true}
          selectionPreservedOnEmptyClick={true}
          enterModalSelectionOnTouch={true}
          ariaLabelForSelectionColumn="Toggle selection"
          ariaLabelForSelectAllCheckbox="Toggle selection for all items"
          onRenderRow={this._onRenderRow}
        />
      </Fabric>
    );
  }
  _onRenderRow = (props: any, defaultRender?: any): JSX.Element => {
    return defaultRender({
      ...props,
      onMouseOver: (e) => this.props.onHoverToken(props)
    });

  }


  private _getKey(item: any, index?: number): string {
    return index.toString();
  }
}
