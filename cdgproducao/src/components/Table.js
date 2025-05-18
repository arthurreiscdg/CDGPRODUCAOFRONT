import React from 'react';
import styled from 'styled-components';

const TableContainer = styled.div`
  overflow-x: auto;
  width: 100%;
`;

const StyledTable = styled.table`
  width: 100%;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.dark};
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: ${({ theme }) => theme.colors.light};
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.light};
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }
`;

const TableHeader = styled.th`
  padding: 0.75rem;
  vertical-align: bottom;
  text-align: left;
  border-bottom: 2px solid ${({ theme }) => theme.colors.light};
  font-weight: 600;
`;

const TableData = styled.td`
  padding: 0.75rem;
  vertical-align: middle;
`;

const TableBody = styled.tbody``;

const Table = ({ columns, data, onRowClick, ...props }) => {
  return (
    <TableContainer>
      <StyledTable {...props}>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableHeader key={index}>{column.header}</TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow 
              key={rowIndex} 
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              style={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
              {columns.map((column, colIndex) => (
                <TableData key={colIndex}>
                  {column.render ? column.render(row) : row[column.accessor]}
                </TableData>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </StyledTable>
    </TableContainer>
  );
};

export default Table;
