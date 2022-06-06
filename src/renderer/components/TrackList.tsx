/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import styled from 'styled-components';
import { useTable, useResizeColumns, useFlexLayout, useRowSelect } from 'react-table';
import { Track } from 'shared/types/emusik';

interface TrackListProps {
  tHeight: number;
  tracks: Track[];
  trackPlaying: Track;
  setTrackPlaying: React.Dispatch<React.SetStateAction<Track>>;
  showCtxMenu: (trackId: string) => void;
}

const Styles = styled.div`
  padding: 0;
  ${'' /* These styles are suggested for the table fill all available space in its containing element */}
  display: block;
  ${'' /* These styles are required for a horizontaly scrollable table overflow */}
  overflow: auto;

  .table {
    border-spacing: 0;

    .thead {
      ${'' /* These styles are required for a scrollable body to align with the header properly */}
      overflow-y: auto;
      overflow-x: hidden;
    }

    .tbody {
      ${'' /* These styles are required for a scrollable table body */}
      overflow-y: scroll;
      overflow-x: hidden;
    }

    .tr {
      :hover {
        background-color: #313030;
      }

      :last-child {
        .td {
          border-bottom: 0;
        }
      }

      &.isSelected {
        background-color: #967a7a;
      }

      &.isPlaying {
        background-color: #1793f8;
      }

      border-bottom: 1px solid gray;
    }

    .th,
    .td {
      margin: 0;
      padding: 0.5rem 1rem;
      user-select: none;

      :first-child {
        padding: 0.4rem 0.5rem;
      }

      ${
        '' /* In this example we use an absolutely position resizer,
       so this is required. */
      }
      position: relative;

      :last-child {
        border-right: 0;
      }

      .resizer {
        right: 0;
        background: blue;
        width: 5px;
        height: 100%;
        position: absolute;
        top: 0;
        z-index: 1;
        ${'' /* prevents from scrolling while dragging on touch devices */}
        touch-action :none;

        &.isResizing {
          background: red;
        }
      }
    }
  }
`;

const headerProps = (props, { column }) => getStyles(props, column.align);

const cellProps = (props, { cell }) => getStyles(props, cell.column.align);

const getStyles = (props, align = 'left') => [
  props,
  {
    style: {
      justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
      alignItems: 'flex-start',
      display: 'flex',
    },
  },
];

interface TableViewProps extends TrackListProps {
  columns: any[];
}

// eslint-disable-next-line react/prop-types
const TableView: React.FC<TableViewProps> = props => {
  const { tHeight, tracks: data, trackPlaying, setTrackPlaying, showCtxMenu, columns } = props;
  const [selected, setSelected] = React.useState('');

  const defaultColumn = React.useMemo(
    () => ({
      // When using the useFlexLayout:
      minWidth: 25, // minWidth is only used as a limit for resizing
      width: 150, // width is used for both the flex-basis and flex-grow
      maxWidth: 200, // maxWidth is only used as a limit for resizing
    }),
    []
  );

  const { getTableProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
      defaultColumn,
    },
    useResizeColumns,
    useFlexLayout,
    useRowSelect
  );

  const onClick = (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>, row): void => {
    console.log('e', e);
    console.log('row', row);
    if (!row) return;
    const trackId = row.original.id;
    if (e.type === 'click') {
      setSelected(trackId);
      console.log('selected', selected);
    }

    if (e.type === 'auxclick') {
      showCtxMenu(trackId);
      console.log('trackId', trackId);
    }
  };

  const onDoubleClick = (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>, row): void => {
    if (row) {
      setTrackPlaying(row.original);
    }
  };

  return (
    <div {...getTableProps()} className="table">
      <div>
        {headerGroups.map(headerGroup => (
          <div
            {...headerGroup.getHeaderGroupProps({
              // style: { paddingRight: '15px' },
            })}
            className="tr"
          >
            {headerGroup.headers.map(column => (
              <div {...column.getHeaderProps(headerProps)} className="th">
                {column.render('Header')}
                {/* Use column.getResizerProps to hook up the events correctly */}
                {column.canResize && (
                  <div {...column.getResizerProps()} className={`resizer ${column.isResizing ? 'isResizing' : ''}`} />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="tbody" style={{ height: tHeight }}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <div
              {...row.getRowProps()}
              onClick={e => onClick(e, row)}
              onAuxClick={e => onClick(e, row)}
              onDoubleClick={e => onDoubleClick(e, row)}
              className={`tr 
                ${row.original.id === selected ? 'isSelected' : ''} 
                ${row.original === trackPlaying ? 'isPlaying' : ''}`}
            >
              {row.cells.map(cell => {
                return (
                  <div {...cell.getCellProps(cellProps)} className="td">
                    {cell.render('Cell')}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TrackList = (props: TrackListProps) => {
  const columns = React.useMemo(
    () => [
      {
        Header: '#',
        accessor: (row, i) => i,
        width: 25,
        align: 'center',
      },
      {
        Header: 'Title',
        accessor: 'title',
      },
      {
        Header: 'Artist',
        accessor: 'artist',
      },
      {
        Header: 'Time',
        accessor: 'time',
        width: 25,
        align: 'center',
      },
      {
        Header: 'Album',
        accessor: 'album',
      },
      {
        Header: 'Bit Rate',
        accessor: 'bitrate',
        width: 25,
      },
      {
        Header: 'BPM',
        accessor: 'bpm',
        width: 25,
      },
      {
        Header: 'Key',
        accessor: 'key',
        width: 25,
      },
      {
        Header: 'Year',
        accessor: 'year',
        width: 25,
      },
    ],
    []
  );

  const tableprops = {
    ...props,
    columns,
  };

  return (
    <Styles>
      <TableView {...tableprops} />
    </Styles>
  );
};

export default TrackList;
