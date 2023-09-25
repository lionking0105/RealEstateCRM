import {
  Box,
  Button,
  Flex,
  Table, Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

// Custom components
import { AddIcon } from "@chakra-ui/icons";
import Card from "components/card/Card";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import Pagination from "components/pagination/Pagination";
import Spinner from "components/spinner/Spinner";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import EventView from "../eventView";

export default function CheckTable(props) {
  const { columnsData, fetchData, data, isLoding, setTaskModel, className } = props;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const columns = useMemo(() => columnsData, [columnsData]);
  // const [selectedValues, setSelectedValues] = useState([]);
  const [eventView, setEventView] = useState(false)
  const [id, setId] = useState()
  const [gopageValue, setGopageValue] = useState()

  // const data = useMemo(() => tableData, [tableData]);

  const tableInstance = useTable(
    {
      columns, data,
      initialState: { pageIndex: 0 }
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = tableInstance;

  if (pageOptions.length < gopageValue) {
    setGopageValue(pageOptions.length)
  }

  const handleDateClick = (cell) => {
    setId(cell?.row?.values?._id)
    setEventView(true)
  }

  return (
    <Card
      direction="column"
      w="100%"
      px="0px"
      overflowX={{ sm: "scroll", lg: "hidden" }}
    >
      <EventView fetchData={fetchData} isOpen={eventView} onClose={setEventView} info={id} />
      <Flex px="25px" justify="space-between" mb="20px" align="center">
        <Text
          color={'secondaryGray.900'}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
        >
          Tasks (<CountUpComponent targetNumber={data?.length} />)
        </Text>
        {setTaskModel && <Button onClick={() => setTaskModel(true)} leftIcon={<AddIcon />} colorScheme="gray" >Create Task</Button>}
      </Flex>

      <Box overflowY={"auto"} className={className}>
        <Table {...getTableProps()} variant="simple" color="gray.500" mb="24px">
          <Thead>
            {headerGroups?.map((headerGroup, index) => (
              <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers?.map((column, index) => (
                  <Th
                    {...column.getHeaderProps(column.isSortable !== false && column.getSortByToggleProps())}
                    pe="10px"
                    key={index}
                    borderColor={borderColor}
                  >
                    <Flex
                      justify="space-between"
                      align="center"
                      fontSize={{ sm: "10px", lg: "12px" }}
                      color="gray.400"
                    >
                      {column.render("Header")}
                      {column.isSortable !== false && (
                        <span>
                          {column.isSorted ? (column.isSortedDesc ? <FaSortDown /> : <FaSortUp />) : <FaSort />}
                        </span>
                      )}
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {isLoding ?
              <Tr>
                <Td colSpan={columns?.length}>
                  <Flex justifyContent={'center'} alignItems={'center'} width="100%" color={textColor} fontSize="sm" fontWeight="700">
                    <Spinner />
                  </Flex>
                </Td>
              </Tr>
              : data?.length === 0 ? (
                <Tr>
                  <Td colSpan={columns.length}>
                    <Text textAlign={'center'} width="100%" color={textColor} fontSize="sm" fontWeight="700">
                      -- No Data Found --
                    </Text>
                  </Td>
                </Tr>
              ) : page?.map((row, i) => {
                prepareRow(row);
                return (
                  <Tr {...row?.getRowProps()} key={i}>
                    {row?.cells?.map((cell, index) => {
                      let data = "";
                      if (cell?.column.Header === "#") {
                        data = (
                          <Flex align="center">
                            {/* <Checkbox colorScheme="brandScheme" value={selectedValues} isChecked={selectedValues.includes(cell?.value)} onChange={(event) => handleCheckboxChange(event, cell?.value)} me="10px" /> */}
                            <Text color={textColor} fontSize="sm" fontWeight="700">
                              {cell?.row?.index + 1}
                            </Text>
                          </Flex>
                        );
                      } else if (cell?.column.Header === "Title") {
                        data = (
                          <Text
                            onClick={() => handleDateClick(cell)}
                            me="10px"
                            sx={{ '&:hover': { color: 'blue.500', textDecoration: 'underline' }, cursor: 'pointer' }}
                            color='green.400'
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {cell?.value}
                          </Text>
                        );
                      } else if (cell?.column.Header === "Related") {
                        data = (
                          <Text
                            me="10px"
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {cell?.value ? cell?.value : ' - '}
                          </Text>
                        );
                      } else if (cell?.column.Header === "Assignment To") {
                        data = (
                          <Text
                            me="10px"
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {cell?.value ? cell?.value : ' - '}
                          </Text>
                        );
                      } else if (cell?.column.Header === "Start Date") {
                        data = (
                          <Text color={textColor} fontSize="sm" fontWeight="700">
                            {cell?.value}
                          </Text>
                        );
                      } else if (cell?.column.Header === "End Date") {
                        data = (
                          <Text color={textColor} fontSize="sm" fontWeight="700">
                            {cell?.value ? cell?.value : cell?.row?.values.start}
                          </Text>
                        );
                      }
                      return (
                        <Td
                          {...cell?.getCellProps()}
                          key={index}
                          fontSize={{ sm: "14px" }}
                          minW={{ sm: "150px", md: "200px", lg: "auto" }}
                          borderColor="transparent"
                        >
                          {data}
                        </Td>
                      );
                    })}
                  </Tr>
                );
              })}
          </Tbody>
        </Table>
      </Box>
      {data?.length > 5 && <Pagination gotoPage={gotoPage} gopageValue={gopageValue} setGopageValue={setGopageValue} pageCount={pageCount} canPreviousPage={canPreviousPage} previousPage={previousPage} canNextPage={canNextPage} pageOptions={pageOptions} setPageSize={setPageSize} nextPage={nextPage} pageSize={pageSize} pageIndex={pageIndex} />}


    </Card >
  );
}
