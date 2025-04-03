import React, { useMemo } from "react";
import { useTable } from "react-table";
import { GiHamburgerMenu } from "react-icons/gi";

function BlogTable({ Blogss,setBlogMenu, setShowBlogDetails, userData }) {
  const columns = useMemo(
    () => [
      {
        Header: "Sr. No",
        Cell: ({ row: { index } }) => index + 1,
      },
      {
        Header: "Review",
        accessor: "title",
        Cell: ({ row: { original }, cell: { value } }) => (
          <span
            className="cursor-pointer hover:text-blue-500 hover:underline"
            onClick={() => setShowBlogDetails(original)}
          >
            {value?.slice(0, 40) + "..."}
          </span>
        ),
      },
      {
        Header: "Sector",
        accessor: "sector",
      },
      {
        Header: "Written By",
        accessor: "author",
      },
      {
        Header: "Published Date",
        accessor: "date",
      },
    ],
    []
  );

  const tableInstance = useTable({ columns, data: Blogss });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;
  return (
    <div
      className={`mt-10 mb-10 flex flex-col items-center justify-center w-[1032px]`}
    >
      {userData && (
        <span className="w-full flex items-end justify-end mt-[-5rem] mb-[2rem]">
          <GiHamburgerMenu
            onClick={() => setBlogMenu(true)}
            className="cursor-pointer flex items-center justify-center text-2xl"
          />
        </span>
      )}
      <div className="overflow-x-auto overflow-y-auto max-h-[60vh]">
        <table
          {...getTableProps()}
          className="min-w-full bg-white divide-y divide-gray-200"
        >
          <thead
            className="bg-[#81BC06] text-black text-2xl"
            style={{ borderRadius: 0 }}
          >
            {headerGroups.map((headerGroup) => (
              <tr
                {...headerGroup.getHeaderGroupProps()}
                style={{ borderRadius: 0 }}
              >
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    className="px-6 py-3 text-left text-xs bg-transparent font-medium uppercase tracking-wider"
                    style={{ borderRadius: 0 }}
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody
            {...getTableBodyProps()}
            className="bg-[#F8F8F8] divide-y divide-gray-200"
          >
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                      className="px-6 py-4 text-[#10100f] whitespace-nowrap"
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BlogTable;
