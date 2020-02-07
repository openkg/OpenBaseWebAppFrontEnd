import React from 'react';
import CSSModule from 'react-css-modules';
import styles from './Table.scss';

@CSSModule(styles, { allowMultiple: true })
class Table extends React.PureComponent {
  findColumn = (name, columns) => {
    const column = columns.find(item => item.name === name);
    return column;
  };
  render() {
    const { columns, dataSource, parentStyles = {} } = this.props;
    return (
      <table styleName="table">
        <thead>
          <tr>
            {columns.map(column => {
              return <th key={column.name}>{column.title}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {(dataSource || []).map(row => {
            return (
              <tr key={Math.random()}>
                {columns.map(col => {
                  return (
                    <td title={row[col.name]} key={Math.random()} onClick={col.onClick} className={parentStyles[col.cls] || styles[col.cls]}>
                      {col.render ? col.render(col, row) : row[col.name]}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}
export default Table;
